import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: () => {
      return prisma.user.findMany();
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) return null;
      // Fetch user from DB for fresh data
      const user = await prisma.user.findUnique({ where: { id: context.user.id }, include: { role: { include: { permissions: true } } } });
      if (!user) return null;
      return {
        id: user.id,
        phone: user.phone,
        password: user.password,
        username: user.username,
        display_name: user.display_name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
          permissions: user.role.permissions.map((perm: any) => ({
            id: perm.id,
            name: perm.name,
            description: perm.description,
            createdAt: perm.createdAt,
            updatedAt: perm.updatedAt
          }))
        }
      };
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      args: { phone?: string; username?: string; password: string },
      context: any
    ) => {
      const { prisma, res } = context;
      try {
        // Prefer username, fallback to phone
        const loginId = args.username || args.phone;
        console.log("Login attempt for user:", loginId);
        // Use authService.loginUser if available, else inline logic
        let user;
        if (args.phone) {
          user = await prisma.user.findUnique({ where: { phone: args.phone }, include: { role: { include: { permissions: true } } } });
        } else if (args.username) {
          user = await prisma.user.findUnique({ where: { username: args.username }, include: { role: { include: { permissions: true } } } });
        }
        if (!user) {
          throw new Error('Invalid phone/username or password');
        }
        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error('Invalid phone/username or password');
        }
        const jwt = require('jsonwebtoken');
        const accessToken = jwt.sign({ userId: user.id, phone: user.phone, username: user.username }, process.env.JWT_SECRET || 'secret', {
          expiresIn: '15m',
        });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
          expiresIn: '7d',
        });
        // Save refreshToken in DB
        await prisma.refreshToken.create({
          data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        // Set cookies
        if (res) {
          res.cookie('accessToken', accessToken, {
            httpOnly: false, // allow JS to read for frontend auth
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            path: '/',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          });
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          });
        }
        // Return user object (same shape as me)
        return {
          user: {
            id: user.id,
            phone: user.phone,
            password: user.password,
            username: user.username,
            display_name: user.display_name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: {
              id: user.role.id,
              name: user.role.name,
              description: user.role.description,
              createdAt: user.role.createdAt,
              updatedAt: user.role.updatedAt,
              permissions: user.role.permissions.map((perm: any) => ({
                id: perm.id,
                name: perm.name,
                description: perm.description,
                createdAt: perm.createdAt,
                updatedAt: perm.updatedAt
              }))
            }
          },
          accessToken,
          refreshToken
        };
      } catch (error) {
        console.error("Error during login:", error);
        throw new Error('Failed to login user.');
      }
    },
    async refreshToken(_: any, { refreshToken }: { refreshToken?: string }, context: any) {
      const jwt = require('jsonwebtoken');
      // If no refreshToken argument provided, try to read cookie from request
      let token = refreshToken;
      try {
        if (!token && context && context.req && context.req.headers && context.req.headers.cookie) {
          const cookies = context.req.headers.cookie.split(';').map((c: string) => c.trim());
          for (const c of cookies) {
            if (c.startsWith('jwt=')) {
              token = decodeURIComponent(c.split('=')[1]);
              break;
            }
          }
        }
      } catch (e) {
        // ignore cookie parsing errors
      }

      if (!token) {
        throw new Error('Refresh token not provided');
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
      } catch (e) {
        throw new Error('Invalid refresh token');
      }
      const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
      if (!dbToken || dbToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }
      const user = await prisma.user.findUnique({ where: { id: dbToken.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const accessToken = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '15m',
      });
      return { accessToken };
    },
    logout: async (_: any, __: any, context: any) => {
      const { res, req, prisma, user } = context;
      // Remove refresh token from DB
      if (user) {
        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
      }
      // Clear cookies
      if (res) {
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('jwt', { path: '/' });
      }
      return true;
    },
  },
};

// User controller example
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export class UserController {
    private userService = new UserService();

    async getUser(req: any, res: any) {
        const user = await this.userService.getUserById(req.params.id);
        res.json(user);
    }

    // Login controller
    static loginSchema = z.object({
        phone: z.string().min(6),
        password: z.string().min(6),
    });

    static login = [
        validate({ body: UserController.loginSchema }),
        async (req: Request, res: Response) => {
            const { phone, password } = req.body;
            const userService = new UserService();
            const user = await userService.findByPhone(phone);
            if (!user) {
                return res.status(401).json({ error: 'Invalid phone or password' });
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid phone or password' });
            }
            // Issue access token
            const accessToken = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'secret', {
                expiresIn: '15m',
            });
            // Issue refresh token
            const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
                expiresIn: '7d',
            });
            // Save refreshToken in DB (RefreshToken model)
            await userService.saveRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
            res.json({ accessToken, refreshToken });
        },
    ];

    // Refresh token controller
    static refreshTokenSchema = z.object({
        refreshToken: z.string().min(10),
    });

    static refresh = [
        validate({ body: UserController.refreshTokenSchema }),
        async (req: Request, res: Response) => {
            const { refreshToken } = req.body;
            const userService = new UserService();
            try {
                // Verify refresh token
                const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;
                // Check if token exists in DB and is not expired
                const prisma = userService['prisma'];
                const dbToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
                if (!dbToken || dbToken.expiresAt < new Date()) {
                    return res.status(401).json({ error: 'Invalid or expired refresh token' });
                }
                // Issue new access token
                const user = await userService.getUserById(payload.userId);
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }
                const accessToken = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'secret', {
                    expiresIn: '15m',
                });
                res.json({ accessToken });
            } catch (err) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }
        },
    ];
}

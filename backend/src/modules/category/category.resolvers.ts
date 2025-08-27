import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    categories: async () => {
      return await prisma.category.findMany();
    },
  },
  Mutation: {
    createCategory: async (_: any, { input }: any) => {
      return await prisma.category.create({ data: input });
    },
    updateCategory: async (_: any, { id, input }: any) => {
      return await prisma.category.update({ where: { id }, data: input });
    },
    deleteCategory: async (_: any, { id }: any) => {
      await prisma.category.delete({ where: { id } });
      return true;
    },
  },
};

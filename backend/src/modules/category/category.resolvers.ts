import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    categories: async () => {
      return await prisma.category.findMany({
        include: {
          products: true,
        },
      });
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
  Category: {
    parent: async (parent: any) => {
      if (!parent.parentId) return null;
      return await prisma.category.findUnique({ where: { id: parent.parentId } });
    },
    children: async (parent: any) => {
  return await prisma.category.findMany({ where: { parentId: parent.id } });
    },
    products: async (parent: any) => {
      return await prisma.product.findMany({ where: { categories: { some: { id: parent.id } } } });
    },
  },
};

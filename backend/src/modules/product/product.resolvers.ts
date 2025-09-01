// For Apollo Server v4+, use 'graphql-upload-minimal' or built-in scalar
import { GraphQLUpload } from 'graphql-upload-minimal';
import path from 'path';
import fs from 'fs';
import { calculatePagination, createPaginationResult } from '../../utils/pagination';

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    products: async (_: any, { pagination, search }: any, { prisma }: any) => {
      const { skip, take, orderBy, page, limit } = calculatePagination(pagination || {});
      
      // Build where clause with optional search functionality
      const where: any = { enabled: true };
      
      // Only add search filters if search parameter is provided and not empty
      if (search && typeof search === 'string' && search.trim().length > 0) {
        where.OR = [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { description: { contains: search.trim(), mode: 'insensitive' } }
        ];
      }
      
      const [items, totalItems] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            categories: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return createPaginationResult(items, totalItems, page, limit);
    },
    allProducts: async (_: any, { search }: any, { prisma }: any) => {
      // For dashboard and other views that need all products
      const where: any = { enabled: true };
      
      // Only add search filters if search parameter is provided and not empty
      if (search && typeof search === 'string' && search.trim().length > 0) {
        where.OR = [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { description: { contains: search.trim(), mode: 'insensitive' } }
        ];
      }
      
      return prisma.product.findMany({ 
        where,
        include: {
          categories: true,
        },
        orderBy: { name: 'asc' } // Default ordering for dashboard
      });
    },
    product: async (_: any, { id }: { id: string }, { prisma }: any) => {
      return prisma.product.findUnique({ 
        where: { id },
        include: {
          categories: true,
        },
      });
    },
  },
  Mutation: {
    createProduct: async (_: any, { input, file }: any, { prisma }: any) => {
      let imageUrl = input.image;
      if (file) {
        const { createReadStream, filename } = await file;
        const ext = path.extname(filename);
        const newFilename = `${Date.now()}${ext}`;
        const uploadsDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const uploadPath = path.join(uploadsDir, newFilename);
        await new Promise((resolve, reject) => {
          const stream = createReadStream();
          const out = fs.createWriteStream(uploadPath);
          stream.pipe(out);
          out.on('finish', () => resolve(undefined));
          out.on('error', reject);
        });
        imageUrl = `/uploads/${newFilename}`;
      }
  const { name, price, description, categories, enabled } = input;
      // Check if all categories exist
      if (categories && categories.length > 0) {
        const foundCategories = await prisma.category.findMany({ where: { id: { in: categories } } });
        if (foundCategories.length !== categories.length) {
          throw new Error('One or more categories not found. Please select valid categories.');
        }
      }
      const product = await prisma.product.create({
        data: {
          name,
          price,
          description,
          image: imageUrl,
          enabled: enabled !== undefined ? enabled : true,
          categories: categories && categories.length > 0 ? { connect: categories.map((id: string) => ({ id })) } : undefined,
        },
      });
      return product;
    },
    updateProduct: async (_: any, { id, input, file }: any, { prisma }: any) => {
      let imageUrl = input.image;
      if (file) {
        // Get old image path from DB
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        const oldImagePath = oldProduct?.image;
        // Upload new image
        const { createReadStream, filename } = await file;
        const ext = path.extname(filename);
        const newFilename = `${Date.now()}${ext}`;
        const uploadsDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const uploadPath = path.join(uploadsDir, newFilename);
        await new Promise((resolve, reject) => {
          const stream = createReadStream();
          const out = fs.createWriteStream(uploadPath);
          stream.pipe(out);
          out.on('finish', () => resolve(undefined));
          out.on('error', reject);
        });
        imageUrl = `/uploads/${newFilename}`;
        // Delete old image file if exists and is in uploads folder
        if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
          const oldImageFullPath = path.join(uploadsDir, path.basename(oldImagePath));
          if (fs.existsSync(oldImageFullPath)) {
            try {
              fs.unlinkSync(oldImageFullPath);
            } catch (err) {
              console.warn('Failed to delete old image:', err);
            }
          }
        }
      }
  const { name, price, description, categories, enabled } = input;
      // Check if all categories exist
      if (categories && categories.length > 0) {
        const foundCategories = await prisma.category.findMany({ where: { id: { in: categories } } });
        if (foundCategories.length !== categories.length) {
          throw new Error('One or more categories not found. Please select valid categories.');
        }
      }
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          image: imageUrl,
          enabled: enabled !== undefined ? enabled : true,
          categories: categories && categories.length > 0 ? { set: categories.map((id: string) => ({ id })) } : undefined,
        },
      });
      return product;
    },
    deleteProduct: async (_: any, { id }: any, { prisma }: any) => {
      await prisma.product.delete({ where: { id } });
      return true;
    },
    uploadProductImage: async (_: any, { file }: any) => {
      const { createReadStream, filename } = await file;
      const ext = path.extname(filename);
      const newFilename = `${Date.now()}${ext}`;
      const uploadsDir = path.join(__dirname, '../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const uploadPath = path.join(uploadsDir, newFilename);
      try {
        await new Promise((resolve, reject) => {
          const stream = createReadStream();
          const out = fs.createWriteStream(uploadPath);
          stream.pipe(out);
          out.on('finish', () => resolve(undefined));
          out.on('error', reject);
        });
        return `/uploads/${newFilename}`;
      } catch (err) {
        throw new Error('File upload failed: ' + err);
      }
    },
  },
  Product: {
    categories: async (parent: any, _: any, { prisma }: any) => {
      // Fetch related categories for this product
      return prisma.product
        .findUnique({ where: { id: parent.id } })
        .categories();
    },
  },
};

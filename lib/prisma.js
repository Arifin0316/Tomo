import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const globalForPrisma = global
globalForPrisma.prisma = globalForPrisma.prisma || prismaClientSingleton()

const prisma = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
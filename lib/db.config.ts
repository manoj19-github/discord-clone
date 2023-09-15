import { PrismaClient } from "@prisma/client";

declare global{
    var prisma:PrismaClient | undefined


}


export const database = globalThis.prisma || new PrismaClient()

// this is for in development mode nextjs hot reload not initialize 
// to many prisma client
if(process.env.NODE_ENV !=="production" ) globalThis.prisma = database


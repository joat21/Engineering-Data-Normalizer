import { prisma } from "../lib/prisma";

export const getCategories = async () =>  await prisma.category.findMany();
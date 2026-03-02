import { prisma } from "../../prisma/prisma";

export const getCategories = async () => await prisma.category.findMany();

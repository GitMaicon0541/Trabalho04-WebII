import prisma from "../models/prismaClient.js";

export const shareTodoListWithUser = async ({ categoryId, email }) => {
  // Localiza o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Usuário com o e-mail fornecido não foi encontrado.");
  }

  // Cria o compartilhamento da Todo List
  return prisma.sharedCategory.create({
    data: {
      categoryId,
      userId: user.id,
    },
  });
};

export const getSharedCategoy = async (userId) => {
  console.log("userId", userId);
  const category =  prisma.sharedCategory.findMany({
    where: { userId: parseInt(userId) },
    include: {
      categories: true,
    },
  });

  return prisma.category.findMany({
    where: { categoryId: category.id },
    include: { todoLists: true },
  })
};

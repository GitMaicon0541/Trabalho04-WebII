import { date } from "yup";
import prisma from "../models/prismaClient.js";

export const createTodoItem = async ({ title, description, dateForConclusion, userId }) => {
    return await prisma.todoList.create({
        data: {
            title,
            description,
            createdAt: new Date(),
            dateForConclusion: new Date(dateForConclusion),
            userId,
        },
    });
};

export const getTodos = async (userId) => {
    const todos = await prisma.todoList.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  
    // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
    const todosWithCategory = await Promise.all(
      todos.map(async (todo) => {
        if (todo.categoryId) {  // Verifica se existe uma categoria associada
          const category = await prisma.category.findUnique({
            select: { title: true },
            where: { id: todo.categoryId },
          });
          return { ...todo, category };  // Adiciona a categoria ao todo
        }
        return todo;  // Caso contrário, retorna o todo sem categoria
      })
    );
  
    return todosWithCategory;
};

export const getPendingTodos = async (userId) => {
  const todos = await prisma.todoList.findMany({
    where:{
            userId: userId,
            concludeAt: null, // Filtra as tarefas não concluídas
            dateForConclusion: {
                gt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
            }
        },
    orderBy: { createdAt: "desc" },
  });

  // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
  const todosWithCategory = await Promise.all(
    todos.map(async (todo) => {
      if (todo.categoryId) {  // Verifica se existe uma categoria associada
        const category = await prisma.category.findUnique({
          select: { title: true },
          where: { id: todo.categoryId },
        });
        return { ...todo, category };  // Adiciona a categoria ao todo
      }
      return todo;  // Caso contrário, retorna o todo sem categoria
    })
  );

  return todosWithCategory;
};

export const getOverdueTodos = async (userId) => {
  const todos = await prisma.todoList.findMany({
    where:{
            userId: userId,
            concludeAt: null, // Filtra as tarefas não concluídas
            dateForConclusion: {
                lt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
            }
        },
    orderBy: { createdAt: "asc" },
  });

  // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
  const todosWithCategory = await Promise.all(
    todos.map(async (todo) => {
      if (todo.categoryId) {  // Verifica se existe uma categoria associada
        const category = await prisma.category.findUnique({
          select: { title: true },
          where: { id: todo.categoryId },
        });
        return { ...todo, category };  // Adiciona a categoria ao todo
      }
      return todo;  // Caso contrário, retorna o todo sem categoria
    })
  );

  return todosWithCategory;
};

export const addCategory = async (id, categoryId) => {
    return await prisma.todoList.update({
        where: { id: parseInt(id) },
        data:  { categoryId: parseInt(categoryId) },
    });
}

export const completeTodo = async (id) => {
  return await prisma.todoList.update({
    where: { id: parseInt(id) },
    data: { concludeAt: new Date() },
  });
};

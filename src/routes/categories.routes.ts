import { Router } from "express";

import { Category } from "../model/Category";

const cetegoriesRoutes = Router();

const categories: Category[] = [];

cetegoriesRoutes.post("/", (request, response) => {
  const { name, description } = request.body;

  const category = new Category();

  Object.assign(category, {
    name,
    description,
    created_at: new Date(),
  });

  categories.push(category);

  return response.status(201).json({ category });
});

export { cetegoriesRoutes };

import { Router } from "express";

import { CategoriesRepository } from "../repositories/CategoriesRepository";

const cetegoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

cetegoriesRoutes.post("/", (request, response) => {
  const { name, description } = request.body;

  categoriesRepository.create({ name, description });

  return response.status(201).send();
});

export { cetegoriesRoutes };

import { Router } from "express";
import multer from "multer";

import { createCategoryController } from "../modules/cars/useCases/createCategory";
import { imporCategoryController } from "../modules/cars/useCases/importCategory";
import { listCategoriesController } from "../modules/cars/useCases/listCategory";

const categoriesRoutes = Router();

const upload = multer({
  dest: "./tmp",
});

// create categories;
categoriesRoutes.post("/", (request, response) => {
  return createCategoryController.handle(request, response);
});

// show all categories;
categoriesRoutes.get("/", (request, response) => {
  return listCategoriesController.handle(request, response);
});

categoriesRoutes.post("/import", upload.single("file"), (request, response) => {
  return imporCategoryController.handle(request, response);
});

export { categoriesRoutes };

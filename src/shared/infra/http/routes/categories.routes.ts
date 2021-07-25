import { Router } from "express";
import multer from "multer";

import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoryController } from "@modules/cars/useCases/importCategory/ImportCategoryController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategory/ListCategoriesController";

const categoriesRoutes = Router();

const upload = multer({
  dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
const imporCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

// create categories;
categoriesRoutes.post("/", createCategoryController.handle);

// show all categories;
categoriesRoutes.get("/", listCategoriesController.handle);

categoriesRoutes.post(
  "/import",
  upload.single("file"),
  imporCategoryController.handle
);

export { categoriesRoutes };
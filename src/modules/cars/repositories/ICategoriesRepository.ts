// this is a contract to application LSP concept;
import { Category } from "../entities/Category";

// DTO = create object that is responsible tranfer data between class;
// is usually all time to get data in rote and tranfer to repository;

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
}

export { ICategoriesRepository, ICreateCategoryDTO };

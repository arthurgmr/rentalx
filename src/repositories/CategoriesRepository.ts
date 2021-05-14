import { Category } from "../model/Category";

// DTO = create object that is responsible tranfer data between class;
// is usually all time to get data in rote and tranfer to repository;

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

class CategoriesRepository {
  // categories is attribute this class;
  // whith this, is necessary just defination the access;
  // this case, only the repository that have access;
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  // to defination type of return, just includ ":void(for exemplo)";
  // void is not return function;
  create({ name, description }: ICreateCategoryDTO): void {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
      created_at: new Date(),
    });

    this.categories.push(category);
  }
}

export { CategoriesRepository };

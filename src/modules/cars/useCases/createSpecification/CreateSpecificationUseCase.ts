import { inject, injectable } from "tsyringe";

import { ISpecificationsRespository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRespository
  ) {}

  execute({ name, description }: IRequest): void {
    const categoryAlreadyExists =
      this.specificationsRepository.findByName(name);
    if (categoryAlreadyExists) {
      throw new Error("Specification already exists!");
    }

    this.specificationsRepository.create({
      name,
      description,
    });
  }
}

export { CreateSpecificationUseCase };

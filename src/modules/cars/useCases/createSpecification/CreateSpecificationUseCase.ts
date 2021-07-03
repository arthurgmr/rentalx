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

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlreadyExists =
      await this.specificationsRepository.findByName(name);
    if (categoryAlreadyExists) {
      throw new Error("Specification already exists!");
    }

    await this.specificationsRepository.create({
      name,
      description,
    });
  }
}

export { CreateSpecificationUseCase };

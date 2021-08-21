import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    // Should not be possible register a new rental if already exists a open to the same car;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (carUnavailable) {
      throw new AppError("Car is unvailable");
    }
    // Should not be possible register a new rental if already exists a open to the same user;
    const rentalOpenToUse = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (rentalOpenToUse) {
      throw new AppError("There's is a rental in progress for user!");
    }
    // The rental should be minimum duration to the twenty four hour;

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };

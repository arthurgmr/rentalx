import { inject, injectable } from "tsyringe";

import { ICarsRespository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRespository
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    // Should not be possible register a new rental if already exists a open to the same car;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    console.log(carUnavailable);

    if (carUnavailable) {
      throw new AppError("Car is unavailable");
    }

    // Should not be possible register a new rental if already exists a open to the same user;
    const rentalOpenToUse = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    console.log(rentalOpenToUse);

    if (rentalOpenToUse) {
      throw new AppError("There's is a rental in progress for user!");
    }

    // The rental should be minimum duration to the 24 hour;
    const minimumHour = 24;

    const compare = this.dateProvider.compareInHours(expected_return_date);

    if (compare < minimumHour) {
      throw new AppError("Invalid return time!");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    // When register a rental, the status car should be change to unavailable;
    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };

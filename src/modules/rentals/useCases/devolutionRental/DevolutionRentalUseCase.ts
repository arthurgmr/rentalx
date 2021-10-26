import { inject, injectable } from "tsyringe";

import { ICarsRespository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRespository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    const minimum_daily = 1;

    if (!rental) {
      throw new AppError("Rental does not exists!");
    }

    // check rental time;

    const dateNow = this.dateProvider.dateNow();

    // check daily amount;
    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);
    // If the car was returned within less than 24 hours,
    // it must be billed in full daily;
    if (daily <= 0) {
      daily = minimum_daily;
    }

    // check delay return date;
    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    // calculate total rental;
    let total = 0;

    // check fine amount;
    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    total += daily * car.daily_rate;

    // update attributes;
    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);

    await this.carsRepository.updateAvailable(rental.car_id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };

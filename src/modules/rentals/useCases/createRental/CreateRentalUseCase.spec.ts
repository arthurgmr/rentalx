import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("Should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      category_id: "12345",
      brand: "brand",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("Should not be possible register a new rental if already exists a open to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "user-same-test",
      car_id: "car_id1",
      expected_return_date: dayAdd24Hours,
    });

    expect(
      createRentalUseCase.execute({
        user_id: "user-same-test",
        car_id: "car_id2",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(
      new AppError("There's is a rental in progress for user!")
    );
  });

  it("Should not be possible register a new rental if already exists a open to the same car", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "user_id1",
      car_id: "car-same-test",
      expected_return_date: dayAdd24Hours,
    });

    expect(
      createRentalUseCase.execute({
        user_id: "user_id1",
        car_id: "car-same-test",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("Should not be possible register a new rental with invalid return time", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "user_id1",
        car_id: "car-same-test",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toEqual(new AppError("Invalid return time!"));
  });
});

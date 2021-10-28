import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carRespositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carRespositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carRespositoryInMemory);
  });

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 800,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    expect(car).toHaveProperty("id");
  });

  it("Should not be able to create a new car with same license plate already existis!", async () => {
    await createCarUseCase.execute({
      name: "Name Car1",
      description: "Description Car",
      daily_rate: 800,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    expect(
      createCarUseCase.execute({
        name: "Name Car2",
        description: "Description Car",
        daily_rate: 800,
        license_plate: "ABCD-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "Category",
      })
    ).rejects.toEqual(new AppError("Car already exists!"));
  });

  it("Should be able to create a car with available true by default!", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Available",
      description: "Description Car",
      daily_rate: 800,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    expect(car.available).toBe(true);
  });
});

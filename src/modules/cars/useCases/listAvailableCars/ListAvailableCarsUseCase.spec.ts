import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";

import { ListCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it("Should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 300.0,
      license_plate: "ABC-1234",
      fine_amount: 100.0,
      brand: "Car Brand",
      category_id: "dccd220f-21ee-4888-9013-b292b2efc034",
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by brand name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Car Description",
      daily_rate: 300.0,
      license_plate: "DEF-1234",
      fine_amount: 100.0,
      brand: "Car Brand Test",
      category_id: "dccd220f-21ee-4888-9013-b292b2efc034",
    });

    const cars = await listCarsUseCase.execute({
      brand: "Car Brand Test",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car3 Test",
      description: "Car Description",
      daily_rate: 300.0,
      license_plate: "GHI-1234",
      fine_amount: 100.0,
      brand: "Car Brand",
      category_id: "dccd220f-21ee-4888-9013-b292b2efc034",
    });

    const cars = await listCarsUseCase.execute({
      name: "Car3 Test",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car4 Test",
      description: "Car Description",
      daily_rate: 300.0,
      license_plate: "GHI-1234",
      fine_amount: 100.0,
      brand: "Car Brand",
      category_id: "Category_id Test",
    });

    const cars = await listCarsUseCase.execute({
      category_id: "Category_id Test",
    });

    expect(cars).toEqual([car]);
  });
});

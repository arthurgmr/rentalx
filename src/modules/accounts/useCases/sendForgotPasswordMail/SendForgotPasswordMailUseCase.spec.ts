import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("Should be able to send a forgot password mail to user", async () => {
    const sendMail = spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "394213",
      email: "johguibu@vozuhzov.pm",
      name: "Donald Ramirez",
      password: "123",
    });

    await sendForgotPasswordMailUseCase.execute("johguibu@vozuhzov.pm");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not be able to send an email if user does not exists!", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("jo@he.ac")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("Should be able to create an users token", async () => {
    const generateTokenMail = spyOn(usersRepositoryInMemory, "create");

    usersRepositoryInMemory.create({
      driver_license: "394213",
      email: "johguibu@vozuhzov.pm",
      name: "Donald Ramirez",
      password: "123",
    });

    await sendForgotPasswordMailUseCase.execute("johguibu@vozuhzov.pm");

    expect(generateTokenMail).toBeCalled();
  });
});

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersToken: UserTokens[] = [];

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const usersToken = new UserTokens();

    Object.assign(usersToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.usersToken.push(usersToken);

    return usersToken;
  }
  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = this.usersToken.find(
      (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
    );
    return userToken;
  }
  async deleteById(UserTokenId: string): Promise<void> {
    const userToken = this.usersToken.find((ut) => ut.id === UserTokenId);
    this.usersToken.splice(this.usersToken.indexOf(userToken));
  }
  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.usersToken.find(
      (ut) => ut.refresh_token === refresh_token
    );
    return userToken;
  }
}

export { UsersTokensRepositoryInMemory };

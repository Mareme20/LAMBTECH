import { User } from "../../entity/user.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findByTelephone(
    telephone: string
  ): Promise<User | null>;
}
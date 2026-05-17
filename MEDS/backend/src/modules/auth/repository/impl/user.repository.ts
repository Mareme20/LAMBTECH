import { Repository } from "typeorm";

import { AppDataSource } from "../../../../database/data-source";

import { User } from "../../entity/user.entity";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(User);
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findByEmail(
    email: string
  ): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findByTelephone(
    telephone: string
  ): Promise<User | null> {
    return await this.repository.findOne({
      where: { telephone },
    });
  }
}
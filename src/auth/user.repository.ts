import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const user = this.create({
      username,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.save(user);

    return user;
  }
}

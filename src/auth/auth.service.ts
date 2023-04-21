import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    // remove a senha antes de retornar o usuário criado
    const { password: _, ...user } = createdUser;
    return user;
  }

  async login(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // remove a senha antes de retornar o usuário autenticado
    const { password: _, ...authenticatedUser } = user;
    return authenticatedUser;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);

    const user = await this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
    });

    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not foudn.');
    }

    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not foudn.');
    }

    return this.userRepository.remove(user);
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('Email already in use.');
    }
  }
}

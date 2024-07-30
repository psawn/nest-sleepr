import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email is already taken');
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: +getUserDto.id },
    });
  }
}

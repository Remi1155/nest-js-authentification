import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(name: string, email: string, password: string) {
    return await this.prisma.user.create({
      data: { name, email, password },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: { id },
    });
  }

  async updateUser(id: string, name: string, password: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { name, password },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}

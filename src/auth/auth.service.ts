import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthBody } from './auth.controller';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/userPayload';
import { CreateUserDto } from 'src/dto/createUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authBody: AuthBody) {
    const { email, password } = authBody;

    // const hashedPassword = await this.hashPassword(password);
    // console.log({ password, hashedPassword });

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Le mot de passe est incorrecte');
    }

    return this.authenticateUser(user.id);
  }

  /*******************************/

  async register(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      throw new Error('Cet email est déjà associé à un utilisateur');
    }

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });

    return this.authenticateUser(createdUser.id);
  }

  /*******************************/

  private async hashPassword(password: string) {
    return await hash(password, 10);
  }

  /*******************************/

  private async isPasswordValid(passsword: string, hashedPassword: string) {
    return await compare(passsword, hashedPassword);
  }

  /*******************************/

  private authenticateUser(userId: string) {
    const payload: UserPayload = { userId };
    // UserPayload = { userId: string };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

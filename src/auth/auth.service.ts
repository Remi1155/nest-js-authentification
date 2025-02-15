import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthBody } from './auth.controller';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/userPayload';

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

    return this.authenticateUser({ userId: user.id });
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

  private authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from 'src/types/requestWithUser';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/dto/createUserDto';

export type AuthBody = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  login(@Body() authBody: AuthBody) {
    return this.authService.login(authBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  /*
  RequestWithUser = {
    user: UserPayload;
  };
  UserPayload = { userId: string };
  */
  async authenticate(@Request() request: RequestWithUser) {
    console.log(request.user.userId);
    return await this.userService.findOne(request.user.userId);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}

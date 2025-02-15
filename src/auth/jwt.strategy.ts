import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/types/userPayload';

/**
 *  await fetch('auth', {
 *      body: {
 *                  email: "user@gmail.com",
 *             },
 *      headers: {
 *          'Content-type': 'application/json',
 *          Authorization: 'Bearer azerty',
 *          X_TOKEN: '12345'
 *         }
 * })
 *
 * **/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
    });
  }

  validate({ userId }: { userId: UserPayload }) {
    return { userId };
  }
}

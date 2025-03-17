import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { AuthTokensService } from '../services/auth-tokens.service';
import { AuthToken } from '../entities/auth-token.entity';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'bearer-refresh-token') {
  private logger = new Logger(RefreshTokenStrategy.name);

  constructor(private authTokensService: AuthTokensService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request, refreshToken: string): Promise<AuthToken> {
    this.logger.verbose('validate()');

    const authToken = await this.authTokensService
      .findOneByRefreshToken(refreshToken, false, true)
      .catch((err) => {
        if (err instanceof EntityNotFoundException) {
          this.logger.verbose('validate() [not found/refreshed/revoked]');
          throw new UnauthorizedException();
        }

        throw err;
      });

    const now = new Date();
    const isExpired = now >= authToken.refreshTokenExpiredAt;
    if (isExpired) {
      this.logger.verbose('validate() [expired]');

      await this.authTokensService.softDelete(authToken.id);

      throw new UnauthorizedException();
    }

    return authToken;
  }
}

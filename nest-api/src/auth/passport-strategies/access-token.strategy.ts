import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { AuthTokensService } from '../services/auth-tokens.service';
import { AuthToken } from '../entities/auth-token.entity';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'bearer-access-token') {
  private logger = new Logger(AccessTokenStrategy.name);

  constructor(private authTokensService: AuthTokensService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request, accessToken: string): Promise<AuthToken> {
    this.logger.verbose('validate()');

    const authToken = await this.authTokensService
      .findOneByAccessToken(accessToken, false, true)
      .catch((err) => {
        if (err instanceof EntityNotFoundException) {
          this.logger.verbose('validate() [not found/refreshed/revoked]');

          throw new UnauthorizedException();
        }

        throw err;
      });

    const now = new Date();
    const isExpired = now >= authToken.accessTokenExpiredAt;
    if (isExpired) {
      this.logger.verbose('validate() [expired]');

      throw new UnauthorizedException();
    }

    const userTokenUpdated = await this.authTokensService.updateLastUsedAt(authToken);
    userTokenUpdated.user = authToken.user;
    return userTokenUpdated;
  }
}

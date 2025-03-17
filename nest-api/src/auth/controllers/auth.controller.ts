import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthTokensService } from '../services/auth-tokens.service';
import { RefreshTokenGuard } from '../guards';
import { CurrentAuthToken, Public } from '../decorators';
import { AuthSignUpDto } from '../dtos/auth-sign-up.dto';
import { UsersService } from '../services/users.service';
import { AuthSignInDto } from '../dtos/auth-sign-in.dto';
import { EntityDeletedException, EntityNotFoundException } from '../exceptions';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  private FRONT_URL = `https://${process.env.DOMAIN}`;

  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService,
  ) {}

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refreshToken(@CurrentAuthToken() authToken) {
    this.logger.verbose('refreshToken()');

    const freshAuthToken = await this.authTokensService.refresh(authToken);

    return {
      access_token: freshAuthToken.accessToken,
      refresh_token: freshAuthToken.refreshToken,
    };
  }

  @Post('sign-up')
  @Public()
  async signUp(@Req() req: Request, @Body() dto: AuthSignUpDto) {
    this.logger.verbose('signUp()');

    const userAlreadyExist = await this.usersService.existByEmail(dto.email);

    if (userAlreadyExist) {
      throw new BadRequestException();
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const remember = false;
    const authToken = await this.authTokensService.create(user.id, remember);

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }

  @Post('sign-in')
  @Public()
  async signIn(@Req() req: Request, @Body() dto: AuthSignInDto) {
    this.logger.verbose('signIn()');

    const userId = await this.usersService.verifyPassword(dto.email, dto.password).catch((err) => {
      if (err instanceof EntityNotFoundException) {
        throw new UnauthorizedException();
      }
      throw err;
    });

    const remember = false;
    const authToken = await this.authTokensService.create(userId, remember);

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }

  @Get('sign-out')
  @Redirect()
  @Public()
  async signOut(
    @Query('access_token') accessToken?: string,
    @Query('refresh_token') refreshToken?: string,
    @Query('redirect_uri') redirectUri?: string,
  ) {
    this.logger.verbose('signOut()');

    if (accessToken) {
      await this.authTokensService
        .findOneByAccessToken(accessToken)
        .then((authToken) => this.authTokensService.softDelete(authToken.id))
        .catch((err) => {
          if (err instanceof EntityNotFoundException || err instanceof EntityDeletedException) {
            return null;
          }
          throw err;
        });
    }

    if (refreshToken) {
      await this.authTokensService
        .findOneByRefreshToken(refreshToken)
        .then((authToken) => this.authTokensService.softDelete(authToken.id))
        .catch((err) => {
          if (err instanceof EntityNotFoundException || err instanceof EntityDeletedException) {
            return null;
          }
          throw err;
        });
    }

    // Use redirectUri only if it's front app
    const redirectUriIsFrontUrl = redirectUri && redirectUri.indexOf(this.FRONT_URL) === 0;

    if (redirectUriIsFrontUrl) {
      this.logger.verbose(`REDIRECT: ${redirectUri}`);
      return { url: redirectUri };
    }

    this.logger.verbose(`REDIRECT: ${this.FRONT_URL}`);
    return { url: this.FRONT_URL };
  }
}

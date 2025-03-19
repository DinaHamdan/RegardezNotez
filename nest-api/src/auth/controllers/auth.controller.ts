import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthTokensService } from '../services/auth-tokens.service';
import { RefreshTokenGuard } from '../guards';
import { CurrentAuthToken, CurrentUser, Public } from '../decorators';
import { AuthSignUpDto } from '../dtos/auth-sign-up.dto';
import { UsersService } from '../services/users.service';
import { AuthSignInDto } from '../dtos/auth-sign-in.dto';
import { EntityDeletedException, EntityNotFoundException } from '../exceptions';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  getCurrentUser(@CurrentUser() user) {
    this.logger.verbose('getCurrentUser()');

    return user;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refreshToken(@CurrentAuthToken() authToken, @Res({ passthrough: true }) response) {
    this.logger.verbose('refreshToken()');

    const freshAuthToken = await this.authTokensService.refresh(authToken);

    response.cookie('access_token', authToken.accessToken || '');
    response.cookie('refresh_token', authToken.refreshToken || '');

    return {
      access_token: freshAuthToken.accessToken,
      refresh_token: freshAuthToken.refreshToken,
    };
  }

  @Post('sign-up')
  @Public()
  async signUp(@Res({ passthrough: true }) response, @Body() dto: AuthSignUpDto) {
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

    response.cookie('access_token', authToken.accessToken || '');
    response.cookie('refresh_token', authToken.refreshToken || '');

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }

  @Post('sign-in')
  @Public()
  async signIn(@Res({ passthrough: true }) response, @Body() dto: AuthSignInDto) {
    this.logger.verbose('signIn()');

    const userId = await this.usersService.verifyPassword(dto.email, dto.password).catch((err) => {
      if (err instanceof EntityNotFoundException) {
        throw new UnauthorizedException();
      }
      throw err;
    });

    const remember = false;
    const authToken = await this.authTokensService.create(userId, remember);

    response.cookie('access_token', authToken.accessToken || '');
    response.cookie('refresh_token', authToken.refreshToken || '');

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }

  @Get('sign-out')
  @Public()
  async signOut(
    @Res({ passthrough: true }) response,
    @Query('access_token') accessToken?: string,
    @Query('refresh_token') refreshToken?: string,
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

    response.cookie('access_token', '', { expires: new Date(0) });
    response.cookie('refresh_token', '', { expires: new Date(0) });

    return {
      status: 'ok',
    };
  }
}

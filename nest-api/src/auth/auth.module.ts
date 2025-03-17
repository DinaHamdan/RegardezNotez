import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenGuard } from './guards';
import { AccessTokenStrategy, RefreshTokenStrategy } from './passport-strategies';
import { AuthTokensService } from './services/auth-tokens.service';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth-token.entity';
import { User } from './entities/user.entity';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([AuthToken, User])],
  providers: [
    AuthTokensService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // by default every route need a bearer token
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

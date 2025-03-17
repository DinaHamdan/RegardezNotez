import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BaseEntitiesService } from './base-entities.service';
import { AuthToken } from '../entities/auth-token.entity';
import { User } from '../entities/user.entity';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, REFRESH_TOKEN_TTL_REMEMBER } from '../constants';

@Injectable()
export class AuthTokensService extends BaseEntitiesService<AuthToken> {
  constructor(@InjectRepository(AuthToken) repository: Repository<AuthToken>) {
    super(AuthTokensService.name, repository);
  }

  async findOneByAccessToken(
    accessToken: string,
    withDeleted = false,
    withUserRelation = false,
  ): Promise<AuthToken> {
    this.logger.verbose('findOneByAccessToken()');

    const findOptions: FindOneOptions<AuthToken> = {
      where: { accessToken },
      withDeleted,
    };

    if (withUserRelation) {
      findOptions.relations = ['user'];
    }

    const authToken = await this.repository.findOne(findOptions);

    if (!authToken) {
      this.throwNotFoundException();
    }

    return authToken;
  }

  async findOneByRefreshToken(
    refreshToken: string,
    withDeleted = false,
    withUserRelation = false,
  ): Promise<AuthToken> {
    this.logger.verbose('findOneByRefreshToken()');

    const findOptions: FindOneOptions<AuthToken> = {
      where: { refreshToken },
      withDeleted,
    };

    if (withUserRelation) {
      findOptions.relations = ['user'];
    }

    const authToken = await this.repository.findOne(findOptions);

    if (!authToken) {
      this.throwNotFoundException();
    }

    return authToken;
  }

  async findManyByUser(user: User, withDeleted = false): Promise<AuthToken[]> {
    this.logger.verbose('findManyByUser()');

    const findOptions: FindManyOptions<AuthToken> = {
      where: { userId: user.id },
      withDeleted,
    };

    return this.repository.find(findOptions);
  }

  async create(userId: string, remember: boolean): Promise<AuthToken> {
    this.logger.verbose('create()');

    return this._create({
      userId,
      remember,
      accessToken: uuid(),
      accessTokenExpiredAt: this.getAccessTokenExpiredAt(),
      refreshToken: uuid(),
      refreshTokenExpiredAt: this.getRefreshTokenExpiredAt(remember),
    });
  }

  async updateLastUsedAt(authToken: AuthToken): Promise<AuthToken> {
    this.logger.verbose('updateLastUsedAt()');

    return this._update(authToken.id, {
      lastUsedAt: new Date(),
    });
  }

  async refresh(authToken: AuthToken): Promise<AuthToken> {
    this.logger.verbose('refresh()');

    return this._update(authToken.id, {
      accessToken: uuid(),
      accessTokenExpiredAt: this.getAccessTokenExpiredAt(),
      refreshToken: uuid(),
      refreshTokenExpiredAt: this.getRefreshTokenExpiredAt(authToken.remember),
      lastUsedAt: new Date(),
    });
  }

  async softDelete(id: string): Promise<AuthToken> {
    this.logger.verbose('softDelete()');

    const authToken = await this.findOneById(id, true);

    if (authToken.deletedAt) {
      this.throwDeletedException();
    }

    const now = new Date();
    authToken.deletedAt = now;
    authToken.accessToken = `${now.getTime()}_${authToken.accessToken}`;
    authToken.refreshToken = `${now.getTime()}_${authToken.refreshToken}`;

    return this.repository.save(authToken);
  }

  private getAccessTokenExpiredAt(): Date {
    this.logger.verbose('getAccessTokenExpiredAt()');

    const accessTokenExpiredAt = new Date();

    accessTokenExpiredAt.setTime(accessTokenExpiredAt.getTime() + ACCESS_TOKEN_TTL * 1000);
    return accessTokenExpiredAt;
  }

  private getRefreshTokenExpiredAt(remember: boolean): Date {
    this.logger.verbose('getRefreshTokenExpiredAt()');

    const refreshTokenExpiredAt = new Date();

    if (remember) {
      refreshTokenExpiredAt.setTime(
        refreshTokenExpiredAt.getTime() + REFRESH_TOKEN_TTL_REMEMBER * 1000,
      );
      return refreshTokenExpiredAt;
    }

    refreshTokenExpiredAt.setTime(refreshTokenExpiredAt.getTime() + REFRESH_TOKEN_TTL * 1000);
    return refreshTokenExpiredAt;
  }
}

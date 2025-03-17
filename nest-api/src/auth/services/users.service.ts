import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { FindOneOptions, FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { pick } from 'lodash';
import { BaseEntitiesService } from './base-entities.service';
import { User } from '../entities/user.entity';
import { PASSWORD_SALT } from '../constants';

@Injectable()
export class UsersService extends BaseEntitiesService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(UsersService.name, repository);
  }

  async existByEmail(email: string, withDeleted = false): Promise<boolean> {
    this.logger.verbose('existByEmail()');

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<User> = { where: { email } } as any;

    if (withDeleted) {
      opt.withDeleted = withDeleted;
    }

    return !!(await this.repository.count(opt));
  }

  async verifyPassword(email: string, password: string): Promise<string> {
    this.logger.verbose('verifyPassword()');

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<User> = {
      where: { email },
      select: ['id', 'email', 'password'],
    } as any;

    const entity = await this.repository.findOne(opt);

    if (!entity) {
      return this.throwNotFoundException();
    }

    const hashedPassword = this.hashPassword(password, email);

    if (entity.password !== hashedPassword) {
      return this.throwNotFoundException();
    }

    return entity.id;
  }

  async findOneByEmail(
    email: string,
    withDeleted = false,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    this.logger.verbose('findOneByEmail()');

    const opt: FindOneOptions<User> = { where: { email } } as any;

    if (withDeleted) {
      opt.withDeleted = withDeleted;
    }

    if (relations) {
      opt.relations = relations;
    }

    if (select) {
      opt.select = select;
    }

    const entity = await this.repository.findOne(opt);

    if (!entity) {
      this.throwNotFoundException();
    }

    return entity;
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.verbose('create()');

    const allowedProperties = [
      'password',
      'firstName',
      'lastName',
      'preferredUsername',
      'email',
      'phoneNumber',
    ];
    const allowedData = pick(userData, allowedProperties);

    if (!allowedData.password) {
      throw new Error('Local user creation require a password');
    }
    if (!allowedData.email) {
      throw new Error('Local user creation require an email');
    }

    allowedData.password = this.hashPassword(allowedData.password, allowedData.email);

    const user = this.repository.create(allowedData);
    await this.repository.save(user);

    return user;
  }

  update(user: User, updateData: Partial<User>): Promise<User> {
    this.logger.verbose('update()');

    const allowedProperties = ['firstName', 'lastName', 'phoneNumber'];

    const allowedData = pick(updateData, allowedProperties);

    return this._update(user.id, allowedData);
  }

  private hashPassword(password: string, email: string) {
    this.logger.verbose('hashPassword()');

    return createHash('sha256').update(`${password}-${email}-${PASSWORD_SALT}`).digest('hex');
  }
}

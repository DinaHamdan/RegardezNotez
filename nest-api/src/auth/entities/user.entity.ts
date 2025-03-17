import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { AuthToken } from './auth-token.entity';
import { CommonBaseEntity } from './common-base.entity';

@Entity('users')
export class User extends CommonBaseEntity {
  // Properties
  // ----------

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  preferredUsername?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  // Relations
  // ----------

  @OneToMany(() => AuthToken, (authToken) => authToken.user)
  authTokens?: AuthToken[];
}

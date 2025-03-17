import { Exclude } from 'class-transformer';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { CommonBaseEntity } from './common-base.entity';

@Entity('auth_tokens')
export class AuthToken extends CommonBaseEntity {
  // Properties
  // ----------

  @Exclude()
  @Column()
  @Index({ unique: true })
  accessToken: string;

  @Column({ type: 'timestamp' })
  accessTokenExpiredAt: Date;

  @Exclude()
  @Column()
  @Index({ unique: true })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  refreshTokenExpiredAt: Date;

  @Column()
  remember: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  lastUsedAt: Date;

  // Relations
  // ----------

  @ManyToOne(() => User, (user) => user.authTokens)
  user: User;

  @Column()
  userId: string;
}

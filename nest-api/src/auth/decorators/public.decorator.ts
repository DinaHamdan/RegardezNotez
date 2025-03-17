import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_KEY } from '../constants';

export const Public = () => SetMetadata(SKIP_AUTH_KEY, true);

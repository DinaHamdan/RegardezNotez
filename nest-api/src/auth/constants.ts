export const SKIP_AUTH_KEY = 'skipAuth';

export const ACCESS_TOKEN_TTL = process.env['AUTH_ACCESS_TOKEN_TTL']
  ? +process.env['AUTH_ACCESS_TOKEN_TTL']
  : 3600 * 24;

export const REFRESH_TOKEN_TTL = process.env['AUTH_REFRESH_TOKEN_TTL']
  ? +process.env['AUTH_REFRESH_TOKEN_TTL']
  : 3600 * 24 * 2;

export const REFRESH_TOKEN_TTL_REMEMBER = process.env['AUTH_REFRESH_TOKEN_TTL_REMEMBER']
  ? +process.env['AUTH_REFRESH_TOKEN_TTL_REMEMBER']
  : 3600 * 24 * 30;

export const PASSWORD_SALT = process.env['AUTH_PASSWORD_SALT'] || 'super-secret-salt';

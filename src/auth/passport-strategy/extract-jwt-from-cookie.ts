import { Request } from 'express';

export const extractJwtFromCookie = (request: Request) => {
  const { auth } = request?.signedCookies;
  if (!auth) {
    return null;
  }
  return auth;
};

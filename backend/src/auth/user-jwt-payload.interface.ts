/*
  JSON object, that is needed in order to create a JWT
*/

export interface UserJwtPayload {
    username: string;
    typeid: number;
  }
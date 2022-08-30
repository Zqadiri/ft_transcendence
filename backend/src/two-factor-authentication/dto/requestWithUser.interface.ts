import { Request } from 'express';
import { User } from '../../users/entities/user.entity'

/*
    Interfaces is an abstract type that includes a certain set of fields 
    that a type must include to implement the interface
*/

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;

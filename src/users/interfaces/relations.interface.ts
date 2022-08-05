import { User } from "../entities/user.entity";

export interface CreateRelation{
    FirstUser: User; //! the requester
    SecondUser: User; //! to be friend with
    isFriend: boolean; //! is already a friend
    blocked: boolean; //! is already blocked
}

export interface DeleteRelation{
    FirstUser: User;
    SecondUser: User;
    
}

export interface UpdateRelation{

}


import { User } from "../entities/user.entity";
export interface CreateRelation {
    FirstUser: User;
    SecondUser: User;
    isFriend: boolean;
    blocked: boolean;
}
export interface DeleteRelation {
    FirstUser: User;
    SecondUser: User;
}
export interface UpdateRelation {
    FirstUser: User;
    SecondUser: User;
    blocked: boolean;
}

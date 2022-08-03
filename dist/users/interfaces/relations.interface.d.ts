import { User } from "../user.entity";
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
}

import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
declare class UserRepository extends Repository<User> {
}
export { UserRepository };

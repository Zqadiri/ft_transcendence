import { User } from "../users.entity";
import { Repository } from "typeorm";
declare class UserRepository extends Repository<User> {
}
export { UserRepository };

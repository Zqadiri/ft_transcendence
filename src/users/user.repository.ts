
import { User } from "./entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
class UserRepository extends Repository<User> {

}

export { UserRepository };
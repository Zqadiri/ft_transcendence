
import { User } from "./user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class PlayerRepository extends Repository<User> {

	// async UserExisted(): Promise<Player[]> {
	// 	return null;
	// }
}
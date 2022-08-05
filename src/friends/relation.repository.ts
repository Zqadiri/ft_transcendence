import { EntityRepository, Repository } from "typeorm";
import { Friend } from "src/friends/entities/friend.entity";

@EntityRepository(Friend)
class relationRepository extends Repository<Friend> {

}
export { relationRepository };

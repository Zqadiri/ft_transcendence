import { EntityRepository, Repository } from "typeorm";
import { Friend } from "src/friends/friend.entity";

@EntityRepository(Friend)
export class relationRepository extends Repository<Friend> {

}
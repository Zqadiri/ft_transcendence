import { EntityRepository, Repository } from "typeorm";
import { Friend } from "src/friends/friend.intity";

@EntityRepository(Friend)
export class relationRepository extends Repository<Friend> {

}
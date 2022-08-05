import { Repository } from "typeorm";
import { Friend } from "src/friends/entities/friend.entity";
declare class relationRepository extends Repository<Friend> {
}
export { relationRepository };

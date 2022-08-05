import { userInfo } from "os";
import { User } from "src/users/user.entity";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";


@Entity('db_friend')
export class Friend extends BaseEntity{
    @Column({primary: true})
    id: number;

    @Column({default: false})
    blocked: boolean;

    @Column()
    stat: string;

    // User have multiple friends
    @ManyToOne(() => User, (user: User) => user.friends)
    user: User;
}
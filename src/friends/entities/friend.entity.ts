import { userInfo } from "os";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('db_friend')
export class Friend extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: false})
    blocked: boolean;

    @Column({nullable: true})
    stat: string;

    // User have multiple friends
    @ManyToOne(() => User, (user: User) => user.friends)
    user: User | null;
}
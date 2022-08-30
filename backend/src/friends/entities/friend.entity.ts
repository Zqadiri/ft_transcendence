import { userInfo } from "os";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('db_friend')
export class Friend{
	@PrimaryGeneratedColumn()
	id: number;

	@Column({default: false})
	blocked: boolean;

	@Column({nullable: true})
	stat: string;

	// User have multiple friends
	// @ManyToOne(() => User, (user: User) => user.friends)
	// user: User;

	@ManyToOne(() => User, (user: User) => user.followings)
	// @Column({ nullable: true })
	following: User;
  
	@ManyToOne(() => User, (user: User) => user.followers)
	// @Column({ nullable: true })
	follower: User;
}
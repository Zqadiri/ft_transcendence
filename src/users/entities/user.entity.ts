import { Entity, Column, OneToMany } from "typeorm";
import { Friend } from "src/friends/entities/friend.entity";

/*
	Marks your model as an entity. Entity is a class which is 
	transformed into a database table.
*/

@Entity('db_user')
export class User{
	@Column({primary: true})
	id: number;

	@Column({unique: true })
	username: string;

	@Column()
	avatar: string;

	@Column()
	email: string;

	@Column({default: false})
	is2FacAuth: boolean;

	@Column({
		enum:['online', 'offline', 'ingame'],
		default: 'online'
	})
	status: string;

	@Column({default: 0})
	gameCounter: number;

	@Column({default: 0})
	wins: number;

	@Column({default: 0})
	losses: number;

	@Column({default: 0})
	level: number;

	@Column({default: 'Beginner'})
	rank: string;

	@Column({default: false})
	Matched : boolean;

	@Column({ 
		type: 'timestamp', 
		default: () => 'CURRENT_TIMESTAMP' 
	})
	createdAt: Date;
  
	@Column({ 
		type: 'timestamp',
		onUpdate: 'CURRENT_TIMESTAMP', 
		nullable: true 
	})
	updatedAt: Date

	@OneToMany(() => Friend, (friend: Friend) => friend.following)
	followings: Friend[];

	@OneToMany(() => Friend, (friend: Friend) => friend.follower)
	followers: Friend[];

	@Column({nullable: true})
	twoFacAuthSecret : string;
}

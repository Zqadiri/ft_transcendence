import { Entity, Column, OneToMany } from "typeorm";

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

	@Column('varchar',{
		array: true,
		nullable: true
	})
	achievement: string[];

	@Column('varchar',{
		array: true,
		nullable: true
	})
	FriendsID: number[];

	@Column('varchar',{
		array: true,
		nullable: true
	})
	blockedID: string[];

	@Column('varchar',{
		array: true,
		nullable: true
	})
	addFriendID: string[];

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

	@Column({nullable: true})
	twoFacAuthSecret : string;
}

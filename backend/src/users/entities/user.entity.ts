import { MaxLength, IsNotEmpty, IsString } from "class-validator";
import { Entity, Column } from "typeorm";

/*
	Marks your model as an entity. Entity is a class which is 
	transformed into a database table.
*/

@Entity('db_user')
export class User{
	@Column({primary: true})
	id: number;

	@Column({unique: true })
	@IsNotEmpty()
    @IsString()
	@MaxLength(10)
	username: string;

	@Column()
	avatar: string;

	@Column()
	email: string;

	@Column({default: false})
	is2FacAuth: boolean;

	@Column({
		enum:['online', 'offline', 'ingame'],
		default: 'offline'
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

	@Column({default: 0})
	xp: number;

	@Column({default: 0})
	rank: number;

	@Column({default: false})
	Matched : boolean;

	@Column('varchar', {
		array: true,
		nullable: true,
		default: []
	})
	achievement: string[];

	@Column('int',{
		array: true,
		default: []
	})
	FriendsID: number[]; 

	@Column('int',{
		array: true,
		default: []
	})
	blockedID: number[];

	@Column('int',{
		array: true,
		default: []
	})
	outgoingFRID: number[];

	@Column('int',{
		array: true,
		default: []
	})
	incomingFRID: number[];

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

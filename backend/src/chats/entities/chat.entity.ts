import { LargeNumberLike } from "crypto";
import { BaseEntity, BeforeInsert, Column, Entity, Generated } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from "@nestjs/common";

/*
	TODO: Data Mapper pattern and  Active Record pattern
	Active Record approach, you define all your query methods inside 
	the model itself, and you save, remove, and load objects using model methods.

	Data Mapper is an approach to access your database within 
	repositories instead of models.
*/

@Entity('db_chat')
export class Chat{

	@Column({primary: true})
	id: number;

	@Column({
		default: 'untitled'
	})
	name: string;

	@Generated('uuid')
	@Column({type: "uuid"})
	uuid: string;

	@Column()
	isPLaying: Boolean;

	@Column({nullable: true})
	password: string;

	@Column('varchar')
	ownerID: string;

	@Column({default: true})
	isActive: boolean

	@Column({
		enum: ['dm', 'chatRoom'],
		nullable: false
	})
	type: string;

	@Column({
		enum:['private', 'public', 'protected'],
		default: 'public'
	})
	status: string;
	
	@Column('varchar',{
		array: true,
		nullable: false
	})
	userID: string[];

	@Column('varchar',{
		array: true,
		nullable: false
	})
	AdminsID: string[];

	@Column('varchar',{
		array: true,
		nullable: false
	})
	mutedID: string[];

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

	/*
		TODO: Entity Listener
		Entities can have methods with custom logic that listen to specific entity events
	*/

	// @BeforeInsert()
	// async hashPassword(){
	// 	try{
	// 		this.password = await bcrypt.hash(this.password, process.env.SALT);
	// 	}
	// 	catch(err){
	// 		throw InternalServerErrorException;
	// 	}
	// }
}
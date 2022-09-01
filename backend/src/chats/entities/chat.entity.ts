import { LargeNumberLike } from "crypto";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: 'untitled'
	})
	name: string;

	@Column({nullable: true})
	password: string;

	@Column('varchar')
	ownerID: string;

	@Column({
		enum: ['dm', 'chatRoom'],
		//nullable: false
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
		nullable: true
	})
	AdminsID: string[];

	@Column('varchar',{
        array: true,
        nullable: true
    })
    InvitedUserID: string[];
	
	@Column({ type: "simple-json", nullable: true })
    MutedAndBannedID: {
		action: string;
        username: string;
		current_time: number;
        duration: number;
    }[];

	@CreateDateColumn()
	created: Date;
  
	@UpdateDateColumn()
	updated: Date;

	/*
		TODO: Entity Listener
		Entities can have methods with custom logic that listen to specific entity events
	*/

	@BeforeInsert() 
	@BeforeUpdate()
	async hashPassword() {
		if (this.password)
        	this.password = await bcrypt.hash(this.password, 10);  
    }

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
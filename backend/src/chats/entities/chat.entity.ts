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

	@Column('int')
	ownerID: number;

	@Column({
		enum: ['dm', 'chatRoom'],
	})
	type: string;

	@Column({
		enum:['private', 'public', 'protected'],
		default: 'public'
	})
	status: string;
	
	@Column('int',{
		array: true,
		default: []
	})
	userID: number[];

	@Column('int',{
		array: true,
		default: []
	})
	AdminsID: number[];

	@Column('int',{
        array: true,
		default: []
    })
    InvitedUserID: number[];
	
	@Column({ type: "simple-json", default: [] })
    MutedAndBannedID: {
		action: string;
        userID: number;
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
	async hashPassword() {
		if (this.password)
        	this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));  
    }
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/user.entity";
import { Message } from "./message.entity";
import { MeasureMemoryMode } from "vm";


@Entity()
export class Chat {

	// @PrimaryGeneratedColumn()
	// id : number;

	// @Column()
	// name: string;

    // @Column() 	
    // password: string;

    // @Column({default: true})
    // isActive: boolean

    // @Column({
    //     enum: ['dm', 'chatRoom'],
    //     nullable: false
    // })
    // type: string;

    // @Column({
    //     enum:['private', 'public', 'protected'],
    //     default: 'public'
    // })
    // status: string;

	// @ManyToMany(() => User, user => user.chats)
	// @JoinTable()
	// usersID: User[];
	
	// @Column('varchar')
    // ownerID: string;

    // @Column("int", {array: true})  
    // AdminsID: number[];


    // @Column("int", {array: true})
    // mutedID: number[];

   
    // @Column("int", {array: true})
    // banedID: number[];
	
	// // @OneToOne(() => Message, (message) => message.ChatID)
	// // messages : Message[];

    // @CreateDateColumn()
    // created_at: Date;

    // @UpdateDateColumn()
    // updated_at: Date;
;}

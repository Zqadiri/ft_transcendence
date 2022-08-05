import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "src/users/user.entity";
import { Message } from "./message.entity";
import { MeasureMemoryMode } from "vm";


@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	id : number;

	@Column()
	name: string;

    @Column() 	
    password: string;

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

    // each chat room can have multiple users
	@ManyToMany(() => User, user => user.chats)
	@JoinTable()
	usersID: User[];
    
    // each chat room is owned by only one single user
	@ManyToOne(() => User, user=> user.rooms)
    owner: User;

    // each chat room can have multiple admins
    @ManyToMany(() => User, user => user.admins)
	@JoinTable()
    AdminsID: User[];

    // each chat room can have multiple muted users
    @ManyToMany(() => User, user => user.muted)
	@JoinTable()
    mutedID: User[];

    // each chat room can have multiple banned users
    @ManyToMany(() => User, user => user.baned)
	@JoinTable()
    banedID: User[];
    
    // chat room can have multiple messages
	@OneToMany(() => Message, (message) => message.chat)
	messages : Message[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
;}

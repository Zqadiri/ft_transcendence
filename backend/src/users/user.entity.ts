import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Game } from "src/games/game.entity";
import { BaseEntity } from "typeorm";
import { Chat } from "src/chats/entities/chat.entity";
import { Message } from "src/chats/entities/message.entity";

/*
    Marks your model as an entity. Entity is a class which is 
    transformed into a database table.
*/

@Entity()
export class User extends BaseEntity {
    @Column({primary: true})
    id: number;

    @Column({unique: true })
    username: string;

    @Column()
    avatar: string;

    @Column()
    email: string;

    @Column({
        enum:['online', 'offline', 'ongame'],
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

    // Relations

    // user can have multiple chat rooms
    @ManyToMany(() => Chat, (chat) => chat.usersID)
    chats: Chat[];

    // user can be admin on multiple chat rooms
    @ManyToMany(() => Chat, (chat) => chat.AdminsID)
    admins: Chat[];

    // user can have multiple chat rooms
    @OneToMany(() => Chat, (chat) => chat.owner)
    rooms: Chat[];

    // user can be muted on multiple chat rooms
    @ManyToMany(() => Chat, (chat) => chat.mutedID)
    muted: Chat[];

    // user can be banned on multiple chat rooms
    @ManyToMany(() => Chat, (chat) => chat.banedID)
    baned: Chat[];

    // user can send multiple messages
    @OneToMany(() => Message, (message) => message.owner)
    messages: Message[];

}

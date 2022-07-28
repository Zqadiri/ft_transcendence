import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Game } from "src/games/game.entity";
import { BaseEntity } from "typeorm";
import { Chat } from "src/chats/entities/chat.entity";

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

    @ManyToMany(() => Chat, (chat) => chat.usersID)
    chats: Chat[];

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
}

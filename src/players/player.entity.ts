import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Game } from "src/games/game.entity";

/*
    Marks your model as an entity. Entity is a class which is 
    transformed into a database table.
*/

@Entity()
export class Player {
    @Column({primary: true})
    id: number;

    @Column({unique: true, })
    username: string;

    @Column()
    avatar: string;

    @Column()
    email: string;

    @Column({enum:['online', 'offline', 'ongame']})
    status: string;

    @Column({default: 0})
    gameCounter: number;

    @Column({default: 0})
    wins: number;

    @Column()
    losses: number;

    @Column({default: 0})
    level: number;

    @Column({default: 'Beginner'})
    rank: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

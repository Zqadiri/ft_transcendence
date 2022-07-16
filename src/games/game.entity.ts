import { Entity, Column } from "typeorm";

@Entity()
export class Game{
    @Column({primary: true})
    id: number;

    @Column()
    winner_score: number;

    @Column()
    loser_score: number; 
}
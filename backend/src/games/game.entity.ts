import { Entity, Column } from "typeorm";

@Entity()
export class Game{
    @Column({primary: true})
    id: number;

    @Column()
    firstPlayerScore: number;

    @Column()
    SecondPlayerScore: number;

    
}
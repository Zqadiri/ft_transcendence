import { Entity, Column } from "typeorm";

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

    @Column({enum:['online', 'offline', 'ongame']})
    status: string;

    @Column()
    wins: number;

    @Column()
    losses: number;

    @Column()
    level: number;
}
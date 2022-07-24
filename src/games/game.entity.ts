import { Entity, Column } from "typeorm";

@Entity()
export class Game{
    @Column({primary: true})
    id: number;

    @Column('varchar')
    firstPlayerID: string;

    @Column('varchar')
    secondPlayerID: string;

    @Column()
    firstPlayerScore: number;

    @Column()
    SecondPlayerScore: number;

    @Column({
        enum: ['default', 'power-up', 'double'],
        default: 'default'
    })
    theme: string;

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
    modifiedAt: Date;

}
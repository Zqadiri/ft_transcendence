import { LargeNumberLike } from "crypto";
import { BaseEntity, Column, Entity } from "typeorm";

/*
    TODO: Data Mapper pattern and  Active Record pattern
    Active Record approach, you define all your query methods inside 
    the model itself, and you save, remove, and load objects using model methods.

    Data Mapper is an approach to access your database within 
    repositories instead of models.


*/

@Entity()
export class Chat{

    @Column({primary: true})
    id: number;

    @Column({
        default: 'untitled'
    })
    name: string;

    @Column()
    isPLaying: Boolean;

    @Column()
    password: string;

    @Column('varchar')
    ownerID: string;

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
    
    @Column()
    userID: string[];

    @Column()
    AdminsID: string[];

    @Column()
    mutedID: string[];

    
}
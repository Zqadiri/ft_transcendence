import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat // this class represente the shape of chat table in our database
{
    @PrimaryGeneratedColumn()
    id: number;

}
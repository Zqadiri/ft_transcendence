import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dm
{
    @PrimaryGeneratedColumn()
    id_dm: number;

    @Column()
    sender : string;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;
}
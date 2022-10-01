import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "typeorm";

/*
	Marks your model as an entity. Entity is a class which is 
	transformed into a database table.
*/

@Entity('db_chatLogs')
export class ChatLogs extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    userID: number;

	@Column()
    username: string;

    // @Column({type: "uuid", nullable: true})
    // chatUUId: string;
    @Column()
    roomName: string;

    @Column()
    message: string;

    @Column({ 
		type: 'timestamp', 
		default: () => 'CURRENT_TIMESTAMP' 
	})
	createdAt: Date;
    
}

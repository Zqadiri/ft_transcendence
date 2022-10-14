import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_game')
export class Game{
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
        nullable: true 
    })
    socketRoom: string;

	@Column({default: false})
	isPlaying:boolean;

	@Column('int')
	firstPlayerID: number;

	@Column('int')
	secondPlayerID: number;

	@Column({default: 0})
	firstPlayerScore: number;

	@Column({default: 0})
	secondPlayerScore: number;

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

	@Column({ 
		type: 'timestamp',
		onUpdate: 'CURRENT_TIMESTAMP', 
		nullable: true 
	})
	finishedAt: Date;
}

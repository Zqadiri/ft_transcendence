import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_game')
export class Game{
	@Column({primary: true})
	id: number;

	@Column({default: false})
	isPlaying:boolean;

	@Column('varchar')
	firstPlayerID: string;

	@Column('varchar')
	secondPlayerID: string;

	@Column({default: 0})
	firstPlayerScore: number;

	@Column({default: 0})
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

	@Column({ 
		type: 'timestamp',
		onUpdate: 'CURRENT_TIMESTAMP', 
		nullable: true 
	})
	finishedAt: Date;
}


export class CreateGameDto{
    public firstPlayerID : number;
    public secondPlayerID : number;
    public theme: string;
    public createdAt: Date;
	public socketRoom: string;
}

export class UpdateScoreDto{
    public gameId: number;
    public PlayerScore : number;
    public player: boolean;
}

export class EndGameDto{
    public gameId: number;
    public firstPlayerScore : number;
    public secondPlayerScore : number;
    public finishedAt : Date;
}
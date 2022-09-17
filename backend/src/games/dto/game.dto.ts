
export class CreateGameDto{
    public isPlaying: boolean;
    // public isFinished: boolean;
    public firstPlayerID : string;
    public secondPlayerID : string;
    public theme: string;
    public modifiedAt : Date;
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
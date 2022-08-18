
export class CreateGameDto{
    public isPlaying: boolean;
    // public isFinished: boolean;
    public firstPlayerID : string;
    public secondPlayerID : string;
    public theme: string;
    public modifiedAt : Date;
}

export class UpdateGameDto{
    // public isFinished: boolean;
    public isPlaying: boolean;
    public firstPlayerScore : number;
    public SecondPlayerScore : number;
    public finishedAt : Date;
}
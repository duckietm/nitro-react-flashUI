class Data {
    playerId: number;

    constructor(playerId: number){
        this.playerId = playerId;
    }
}

export class VoteComposer {
    header: string;
    data: Data;

    constructor(playerId: number){
        this.header = 'votePlayer';
        this.data = new Data(playerId)
    }
}

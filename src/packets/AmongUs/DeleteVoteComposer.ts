class Data {
    playerId: number;

    constructor(playerId: number){
        this.playerId = playerId;
    }
}

export class DeleteVoteComposer {
    header: string;
    data: Data;

    constructor(playerId: number){
        this.header = 'deleteVotePlayer';
        this.data = new Data(playerId)
    }
}

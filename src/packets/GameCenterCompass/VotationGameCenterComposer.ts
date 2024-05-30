class Game {
    participantId: number;
    votationNumber: number;

    constructor(participantId: number, votationNumber: number) {
        this.participantId = participantId;
        this.votationNumber = votationNumber;
    }
}

export class VotationGameCenterComposer {
    header: string;
    data: Game;

    constructor(participantId: number, votationNumber: number){
        this.header = 'votationGameCenter';
        this.data = new Game(participantId, votationNumber);
    }
}

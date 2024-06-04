class Game {
    type: string;

    constructor(gameName: string) {
        this.type = gameName;
    }
}

export class JoinGameCenterComposer {
    header: string;
    data: Game;

    constructor(gameName: string){
        this.header = 'joinGameCenter';
        this.data = new Game(gameName)
    }
}

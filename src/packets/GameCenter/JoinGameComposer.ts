class Game {
    game: string;

    constructor(gameName: string) {
        this.game = gameName;
    }
}

export class JoinGameComposer {
    header: string;
    data: Game;

    constructor(gameName: string){
        this.header = 'joinGame';
        this.data = new Game(gameName)
    }
}

class Game {
    game: string;

    constructor(gameName: string) {
        this.game = gameName;
    }
}

export class ExitQueueComposer {
    header: string;
    data: Game;

    constructor(gameName: string){
        this.header = 'exitGameQueue';
        this.data = new Game(gameName)
    }
}

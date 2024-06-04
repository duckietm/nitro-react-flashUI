class Ticket {
    ticket: string;

    constructor(ticket: string) {
        this.ticket = ticket;
    }
}

export class SSOComposer {
    header: string;
    data: Ticket;

    constructor(ticket: string){
        this.header = 'sso';
        this.data = new Ticket(ticket)
    }
}

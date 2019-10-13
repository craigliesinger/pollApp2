export class Survey {
    uid: string;
    title: string;
    url: string;
    activeParticipants: number = 0;
    averageRating: number = 0.5;
    maxUsers: number = 10;
    live: boolean = true;
    owner: string;
}

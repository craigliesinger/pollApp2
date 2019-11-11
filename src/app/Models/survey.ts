export class Survey {
    uid: string;
    title: string;
    url: string;
    activeParticipants: String[];
    averageRating: number = 0.5;
    combinedRating: number;
    maxUsers: number = 10;
    live: boolean = true;
    owner: string;
    liveQuestionUid?: string;
    lastUserAddTimestamp?: any
    shortCode?: string
}



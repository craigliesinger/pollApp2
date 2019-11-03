import { FieldValue } from '@google-cloud/firestore';

export class Survey {
    uid: string;
    title: string;
    url: string;
    activeParticipants: String[] | FieldValue;
    averageRating: number = 0.5;
    combinedRating: number | FieldValue;
    maxUsers: number = 10;
    live: boolean = true;
    owner: string;
    liveQuestionUid?: string;
}

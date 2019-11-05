import { firestore } from 'firebase-admin';

export class Survey {
    uid: string;
    title: string;
    url: string;
    activeParticipants: String[] | firestore.FieldValue;
    averageRating: number = 0.5;
    combinedRating: number | firestore.FieldValue;
    maxUsers: number = 10;
    live: boolean = true;
    owner: string;
    liveQuestionUid?: string;
}

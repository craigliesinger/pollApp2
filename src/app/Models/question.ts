import { firestore } from 'firebase-admin';

export class Question {
    uid: string;
    question: string;
    numberOfResponces: number = 0;
    status: string = "prep";
    type: string;
    answers: Answer[] = [];
    multiSelect: boolean = false;
    options: string[] = [];
    sentiment?: Sentiment;
}

export class OpenText extends Question {
    type: string = "openText";
}

export class Choice extends Question {
    type: string = "multiChoice";
    
}

export class Answer {
    responder: string;
    responce: string[];
    sentiment?: Sentiment;
}

export class Sentiment {
    score: number;
    negative: string[];
    positive: string[];
    comparative: number;
    calculation: any[];
    tokens: string[];
    words: string[];
}
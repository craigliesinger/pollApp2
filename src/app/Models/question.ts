import { FieldValue } from '@google-cloud/firestore';

export class Question {
    uid: string;
    question: string;
    numberOfResponces: number = 0;
    status: string = "prep";
    type: string;
    answers: FieldValue | Answer[] = [];
    multiSelect: boolean = false;
    options: string[] = [];
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
}
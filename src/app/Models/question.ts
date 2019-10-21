export class Question {
    uid: string;
    question: string;
    numberOfResponces: number = 0;
    status: string = "prep";
}

export class OpenText extends Question {
    type: string = "openText";
    answers: Answer[] = [];
}

export class Choice extends Question {
    type: string = "multiChoice";
    multiSelect: boolean = false;
    options: string[] = [];
    answers: Answer[] = [];
}

export class Answer {
    responder: string;
    responce: string[];
}
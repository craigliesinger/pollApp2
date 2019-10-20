export class Question {
    uid: string;
    question: string;
    numberOfResponces: number = 0;
}

export class OpenText extends Question {
    answers: Answer[];
}

export class Choice extends Question {
    multiSelect: boolean;
    options: string[];
    answers: Answer[];
}

export class Answer {
    responder: string;
    responce: string[];
}
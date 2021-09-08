import { Answer } from "./Answer";
import { Author } from "./Author";

export interface Question {
    id: number;
    title: string;
    detail: string;
    author: Author;
    answers : Answer[];
    views : number;
    creationDate: Date;
    idcorrectAnswer: number;
}

export interface QuestionDTO {
    detail: string;
    title: string;
}
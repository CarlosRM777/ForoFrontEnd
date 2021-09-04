import { Author } from "./Author";

export interface Answer {
    id : number;
    detail: string;
    date: Date;
    answered: boolean;
    author : Author;
    authors_liked : Author[];
    authors_disliked : Author[];
}

export interface AnswerDTO {
    detail: string;
    idAuthor: number;
}
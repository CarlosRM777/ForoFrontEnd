export interface Author {
    id: number;
    name: string;
    username: string;
    password: string;
    url: string;
}

export interface AuthorDTO {
    username: string;
    password: string;
}
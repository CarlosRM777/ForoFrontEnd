import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionDTO } from './Question';
import { Answer, AnswerDTO } from './Answer';
import { environment } from 'src/environments/environment';
import { Author } from './Author';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAuthor(username : string, pwd : string) : Observable<Author>  {
    return this.http.get<Author>(`${this.apiServerUrl}/author?username=${username}&password=${pwd}`);
  }

  public createAuthor(author : Author) : Observable<Author>  {
    return this.http.post<Author>(`${this.apiServerUrl}/author`, author);
  }

  public getQuestions() : Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiServerUrl}/questions`);
  }

  public getQuestion(idQuestion : number) : Observable<Question> {
    return this.http.get<Question>(`${this.apiServerUrl}/${idQuestion}/question`);
  }

  public createQuestion(idAuthor : number, question : QuestionDTO) : Observable<Question> {
    return this.http.post<Question>(`${this.apiServerUrl}/${idAuthor}/question`, question);
  }

  public getAnswers(idQuestion : number) : Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}${idQuestion}/answers/`);
  }

  public createAnswer(idQuestion : number, answerdto : AnswerDTO) : Observable<Answer> {
    return this.http.post<Answer>(`${this.apiServerUrl}/${idQuestion}/answer`, answerdto);
  }

  public updateAnswer(idAnswer : number, idAuthor : number, Like : boolean) : Observable<Answer> {
    var like_dislike = "";
    if (Like)
      like_dislike="AddLike";
    else
      like_dislike="AddDislike";
    return this.http.put<Answer>(`${this.apiServerUrl}/${idAnswer}/answer?${like_dislike}=${idAuthor}`, {});
  }

  public updateQuestionViews(idQuestion : number) : Observable<Question> {
    return this.http.put<Question>(`${this.apiServerUrl}/${idQuestion}/question?AddView=1`, {});
  }

  public updateQuestionAnsweredID(idQuestion : number, idAnswer : number) : Observable<Question> {
    return this.http.put<Question>(`${this.apiServerUrl}/${idQuestion}/question?SetAnswer=${idAnswer}`, {});
  }
}

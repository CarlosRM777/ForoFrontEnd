import { getLocaleDateFormat } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Answer, AnswerDTO } from './Answer';
import { Author } from './Author';
import { ForoService } from './foro.service';
import { Question, QuestionDTO } from './Question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public questions: Question[] = [];
  public answers: Answer[]  = [];
  public answered_impression : boolean[] = [];
  public author_login:Author = {id: 0, name: "", url:"", username:"", password:""};
  public question: Question = {id: 0, title:"",detail: "",author: this.author_login,answers : [],views : 0, 
                              creationDate: new Date(), idcorrectAnswer:0};
  public isLogin : boolean = false;
  public isWrongCredentials : boolean = false;

  constructor(private foroService : ForoService) {}
  ngOnInit(): void {
    this.getQuestions();
    this.isLogin = false;
    //this.getAuthor("CarlosRM7","123456");
  }
  
  public onLogin(loginForm : NgForm){
    this.getAuthor(loginForm.value["MLusername"], loginForm.value["MLpassword"]);
    if (this.isLogin) loginForm.resetForm();
  }

  public onLogout(){
    this.isLogin = false;
    this.author_login = {id: 0, name: "", url:"", username:"", password:""};
  }

  private getAuthor(pusername : string, ppwd: string) : void {
    this.foroService.getAuthor(pusername, ppwd).subscribe(
      (response : Author) => {
         this.author_login = response;
         if (response.id === null) {
            this.isWrongCredentials=true;
         }
         else {
            this.isWrongCredentials=false;
            this.isLogin = true;
            this.author_login.password="";
            document.getElementById('btn_login_cancel')?.click();
         }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public onRegister(registerForm : NgForm) : void {
    var author : Author = {
      id: 0,
      name: registerForm.value["MRname"],
      username: registerForm.value["MRusername"],
      url: registerForm.value["MRurl"],
      password : registerForm.value["MRpassword"]
    };
    this.foroService.createAuthor(author).subscribe(
      (response : Author) => {
        this.author_login = response;
        this.isLogin = true;
        document.getElementById('MRbtn_cancel')?.click();
     },
     (error: HttpErrorResponse) => {
       alert(error.message);
     }
    );
  }

  public getQuestions() : void {
    this.foroService.getQuestions().subscribe(
      (response : Question[]) => {
         this.questions = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddQuestion(newQuestionForm : NgForm) : void {
    document.getElementById('MBtnQClose')?.click();
    var question : QuestionDTO = {
      title: newQuestionForm.value["MnewTitle"],
      detail: newQuestionForm.value["MnewDetail"]
    };
    this.foroService.createQuestion(this.author_login.id, question).subscribe(
      (response: Question) => {
        console.log(response);
        this.getQuestions();
        newQuestionForm.resetForm();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddAnswer(newAnswerForm : NgForm) : void {
    var answerDTO : AnswerDTO = {
      detail: newAnswerForm.value["Mnewdetail"],
      idAuthor: this.author_login.id
    };
    this.foroService.createAnswer(this.question.id, answerDTO).subscribe(
      (response: Answer) => {
        console.log(response);
        this.updateCurrentQuestion();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
      newAnswerForm.resetForm();
  }

  public onGetAnswers(question: Question) : void {
    this.question = question;
    this.foroService.updateQuestionViews(question.id).subscribe(
      (response: Question) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddImpression(like_dislike:boolean, answer: Answer) : void {
    if (this.searchPreviousVote(answer)) {
      alert(`${this.author_login.username} You have already vote for this Answer`);
      return;
    }
    this.foroService.updateAnswer(answer.id, this.author_login.id , like_dislike).subscribe(
      (response: Answer) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
      alert(`${this.author_login.username} vote realized`);
      document.getElementById('MUbtn_submit')?.click();
  }

  private searchPreviousVote(answer : Answer) : boolean {
    for (const lauthor of answer.authors_liked) {
      if (lauthor.id === this.author_login.id)
        return true;
    }
    for (const lauthor of answer.authors_disliked) {
      if (lauthor.id === this.author_login.id)
        return true;
    }
    return false;
  }

  private updateCurrentQuestion () {
    this.foroService.getQuestion(this.question.id).subscribe(
    (response: Question) => {
      console.log(response);
      this.question = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  public onSolveQuestion(answer : Answer) : void{
    this.foroService.updateQuestionAnsweredID(this.question.id, answer.id).subscribe(
      (response: Question) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
      alert(`${this.author_login.username} this question has been marked as SOLVED!`);
      document.getElementById('MUbtn_submit')?.click();
  }

  public onUpdAnswer(updAnswerForm : NgForm) {
    this.updateCurrentQuestion();
  }

  public searchQuestions(key: string) : void{
    const results: Question[] = [];
    for (const lquestion of this.questions) {
      if (lquestion.title.toLowerCase().indexOf(key.toLowerCase())!== -1 
        || lquestion.detail.toLowerCase().indexOf(key.toLowerCase())!== -1 
        //|| lquestion.author?.name?.toLowerCase().indexOf(key.toLowerCase())!== -1  
      ) {
        results.push(lquestion);
      }
    }
    this.questions=results;
    if (results.length === 0 || !key) 
      this.getQuestions();
  }

  public searchUser(key: string) : void{
    
  }
}

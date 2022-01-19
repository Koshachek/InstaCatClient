import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

//https://jasonwatmore.com/post/2019/06/10/angular-8-user-registration-and-login-example-tutorial

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenService: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    //если пользователь авторизован
    if (this.tokenService.getUser()) {
      //тогда кинуть его на основную страницу
      this.router.navigate(['/']); //можно поставить main или index
    }
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])], //это поле по умолчанию пусто и является обязательным. Сюда можно засунуть еще валидаций
      password: ['', Validators.compose([Validators.required])],
    })
  }


  //вызывается один раз после установки свойств компонента, которые участвуют в привязке. Выполняет инициализацию компонента
  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  submitDataToServer(): void {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(data => {
        console.log(data);

        this.tokenService.saveToken(data.token);
        this.tokenService.saveUser(data);

        this.notificationService.showSnackBar('Successful authorization');
        this.router.navigate(['/index']);
        window.location.reload();
      }
      , error => {
        console.log(error);
        this.notificationService.showSnackBar('Incorrect login or password'+ error.message);
      });
  }
}

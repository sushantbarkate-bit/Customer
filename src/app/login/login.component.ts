import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LoginService } from "../services/login-service/login.service";
import { Subject, Subscription, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { CacheService } from "../services/cache-service/cache.service";
import { SessionStorageKeys } from "../constants/SessionStorageKeys";

@Component({
    selector: 'login',
    imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule],
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    unSubscribe: Subject<any> = new Subject<any>();
    addNewUser: boolean = false;
    showPassword = false;

    ngOnInit(): void {

    }

    constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private cacheService: CacheService, private translate: TranslateService) {
        this.translate.use('en');
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.maxLength(40), Validators.minLength(3)]],
            lastName: ['', [Validators.maxLength(40), Validators.minLength(3)]],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: [false],
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    registerUser(): void {
        this.addNewUser = true;
    }

    onSubmit(): void {
        // if (this.loginForm.valid) {
        if (this.addNewUser) {
            this.loginService.registerUser({ username: this.loginForm.get('username')?.value, password: this.loginForm.get('password')?.value, email: this.loginForm.get('email')?.value, firstName: this.loginForm.get('firstName')?.value, lastName: this.loginForm.get('lastName')?.value }).pipe(takeUntil(this.unSubscribe)).subscribe({
                next: (response) => {

                }, error: (response) => {

                }
            });
        } else {
            this.loginService.login({ username: this.loginForm.get('email')?.value, password: this.loginForm.get('password')?.value }).pipe(takeUntil(this.unSubscribe)).subscribe({
                next: (response) => {
                    this.cacheService.setSessionStorage(SessionStorageKeys.AUTH_INFO, response.body);
                    this.router.navigate(['/contact']);
                }, error: (response) => {

                }
            });
        }
        // }
    }

    login(): void {
        this.addNewUser = false;
    }

}
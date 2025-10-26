import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private httpClinet: HttpClient) {

    }

    registerUser(user: any) {
        return this.httpClinet.post(`/auth/register`, user, { observe: 'response' });
    }

    login(user: any) {
        return this.httpClinet.post(`/auth/login`, user, { observe: 'response' });
    }
}
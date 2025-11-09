export class LoginResponse {
    accessToken: string;
    refreshToken: string
    tokenType: string;
    constructor(accessToken: string, refreshToken: string, tokenType: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
    }
}
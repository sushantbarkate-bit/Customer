import { Injectable } from "@angular/core";
import { TYPE_CONSTANT } from "../../constants/app-constant";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private KEY_UNDEFINED_MESSAGE = "Key can not be undefined or null";

    setSessionStorage(key: string, value: any): void {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            const result = typeof (value) === TYPE_CONSTANT.STRING ? value : JSON.stringify(value);
            sessionStorage.setItem(key, result);
        }
    }

    getSessionStorage(key: string): any {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            const value = sessionStorage.getItem(key);
            let result;
            try {
                result = JSON.parse(value as any);
            } catch (err) {
                if (typeof (value) === TYPE_CONSTANT.STRING) {
                    result = value;
                }
            }
            return value ? result : undefined;
        }
    }

    removeSessionStorage(key: string): void {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            sessionStorage.removeItem(key);
        }
    }

    getLocalStorage(key: string): any {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : undefined;
        }
    }

    setLocalStorage(key: string, value: any): void {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    removeLocalStorage(key: string): void {
        if (!key) {
            throw new Error(this.KEY_UNDEFINED_MESSAGE);
        } else {
            localStorage.removeItem(key);
        }
    }


}
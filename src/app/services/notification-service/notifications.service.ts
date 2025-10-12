import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from './models';

@Injectable({
    providedIn: "root"
})
export class NotificationsService {
    public subject = new Subject<Notification>();
    public keepAfterRouteChange = true;

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false, wrapperClass?: string, toasterWrapClass?: string) {
        this.showNotification(NotificationType.Success, message, keepAfterRouteChange, wrapperClass, toasterWrapClass);
    }

    error(message: string, keepAfterRouteChange = false, wrapperClass?: string, toasterWrapClass?: string) {
        this.showNotification(NotificationType.Error, message, keepAfterRouteChange, wrapperClass, toasterWrapClass);
    }

    info(message: string, keepAfterRouteChange = false, wrapperClass?: string, toasterWrapClass?: string) {
        this.showNotification(NotificationType.Info, message, keepAfterRouteChange, wrapperClass, toasterWrapClass);
    }

    warn(message: string, keepAfterRouteChange = false, wrapperClass?: string, toasterWrapClass?: string) {
        this.showNotification(NotificationType.Warning, message, keepAfterRouteChange, wrapperClass, toasterWrapClass);
    }

    showNotification(type: NotificationType, message: string, keepAfterRouteChange = false, wrapperClass?: any, toasterWrapClass?: any) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        const notifocationObject = { type: type, message: message, wrapperClass: wrapperClass, toasterWrapClass: toasterWrapClass }

        this.subject.next(<Notification>notifocationObject);
    }

    clear() {
        // this.subject.closed(true)
        // this.subject.next();
    }
}

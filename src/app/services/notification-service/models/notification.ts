import { NotificationType } from './notification-type';

export class Notification {
    id?: string;
    type!: NotificationType;
    message: string | undefined;
    wrapperClass?: string;
    toasterWrapClass?: string;
}
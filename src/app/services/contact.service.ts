import { HttpClient, HttpResponse } from "@angular/common/http";
import { Contact } from "../model/contact-model";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(private httpClinet: HttpClient) {

    }

    addNewContact(contact: Contact) {
        return this.httpClinet.post('/contacts/service', contact, { observe: 'response' });
    }

    getContacts(page: number, size: number): Observable<HttpResponse<Contact[]>> {
        return this.httpClinet.get<Contact[]>(`/contacts/service?page=${page}&size=${size}`, { observe: 'response' });
    }

    updateContact(contactId: string, contact: Contact): Observable<HttpResponse<Contact>> {
        return this.httpClinet.patch<Contact>(`/contacts/service/${contactId}`, contact, { observe: 'response' });
    }

    getContact(contactId: string): Observable<HttpResponse<Contact>> {
        return this.httpClinet.get<Contact>(`/contacts/service/${contactId}`, { observe: 'response' });
    }

    deleteAllContact() {
        return this.httpClinet.delete(`/contacts/service`, { observe: 'response' });
    }

    deleteContact(id: string) {
        return this.httpClinet.delete(`/contacts/service/${id}`, { observe: 'response' });
    }
}
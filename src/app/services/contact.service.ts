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

    addNewContact(contact: Contact): Observable<HttpResponse<Contact>> {
        return this.httpClinet.post<Contact>('/contacts/service', contact, { observe: 'response' });
    }

    filterContact(page: number, size: number, sortBy?: string, asc?: boolean, searchString?: string) {
        let url = `/contacts/service/filter`;
        // ?page=${page}&size=${size}`;
        // if (sortBy) {
        //     url = url + `&sort=${sortBy}`;
        // }
        // if (asc) {
        //     url = url + ',asc';
        // }
        // if (searchString) {
        //     url = url + `&search=${searchString}`;
        // }
        const contact: Contact = {
            firstName: 'test',
            lastName: '',
            email: '',
            phone: ''
        }
        return this.httpClinet.post<Contact[]>(url, contact, { observe: 'response' });
    }

    getContacts(page: number, size: number, sortBy?: string, asc?: boolean, searchString?: string): Observable<HttpResponse<Contact[]>> {

        let url = `/contacts/service?page=${page}&size=${size}`;
        if (sortBy) {
            url = url + `&sort=${sortBy}`;
        }
        if (asc) {
            url = url + ',asc';
        }
        if (searchString) {
            url = url + `&search=${searchString}`;
        }
        return this.httpClinet.get<Contact[]>(url, { observe: 'response' });
    }

    getNextContact(id: string) {
        return this.httpClinet.get(`/contacts/service/next/${id}`, { observe: 'response' });
    }

    getPreviousContact(id: string) {
        return this.httpClinet.get(`/contacts/service/previous/${id}`, { observe: 'response' });
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
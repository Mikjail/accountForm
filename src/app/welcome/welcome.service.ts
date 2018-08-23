import { Injectable, } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FormService {
    private url;
    constructor(private http: Http,
        private requestOption: RequestOptions
        ) {
        this.url = 'https://1wc09i5r47.execute-api.ap-southeast-1.amazonaws.com/dev/chartOfAccounts/getLedgers/5a7dc92a4cefed0b653f6e48';
    }
    getLedgets() {
        return this.http.get(this.url).map((response: Response) =>  response.json());
    }
}
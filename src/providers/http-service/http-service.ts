import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the HttpServiceProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class HttpServiceProvider {

  constructor(public http: Http) {
    console.log('Hello HttpServiceProvider Provider');
  }

  postJSON(url, params) {
    let header = new Headers();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return new Promise((resolve, reject) => {
      this.http.post(url, params, header)
        .map(res => res.json())
        .subscribe(data => resolve(data), err => reject(err))
    })
  }
}

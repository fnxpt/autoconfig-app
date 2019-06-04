import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {NetworkAction} from "app/types";

@Injectable()
export class HttpService {
  private _actions: NetworkAction[] = [];

  constructor(private http: HttpClient) {
  }

  get actions(): NetworkAction[] {
    return this._actions;
  }

  get(url: string, options?) {
    return this.http.get(url, options);
  }

  put(url: string, body: any, options?) {
    return this.http.put(url, this.encodeBody(body), options);
  }

  post(url: string, body: any, options?) {
    return this.http.post(url, this.encodeBody(body), options);
  }

  delete(url: string, options?) {
    return this.http.delete(url, options);
  }

  private encodeBody(body: any): string {
    return Object.keys(body)
      .reduce((res, key) => res.concat(`${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`), [])
      .join('&');
  }
}

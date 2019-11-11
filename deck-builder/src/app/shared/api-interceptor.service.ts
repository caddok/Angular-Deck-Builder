import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = btoa(environment.clientId + ':' + environment.clientSecret);
    let modified: HttpRequest<any>;

    if (localStorage.getItem('apiToken')) {
      modified = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('apiToken'),
        }
      });
      return next.handle(modified);
    } else {
      modified = req.clone({
        setHeaders: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        setParams: {
          grant_type: 'client_credentials'
        }
      });
      return next.handle(modified);
    }
  }
}

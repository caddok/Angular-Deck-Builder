// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export class PageInterceptor implements HttpInterceptor {

//   classCardsPageCounter = 1;
//   neutralCardsPageCounter = 1;

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let modified: HttpRequest<any>;

//     if (req.params.get('class') === 'neutral') {
//       modified = req.clone({
//         params: req.params.append('page', '' + this.neutralCardsPageCounter)
//       });
//       this.neutralCardsPageCounter++;
//     } else {
//       modified = req.clone({
//         params: req.params.append('page', '' + this.classCardsPageCounter)
//       });
//       console.log(modified.params);
//       this.classCardsPageCounter++;
//       console.log(this.classCardsPageCounter);
//     }

//     return next.handle(modified);
//   }
// }

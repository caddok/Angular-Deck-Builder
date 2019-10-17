import { Registration } from './registration.model';

export class User {

  constructor(
    public email: string,
    public id: string,
    // tslint:disable-next-line: variable-name
    public _token: string,
    public tokenExpirationDate: Date,
    private secretQuestion: string,
    private secretAnswer: string,
  ) { }

  get token(): string {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }

    return this.token;
  }
}

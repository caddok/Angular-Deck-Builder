export class Registration {

  constructor(public dateOfBirth: Date,
              public email: string,
              public password: string,
              public secretQuestion: string,
              public secretAnswer: string,
              public firstName?: string,
              public lastName?: string) { }
}

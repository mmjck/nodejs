export class InvalidCredentialsError extends Error {
  constructor() {
    super('E-mail or password not corrects')
  }
}

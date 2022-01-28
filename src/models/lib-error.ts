export default class LibError extends Error {
  public readonly details: any;

  public constructor(message: string, details: any) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, LibError.prototype);
  }
}

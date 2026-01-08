export class ResponseModel<T = unknown, D = unknown> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data?: T,
    public readonly description?: D | null,
  ) {}
  public getResponse(): {
    statusCode: number;
    message: string;
    data?: T;
    description?: D | null;
  } {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      description: this.description,
    };
  }
}

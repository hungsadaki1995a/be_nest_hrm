export class ResponseModel<T = unknown, M = unknown, D = unknown> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data?: T,
    public readonly meta?: M,
    public readonly description?: D | null,
  ) {}

  public getResponse(): {
    statusCode: number;
    message: string;
    data?: T;
    meta?: M;
    description?: D | null;
  } {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: this.meta,
      description: this.description,
    };
  }
}

interface IApiResponse {
  errorCode: number,
  data: any,
}

export default class ApiResponse<T = any> implements IApiResponse {
  errorCode: number;
  data: T;

  constructor(errorCode: number, data: T = null as any) {
    this.errorCode = errorCode;
    this.data = data;
  }
}
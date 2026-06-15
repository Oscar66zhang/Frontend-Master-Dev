export interface IRequestResult {
  success: boolean;
  loading: boolean;
  response: any;
  error: IRequestErrorMessage;
}

export type IRequestErrorMessage = {
  code: string;
  name: string;
  message: string;
} | null;

export interface IRequestOption {
  timeout: number;
}

export interface IResponse {
  success: boolean;
  data?: any;
  code?: string;
  name?: string;
  message?: string;
}

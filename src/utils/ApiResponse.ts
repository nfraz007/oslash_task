import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export type ResponseInterface = {
  status: StatusCodes;
  message: String;
  data: Object;
};

export const SuccessResponse: any = (
  response: Response,
  message: String,
  data: Object = {}
) => {
  const result: ResponseInterface = {
    status: StatusCodes.OK,
    message,
    data,
  };
  return response.status(StatusCodes.OK).json(result);
};

export const ErrorResponse: any = (response: Response, message: String) => {
  const result: ResponseInterface = {
    status: StatusCodes.BAD_REQUEST,
    message,
    data: {},
  };
  return response.status(StatusCodes.BAD_REQUEST).json(result);
};

export const UnauthenticateResponse: any = (response: Response) => {
  const message: string = "Please login.";
  const result: ResponseInterface = {
    status: StatusCodes.UNAUTHORIZED,
    message,
    data: {},
  };
  return response.status(StatusCodes.BAD_REQUEST).json(result);
};

export const NotFoundResponse: any = (response: Response) => {
  const message: string = "data not found.";
  const result: ResponseInterface = {
    status: StatusCodes.NOT_FOUND,
    message,
    data: {},
  };
  return response.status(StatusCodes.NOT_FOUND).json(result);
};

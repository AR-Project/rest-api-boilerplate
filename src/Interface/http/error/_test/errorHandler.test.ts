import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import errorHandlerMiddleware from '../errorHandler.js'

describe("Error middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let mockErrorRequestHandler: Partial<ErrorRequestHandler>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn(),
      json: jest.fn()
    };
    mockErrorRequestHandler = {};
  });

  it("Should pass error when error is not instance of client error", async () => {
    // Arrange
    mockErrorRequestHandler = new Error('TEST ERROR')

    // Action
    errorHandlerMiddleware(mockErrorRequestHandler as ErrorRequestHandler, mockRequest as Request, mockResponse as Response, nextFunction)

    // Assert
    expect(nextFunction).toBeCalledWith(mockErrorRequestHandler)
    expect(mockResponse.json).not.toBeCalled()
    expect(mockResponse.status).not.toBeCalled()
  });

  it('should translate error when error is instance of Client Error', async () => {
    // Arrange
    mockErrorRequestHandler = new Error('TESTING.CUSTOM_ERROR')

    // Action
    errorHandlerMiddleware(mockErrorRequestHandler as ErrorRequestHandler, mockRequest as Request, mockResponse as Response, nextFunction)

    // Assert
    expect(mockResponse.json).toBeCalledWith({ status: 'fail', message: 'error for testing purpose' })
    expect(mockResponse.status).toBeCalledWith(400)
    expect(nextFunction).not.toBeCalled()
  })
});

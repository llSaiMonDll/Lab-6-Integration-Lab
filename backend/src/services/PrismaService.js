import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ErrorResponse } from '../type/response.js';

/**
 * @returns {PrismaClient}
 */
export const getPrisma = () => {
  return global.prisma;
};

export const handlePrismaError = (err) => {
  if (err instanceof ErrorResponse) {
    return err;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return new ErrorResponse(err.message, 404);
    }
    return new ErrorResponse(err.message, 400);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    return new ErrorResponse('Missing field or Incorrect field type provided', 400);
  } else {
    return new ErrorResponse(err.message, 500);
  }
};

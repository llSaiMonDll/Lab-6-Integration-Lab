import { Prisma } from '@prisma/client';
import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';
import { ErrorResponse } from '../type/response.js';

export const getUser = async (r, s) => {
  const { response } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;

  const prisma = getPrisma();
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: +userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    const res = new SuccessResponse('', user);
    return response.json(res);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorRes = new ErrorResponse('Unauthorized user', 401);
      return response.status(errorRes.statusCode).json(errorRes);
    }
    return response.status(500).json(error);
  }
};

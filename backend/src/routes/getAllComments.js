import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const getAllComments = async (r, s) => {
  // TODO : CREATE COMMENT LOGIC
  const { response } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;

  const prisma = getPrisma();
  try {
    const comments = await prisma.comment.findMany({
      where: {
        creatorId: +userId,
      },
    });

    const res = new SuccessResponse('Comments fetched', comments);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

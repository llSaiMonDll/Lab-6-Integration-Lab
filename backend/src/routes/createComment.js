import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const createComment = async (r, s) => {
  // TODO : CREATE COMMENT LOGIC
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;
  const { text } = request.body;

  const prisma = getPrisma();
  try {
    const comment = await prisma.comment.create({
      data: {
        text: text,
        creatorId: +userId,
      },
    });

    const res = new SuccessResponse('comment created', comment);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

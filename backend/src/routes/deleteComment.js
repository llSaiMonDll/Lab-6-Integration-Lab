import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { ErrorResponse, SuccessResponse } from '../type/response.js';

export const deleteComment = async (r, s) => {
  // TODO : DELETE COMMENT LOGIC
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;
  const { commentId } = request.body;
  const prisma = getPrisma();

  try {
    const comment = await prisma.comment.findUniqueOrThrow({
      where: {
        id: +commentId,
      },
    });

    if (comment.creatorId != userId) throw new ErrorResponse('You are not authorized to delete this comment', 403);

    await prisma.comment.delete({
      where: {
        id: +commentId,
      },
    });

    const res = new SuccessResponse('Comment deleted');
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

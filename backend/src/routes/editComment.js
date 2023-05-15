import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { ErrorResponse, SuccessResponse } from '../type/response.js';

export const editComment = async (r, s) => {
  // TODO : EDIT COMMENT LOGIC
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;
  const { text, commentId } = request.body;

  const prisma = getPrisma();
  try {
    const comment = await prisma.comment.findUniqueOrThrow({
      where: {
        id: +commentId,
      },
    });

    if (comment.creatorId != userId) throw new ErrorResponse('You are not authorized to edit this comment', 403);

    const updatedComment = await prisma.comment.update({
      where: {
        id: +commentId,
      },
      data: {
        text: text,
      },
    });

    const res = new SuccessResponse('Comment updated successfully', updatedComment);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const getNoteById = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { noteId } = request.params;

  const prisma = getPrisma();

  try {
    // get note with noteId
    const note = await prisma.note.findUniqueOrThrow({
      where: {
        id: +noteId,
      },
    });

    // return response to client
    const res = new SuccessResponse('Note found', note);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

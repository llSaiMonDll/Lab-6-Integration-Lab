import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const deleteNote = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { noteId } = request.params;

  const prisma = getPrisma();

  try {
    // delete note with noteId
    await prisma.note.delete({
      where: {
        id: +noteId,
      },
    });

    // return response to client
    const res = new SuccessResponse('Note deleted');
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

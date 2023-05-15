import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const editNote = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { title, description, noteId } = request.body;

  const prisma = getPrisma();

  try {
    // update note with noteId
    const note = await prisma.note.update({
      where: {
        id: +noteId,
      },
      data: {
        title: title,
        description: description,
      },
    });

    // return response to client
    const res = new SuccessResponse('Note updated', note);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

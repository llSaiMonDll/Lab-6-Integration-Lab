import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const getAllNotes = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;

  const prisma = getPrisma();

  try {
    // get all notes with userId
    const notes = await prisma.note.findMany({
      where: {
        creatorId: +userId,
      },
    });

    // return response to client
    const res = new SuccessResponse('Notes fetched', notes);
    return response.json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

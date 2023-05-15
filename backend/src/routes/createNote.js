import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma, handlePrismaError } from '../services/PrismaService.js';
import { SuccessResponse } from '../type/response.js';

export const createNote = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { userId } = response.locals;
  const { title, description } = request.body;

  const prisma = getPrisma();

  try {
    // create note
    const note = await prisma.note.create({
      data: {
        title: title,
        description: description,
        creatorId: +userId,
      },
    });

    // return response to client
    const res = new SuccessResponse('Note created', note);
    return response.status(201).json(res);
  } catch (error) {
    const e = handlePrismaError(error);
    return response.status(e.statusCode).json(e);
  }
};

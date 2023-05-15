import { Prisma } from '@prisma/client';
import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma } from '../services/PrismaService.js';
import { ErrorResponse, SuccessResponse } from '../type/response.js';
import { generateAccessToken } from '../services/JWTService.js';

export const login = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { usernameOrEmail, password } = request.body;

  const prisma = getPrisma();
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        AND: [
          { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
          { password: password }, // I'm feeling guity to do this
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    const token = generateAccessToken(user.id);
    const res = new SuccessResponse('User authorized', user);
    return response.cookie('UserToken', token).json(res);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error = new ErrorResponse('Username or Password is incorrect', 401);
    } else {
      error = new ErrorResponse(error.message, 401);
    }
    return response.status(error.statusCode).json(error);
  }
};

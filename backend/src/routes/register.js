import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';
import { getPrisma } from '../services/PrismaService.js';
import { ErrorResponse, SuccessResponse } from '../type/response.js';

export const register = async (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  const { username, email, password } = request.body;

  const prisma = getPrisma();
  try {
    // find if there are duplicate user
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });
    if (user) {
      throw new ErrorResponse('Username or Email already exist', 400);
    }

    // create user
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
      },
    });

    const res = new SuccessResponse('User created');
    return response.json(res);
  } catch (error) {
    if (!(error instanceof ErrorResponse)) {
      error = new ErrorResponse(error.message, 500);
    }
    return response.status(error.statusCode).json(error);
  }
};

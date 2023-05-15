import express from 'express';
import { welcome } from './routes/welcome.js';
import { PrismaClient } from '@prisma/client';
import { login } from './routes/login.js';
import { register } from './routes/register.js';
import { getAllNotes } from './routes/getAllNotes.js';
import { getNoteById } from './routes/getNoteById.js';
import { editNote } from './routes/editNote.js';
import { createNote } from './routes/createNote.js';
import { deleteNote } from './routes/deleteNote.js';
import { getAllComments } from './routes/getAllComments.js';
import { createComment } from './routes/createComment.js';
import { editComment } from './routes/editComment.js';
import { deleteComment } from './routes/deleteComment.js';
import { getUser } from './routes/getUser.js';
import { ErrorResponse } from './type/response.js';
import cors from 'cors';
import { verifyAccessToken } from './services/JWTService.js';

const prisma = new PrismaClient();

const app = express();

global.prisma = prisma;

app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', welcome);

app.post('/login', login);

app.post('/register', register);

app.use((req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw new ErrorResponse('no credential found', 401);

    const verify = verifyAccessToken(token);

    if (verify.err) throw new ErrorResponse('access denied', 403);

    res.locals.userId = verify.id;
    next();
  } catch (error) {
    if (error instanceof ErrorResponse) {
      return res.status(error.statusCode).json(error);
    }
    return res.json(error);
  }
});

app.get('/me', getUser);

app.get('/notes', getAllNotes);

app.get('/note/:noteId', getNoteById);

app.patch('/note', editNote);

app.post('/note', createNote);

app.delete('/note/:noteId', deleteNote);

app.get('/comment', getAllComments);

app.post('/comment', createComment);

app.patch('/comment', editComment);

app.delete('/comment', deleteComment);

app.listen('8000', () => {
  console.log('App is listenning on http://localhost:8000 ');
});

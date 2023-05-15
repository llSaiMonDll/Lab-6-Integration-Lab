import jwt from 'jsonwebtoken';

const YOUR_JWT_SECRET = 'YOUR_JWT_SECRET';

export function generateAccessToken(userId) {
  return jwt.sign(userId, YOUR_JWT_SECRET);
}

export function verifyAccessToken(token) {
  let result = {
    id: null,
    err: null,
  };
  jwt.verify(token, YOUR_JWT_SECRET, (err, id) => {
    result = {
      id: id,
      err: err,
    };
  });

  return result;
}

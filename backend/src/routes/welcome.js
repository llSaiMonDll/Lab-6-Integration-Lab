import { ExpressTypeIntecepter } from '../services/ExpressTypeService.js';

export const welcome = (r, s) => {
  const { response, request } = new ExpressTypeIntecepter(r, s).get();
  response.send('Hello');
};

import pkg from 'express';

export class ExpressTypeIntecepter {
  /**
   * @type {pkg.Request}
   */
  #request;
  /**
   * @type {pkg.Response}
   */
  #response;

  constructor(request, response) {
    this.#request = request;
    this.#response = response;
  }

  get() {
    return { request: this.#request, response: this.#response };
  }
}

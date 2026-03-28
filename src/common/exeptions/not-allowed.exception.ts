import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAllowed extends HttpException {
  constructor() {
    super(
      "You don't have permission to access this route ",
      HttpStatus.FORBIDDEN,
    );
  }
}

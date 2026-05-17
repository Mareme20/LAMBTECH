import { plainToInstance }
from "class-transformer";

import { validate }
from "class-validator";

export const validateDto =
  (dtoClass: any) => {

  return async (
    req: any,
    res: any,
    next: any
  ) => {

    const dto =
      plainToInstance(dtoClass, req.body);

    const errors =
      await validate(dto);

    if (errors.length > 0) {

      return res.status(400).json(errors);
    }

    next();
  };
};
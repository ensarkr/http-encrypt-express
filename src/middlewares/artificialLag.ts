import { NextFunction, Request, Response } from "express";

async function artificialLag_MW(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  next();
}
export { artificialLag_MW };

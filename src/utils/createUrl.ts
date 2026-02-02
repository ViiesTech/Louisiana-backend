import { Request } from "express";

export const createUrl = (
  req: Request,
  file?: Express.Multer.File,
  bodyKey?: string
): string => {
  if (file) {
    const protocol = req.protocol;
    const host = req.get("host");

    const normalizedPath = file.path.replace(/\\/g, "/");
    return `${protocol}://${host}/${normalizedPath}`;
  }

  if (bodyKey && typeof req.body?.[bodyKey] === "string") {
    return req.body[bodyKey];
  }

  return "";
};

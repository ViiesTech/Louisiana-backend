import { Request } from "express";

export const createUrls = (
  req: Request,
  files?: Express.Multer.File[],
  bodyKey?: string
): string[] => {
  if (files && files.length > 0) {
    const protocol = req.protocol;
    const host = req.get("host");

    return files.map(file => {
      const normalizedPath = file.path.replace(/\\/g, "/");
      return `${protocol}://${host}/${normalizedPath}`;
    });
  }

  if (bodyKey && Array.isArray(req.body?.[bodyKey])) {
    return req.body[bodyKey];
  }

  return [];
};

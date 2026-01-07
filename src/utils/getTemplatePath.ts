import path from "path";

export const getTemplatePath = (file: string) =>
  path.join(process.cwd(), "templates", file);

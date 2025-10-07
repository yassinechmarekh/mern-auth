import { Request, Response, NextFunction } from "express";
import xss from "xss";

const sanitize = (obj: any): any => {
  if (typeof obj === "string") return xss(obj);
  if (typeof obj !== "object" || obj === null) return obj;

  const result: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    result[key] = sanitize(obj[key]);
  }
  return result;
};

export const xssSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Intercept and sanitize query
  if (req.query) {
    const originalQuery = { ...req.query };

    Object.defineProperty(req, "query", {
      value: sanitize(originalQuery),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  // Intercept and sanitize params
  if (req.params) {
    const originalParams = { ...req.params };

    Object.defineProperty(req, "params", {
      value: sanitize(originalParams),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  next();
};
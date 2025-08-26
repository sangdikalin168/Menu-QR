
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type ValidationSchemas = {
    body?: ZodSchema<any>;
    query?: ZodSchema<any>;
    params?: ZodSchema<any>;
};

export function validate(schemas: ValidationSchemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: any[] = [];

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) errors.push(...result.error.issues.map(issue => ({ location: 'body', ...issue })));
        }
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) errors.push(...result.error.issues.map(issue => ({ location: 'query', ...issue })));
        }
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) errors.push(...result.error.issues.map(issue => ({ location: 'params', ...issue })));
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        next();
    };
}

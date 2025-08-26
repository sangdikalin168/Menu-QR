import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: {
        role?: string;
        // Add other user properties if needed
    };
}

export function requireRole(role: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        next();
    };
}

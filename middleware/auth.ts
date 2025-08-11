
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || "null";

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        req.user = decoded; 
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export default auth;
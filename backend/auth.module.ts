import * as jsonwebtoken from 'jsonwebtoken';
import { User } from "@common/interfaces/user.interface";
import { Request, Response } from 'express';
import { config } from "dotenv";

const tokenExpression = /(\S+)\.(\S+)\.(\S+)/;

config()

const secret = process.env.JWT_SECRET as string;

export function authenticate(req: Request, _: Response, next: any) {
    const token = extractBearerFromRequest(req);
    try {
        validateJWT(token);
        const jwt = jsonwebtoken.verify(token, secret, { algorithms: ['HS256'] }) as jsonwebtoken.JwtPayload;

        req.user = jwt as User;
        next();
    } catch (ex: any) {
        next(new Error({ ...ex }))
    }
}

export function extractBearerFromRequest(req: Request) {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) throw new Error("No auth token");
    const bearerKeyWord = 'Bearer ';
    return tokenHeader?.split(bearerKeyWord)[1];
}


export function createUserToken(user: User) {
    return jsonwebtoken.sign(user, secret, { expiresIn: '30m' });
}

function validateJWT(token?: string) {
    if (typeof token !== 'string' || token.match(tokenExpression) == null)
        throw new Error('JWT malformed');
}
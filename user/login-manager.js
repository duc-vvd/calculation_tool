import fs from 'fs';
import jwt from 'jsonwebtoken';

const key = fs.readFileSync(`${process.cwd()}/config/config-jwtrs256-key-pem`, 'utf-8');
const secret = Buffer.from(key, 'base64');

export function getVerifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error(`Error token : ${token}, ${error.message}`);
        return null;
    }
}

export function getUserNameAndFullNameInToken(req) {
    if (!req) {
        return null;
    }
    const query = req.query;
    const headers = req.headers;
    const auth = headers.authorization;
    let token = '';

    if (auth || (auth && query)) {
        if (!headers || !auth) {
            console.error(`Headers invalid : ${JSON.stringify(headers)}`);
            return null;
        }
        const splits = auth.split(' ');
        if (splits.length !== 2) {
            console.error(`Token invalid : ${JSON.stringify(headers)}`);
            return null;
        }
        token = splits[1];
    } else if (query) {
        token = query.jwt;
    }
    const decodeToken = getVerifyToken(token);
    if (!decodeToken || !decodeToken.unique_name) {
        console.error(`DecodeToken validate invalid : ${JSON.stringify(decodeToken)}`);
        return null;
    }

    return {
        usernameInToken: decodeToken.unique_name,
        fullName: decodeToken.nameid,
    };
}

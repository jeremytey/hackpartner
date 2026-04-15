// extends the Express Request interface to include a user property, 
// which will hold the decoded JWT payload after authentication.
declare global {
    namespace Express {
        interface Request {
            user?: import('./auth.types').JwtPayload;
        }
    }
}

export {};
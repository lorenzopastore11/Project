import { expressjwt } from "express-jwt";
const config = require('./config.json');

module.exports = authorize;

function authorize(roles: string[]) {
    const { secret } = config;

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressjwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req: any, res: any, next: any) => {
            const token = req.header('Authorization');
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (!decoded || (roles.length && !roles.find(x => x === decoded.role))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authorization successful
            next();
        }
    ];
}

export{}
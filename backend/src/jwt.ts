const { expressjwt } = require('express-jwt');
const config = require('./config');

module.exports = jwt;


function jwt() {
    const { secret } = config;
    const jwt = expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/login',
            '/register',
            '/users/check'
        ]
    });

    return jwt
}

export{}
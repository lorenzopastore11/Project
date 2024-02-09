import config from './config.json';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise;

module.exports = {
    Users: require('./users/user.model'),
    Tables: require('./tables/table.model'),
    Dishes: require('./dishes/dish.model'),
    Orders: require('./orders/order.model'),
};

export{}
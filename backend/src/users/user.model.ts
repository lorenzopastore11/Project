const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    role: { type: String, required: true},
    pwd: { type: String, required: true},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc:any, ret:any) {
        delete ret._id;
        delete ret.pwd;
    }
});

module.exports = mongoose.model('Users', schema);
export{}
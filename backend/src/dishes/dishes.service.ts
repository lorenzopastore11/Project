const db = require('../db');
const Dishes = db.Dishes;

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function getAll() {
    return await Dishes.find();
}

async function getById(Id: any) {
    return await Dishes.findById(Id);
}

async function create(dishParam: any) {

    return new Dishes(dishParam).save();
}

async function update(id: any, dishParam: any) {
    const dish = await Dishes.findById(id);
    // copy dishParam properties to dish
    Object.assign(dish, dishParam);
    await dish.save();
}

async function _delete(id: any) {
    await Dishes.findOneAndDelete({_id: id});
}

export{}
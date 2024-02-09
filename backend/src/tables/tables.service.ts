const db = require('../db');
const Tables = db.Tables;
const User = db.Users;

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function getAll(assignedTo: string, token: string, res:any) {
    
    //Controllo che due utenti con lo stesso ruolo non vedano i dati dell'altro e viceversa
    //controllo sul contenuto
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (assignedTo==="undefined") {
        if(decoded.role === 'CASSIERE') return await Tables.find();
        else res.status(401).json({ message: 'Unauthorized' });
    }
    else {
        const user = await User.findOne({username: assignedTo});

        if(user.id === decoded.idu || decoded.role === 'CASSIERE')
            return await Tables.find({assignedTo});
        else res.status(401).json({ message: 'Unauthorized' });
        
    }
}

async function getById(tableId: any) {
    return Tables.findOne({tableId: tableId});
}

async function create(tableParam: { tableId: string; }) {
    if (await Tables.findOne({ tableId: tableParam.tableId })) {
        throw 'Il numero del tavolo " ' + tableParam.tableId + ' " è già stato preso';
    }

    return new Tables(tableParam).save();
}

async function update(tableId: any, tableParam: any) {

    const table = await Tables.findById(tableId);
    
    // validate
    if (!table) throw 'table not found';
    
    // copy tableParam properties to table
    Object.assign(table, tableParam);

    await table.save();
}

async function _delete(tableId: any) {
    await Tables.findOneAndDelete({tableId: tableId});
}

export{}
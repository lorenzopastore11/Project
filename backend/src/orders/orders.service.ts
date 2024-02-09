const db = require('../db');
const { ObjectId } = require('mongodb');
const Orders = db.Orders;
const Tables = db.Tables;
const Dishes = db.Dishes;
const User = db.Users;

module.exports = {
    create,
    get,
    update,
    delete: _delete,
};

async function create(orderParam: { orderId: number; dateCreation: Date; }) {

    let order = await Orders.findOne().sort({ orderId: "desc" }).limit(1)
    if (order)  {  
        orderParam.orderId = order.orderId+1;
    }
    else {
        orderParam.orderId = 1;
    }

    orderParam.dateCreation = new Date();
    order = new Orders(orderParam);
    await order.save();

    const table = await db.Tables.findOne({tableId: order.tableId})
    table.orderId = order.orderId;
    return await table.save();

}

async function get(orderId: number | string, token: string, res:any) {
    
    //voglio che utenti diversi con il ruolo di cameriere non accedano alle ordinazioni di altri e viceversa
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if(orderId === "undefined") return await Orders.find();
    else {
        if(decoded.role === 'CAMERIERE') {
            const table = await Tables.findOne({orderId: orderId});
            const user = await User.findOne({username: table.assignedTo});
            if(decoded.idu === user.id) {
                return await Orders.find( {orderId});
            }
            else res.status(401).json({ message: 'Unauthorized' });
        }
        else return await Orders.find( {orderId});
    };
    
}



async function update(orderId: any, body: { name: any; category: any; price: any; id: any; paymentRequest: any; payed: any; totalcost: any; }, id: string) {
    
    if(id === "undefined") { //I'd like to insert dish in order

        const dishtype = await Dishes.findOne({name: body.name})
        body.category = dishtype.type;
        body.price = dishtype.price;
        body.id = new ObjectId();
        return await Orders.findOneAndUpdate({orderId: orderId}, {$push: {dishes: body}})   

    }
    else if(id === "-1"){ //I'd like to update paymentRequest

        return await Orders.findOneAndUpdate({orderId: orderId}, {paymentRequest: body.paymentRequest})
    }
    else if(id === "-2") { //I'd like to update payed
        const order = await Orders.findOne({orderId: orderId}) 
        await Tables.findOneAndUpdate({tableId: order.tableId}, {orderId: null});
        order.payed = body.payed;
        order.totalCost = body.totalcost;
        return await order.save();
    }
    else {
        const order = await Orders.findOne({orderId: orderId})
        const dish = order.dishes.find((x: { id: any; }) => x.id === id);
        if(dish.state === "INSERITO")
            dish.state = "INVIATO";
        else if(dish.state === "INVIATO")
            dish.state = "IN PREPARAZIONE";
        else if(dish.state === "IN PREPARAZIONE")
            dish.state = "PRONTO"
        else if(dish.state === "PRONTO")
            dish.state = "CONSEGNATO";
        
        return await order.save();
    }
}

async function _delete(orderId: any, id: string) {
    if(id === "undefined") {
        const order = await Orders.findOne({orderId: orderId}) 
        await Tables.findOneAndUpdate({tableId: order.tableId}, {orderId: null});
        await Orders.findByIdAndDelete(order.id);
    }
    else {
        const order = await Orders.findOne({orderId: orderId});
        const i = order.dishes.findIndex((x: { id: any; }) => x.id === id);
        order.dishes.splice(i, 1);
        return await order.save();
    }
}

export{}
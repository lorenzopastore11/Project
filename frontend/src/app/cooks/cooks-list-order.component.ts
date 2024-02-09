import { Component, OnInit } from "@angular/core";
import { OrderService } from "../_services/order.service";
import { AlertService, TableService } from "../_services";
import { FormBuilder, FormGroup } from "@angular/forms";
import { environment } from "src/environment/environment";

@Component({ templateUrl: 'cooks-list-order.component.html' })
export class CooksListOrderComponent implements OnInit {
    public orders?: any | undefined;
    public form!: FormGroup
    
    constructor(private orderService: OrderService, private tableService: TableService,
        private formBuilder: FormBuilder, private alertService: AlertService) {

    }

    ngOnInit() {
        this.getFood()
        setInterval(() => this.getFood(), environment.timer);

        this.form = this.formBuilder.group({
            state: ['']
        })
    }

    getFood() : any{
        return this.orderService.get().subscribe((orders) => {
            this.orders = orders?.map(x => ({
                ...x,
                dateCreation: new Date(Date.now()), // Converti la stringa in un oggetto Date
                dishes: (x.dishes) ? x.dishes.filter(x => x.state !== 'INSERITO' && x.category !== "BEVANDA"): undefined
                }))
                .sort((x, y) => x.dateCreation.getTime() - y.dateCreation.getTime())
                .filter(x => x.payed === false)
            
            this.orders.forEach((element: { dishes: any[]; }) => {
                element.dishes.forEach(el => {
                    if(el.state !== 'INVIATO') {
                        this.alertService.clear();
                    }
                    else this.alertService.success("Nuovo piatto in arrivo!");
                })
            })
        });
    }

    switchstate(orderId: number, id: string) {

        return this.orderService.update(orderId, this.form.value, id)
        .subscribe(order =>
            this.orders.find((x: { orderId: number; }) => x.orderId === orderId).dishes.find((x: { id: string; }) => x.id === id).state = (order.dishes) ? order.dishes.find(x => (x.id === id))?.state: undefined)
    }
}
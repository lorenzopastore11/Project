import { Component, OnInit} from "@angular/core";
import { OrderService } from "../_services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../_services/alert.service"
import {TableService } from "../_services/table.service";
import { FormControl, FormGroup } from "@angular/forms";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { environment } from "src/environment/environment";
import { formatNumber } from "@angular/common";

@Component({ templateUrl: 'cashier-list-order.component.html' })
export class CashierListOrderComponent implements OnInit{

    orders: any | undefined;
    tables: any | undefined;
    tableId: number | undefined;
    orderId!: number;
    form!: FormGroup;
    total = 0.00;
    sk!: any;
    submitted = false;
    submitting = false;

    constructor(private orderService: OrderService, private tableService: TableService, private route: ActivatedRoute, private alertService: AlertService,
        private router: Router) {
        
    }


    ngOnInit(): void {
        this.tableId = this.route.snapshot.params['tableId']
        this.orderId = this.route.snapshot.params['orderId']
        this.getOrders();
        /*setInterval(() => this.getOrders(), environment.timer);*/
        this.tableService.getAll(this.tableId).subscribe(table => this.tables = table);

    }

    getOrders() {
        this.orderService.get(this.orderId).subscribe(order => this.orders = order);
    }

    check() {
        if(this.orders[0].dishes.length===0) return false;
        return this.orders[0].dishes.every((x: { state: string; }) => x.state === "CONSEGNATO");
    }

    bill() {
        this.total = 2*this.orders[0].covers + this.orders[0].dishes.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price, 0);   
        this.form = new FormGroup({
            totalcost: new FormControl(this.total),
            payed: new FormControl('true'),
        });
        return this.total;
    }

    async generatePDF(event:any) {
        event.preventDefault();
        event.stopPropagation();
        let title = "Scontrino dell'ordine n. " + this.orders[0].orderId;
        let info = "Ristorante DA LOLLO\nVia Mazzini 10, Macondo\nP.I. XXXXXXXXXXX\n----------------------------------------\n";
        let text = "";
        this.orders[0].dishes.forEach((element: { name: string; price: number; }) => {
            
            text += element.name + ": " + formatNumber(element.price, 'it-IT', '1.2') + " €\n";
        });

        text+="Coperti (" + this.orders[0].covers + "): " + formatNumber(2*this.orders[0].covers, 'it-IT', '1.2') + " €\n";
        text+="----------------------------------------";
        text+="\nTotale (IVA inclusa): " + formatNumber(2*this.orders[0].covers + this.orders[0].dishes.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price, 0), 'it-IT', '1.2')
        + " €";

        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        page.drawText(title, {x: 40, y: 800, font: timesRomanFont,});
        page.drawText(info, {x: 40, y:750, size: 12, font: timesRomanFont,})
        

        page.drawText(text, {  
            x: 40,
            y: 650,
            font: timesRomanFont,
            size: 12,
            color: rgb(0, 0, 0),
            lineHeight: 24,
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], {type: 'application/pdf'});

        const pdfUrl = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');

        link.href = pdfUrl;
        link.download = `Order_${this.orders[0].orderId}.pdf`;
        link.click();
        URL.revokeObjectURL(pdfUrl);
    }

    OnSubmit() {

        this.submitted = true;
        this.alertService.clear();
        this.submitting = true;
        this.alertService.onAlert();

        this.orderService.update(this.orderId, this.form.value, "-2").subscribe(order => { //Aggiorno orders e libero il tavolo
            this.router.navigate(['../../../'], {relativeTo: this.route} );
            let x = setInterval(() => {
                this.alertService.success("Ordine aggiornato e liberato il tavolo!");
                clearInterval(x);
            }, environment.timer);
            this.orders = order;
            this.tables.orderId = null;
        });
    }
}
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { TableService } from '../_services/table.service';

@Component({ templateUrl: 'list-table.component.html' })
export class ListTableComponent implements OnInit {
    tables?: any[];

    constructor(private tableService: TableService) {}

    ngOnInit() {
        this.tableService.getAll()
            .pipe(first())
            .subscribe((tables: any[] | undefined) => this.tables = tables?.sort((x, y) => x.tableId - y.tableId));
    }

    deleteTable(id: number) {
        const table = this.tables!.find((x: { tableId: number; }) => x.tableId === id);
        table.isDeleting = true;
        this.tableService.delete(id)
            .pipe(first())
            .subscribe(() => this.tables = this.tables!.filter((x: { tableId: number; }) => x.tableId !== id));
    }
}
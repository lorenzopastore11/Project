import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DishService } from '../_services/dish.service';
import { AccountService } from '../_services';

@Component({ templateUrl: 'list-dish.component.html' })
export class ListDishComponent implements OnInit {
    dishes!: any;

    constructor(private dishService: DishService, private accountService: AccountService) {}

    ngOnInit() {
        this.dishService.getAll()
            .subscribe((dishes: any) => this.dishes = dishes);
    }

    deleteDish(id: string) {
        const dish = this.dishes!.find((x: { id: string; }) => x.id === id);
        dish.isDeleting = true;
        this.dishService.delete(id)
            .pipe(first())
            .subscribe(() => this.dishes = this.dishes!.filter((x: { id: string; }) => x.id !== id));
    }
}

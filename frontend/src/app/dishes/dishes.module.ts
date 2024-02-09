import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DishesRoutingModule } from './dishes-routing.module';
import { ListDishComponent } from './list-dish.component';
import { AddEditDishComponent } from './add-edit-dish.component';
import { DishService } from '../_services';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DishesRoutingModule,
    ],
    declarations: [
        AddEditDishComponent
    ],
    providers: [
        DishService,
        ListDishComponent
    ]
})
export class DishModule { }
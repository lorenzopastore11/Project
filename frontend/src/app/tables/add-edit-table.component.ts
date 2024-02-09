import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../_services';
import { TableService } from '../_services/table.service';
import { User } from '../_models/user';

@Component({ templateUrl: 'add-edit-table.component.html' })
export class AddEditTableComponent implements OnInit {
    form!: FormGroup;
    id?: number;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    users?: User[] | undefined

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tableservice: TableService,
        private alertService: AlertService,
        private accountService: AccountService,
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        //Richiamo tutti gli utenti camerieri
        this.accountService.get(undefined, 'CAMERIERE')
        .subscribe((users:any) => {
            this.users = users;
        });

        
        // form with validation rules
        this.form = new FormGroup({
            tableId: new FormControl('', [Validators.required]),
            seats: new FormControl('', [Validators.min(1), Validators.max(30), Validators.required]),
            orderId: new FormControl(''),
            assignedTo: new FormControl('', [Validators.required])
        }); 

        this.title = 'Aggiungi tavolo';
        if (this.id) {
            // edit mode
            this.title = 'Modifica tavolo';
            this.loading = true;
            this.tableservice.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveTable()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.id ? this.alertService.success('Tavolo aggiornato', true) 
                            : this.alertService.success('Tavolo aggiunto', true);
                    this.router.navigateByUrl('/tables');
                },
                error: (error: any) => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveTable() {
        // create or update table based on id param
        return this.id
            ? this.tableservice.update(this.id!, this.form.value)
            : this.tableservice.create(this.form.value);
    }
}
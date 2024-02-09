import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { Table } from '../_models/table';

@Injectable({ providedIn: 'root' })
export class TableService {
    table: any;
    
    constructor(private http: HttpClient) { }

    /**
     * Create and insert table 
     * @param table 
     * @returns 
     */
    create(table: Table) {
        return this.http.post(`${environment.apiUrl}/tables`, table);
    }

    /**
     * Gets all tables associated to a certain user
     * @param username the username of the user
     * @returns 
     */
    getAll(username?: string | number) {
        return this.http.get<Table[]>(`${environment.apiUrl}/tables?username=${username}`);
    }

    /**
     * Gets a single table by id
     * @param id the table identification
     * @returns 
     */
    getById(id: number) {
        return this.http.get<Table>(`${environment.apiUrl}/tables/${id}`);
    }

    /**
     * Update the table
     * @param id the table identification
     * @param params the body of the update
     * @returns 
     */
    update(id: number, params: any) {
        return this.http.put(`${environment.apiUrl}/tables/${id}`, params);
    }

    /**
     * Delete single table
     * @param id the table identification
     * @returns 
     */
    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/tables/${id}`)
            .pipe(map(x => { return x; }));
    }
}
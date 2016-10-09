/// <reference path="./typings/browser/ambient/jasmine/index.d.ts" />
import {SimpleChange} from "@angular/core";
import {DataTable} from "./DataTable";

describe("DataTable directive tests", ()=> {
    let datatable:DataTable;

    beforeEach(()=> {
        datatable = new DataTable();
        datatable.inputData = [
            {id: 3, name: 'banana'},
            {id: 1, name: 'Duck'},
            {id: 2, name: 'ącki'},
            {id: 5, name: 'Ðrone'},
            {id: 4, name: 'Ananas'}
        ];
        datatable.ngOnChanges({inputData: new SimpleChange(null, datatable.inputData)});
    });

    describe("initializing", ()=> {

        it("data should be empty array if inputData is undefined or null", () => {
            let datatable = new DataTable();
            datatable.ngOnChanges({inputData: new SimpleChange(null, null)});
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([]);
        });

        it("data should be equal to inputData", ()=> {
            datatable.ngDoCheck();
            expect(datatable.data).toEqual(datatable.inputData);
        });

        it("data should be 2 first items", ()=> {
            datatable.rowsOnPage = 2;
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}]);
        });

        it("data should be 3. and 4. items", ()=> {
            datatable.rowsOnPage = 2;
            datatable.activePage = 2;
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([{id: 2, name: 'ącki'}, {id: 5, name: 'Ðrone'}]);
        });

        it("shouldn't recalculate data when no changes", ()=>{
            datatable.ngDoCheck();
            let data = datatable.data;
            datatable.ngOnChanges({});
            datatable.ngDoCheck();
            expect(datatable.data).toBe(data);
        });
    });

    describe("pagination", ()=>{

        beforeEach(()=> {
            datatable.rowsOnPage = 2;
            datatable.ngDoCheck();
        });

        it("should return current page settings", ()=> {
            expect(datatable.getPage()).toEqual({activePage: 1, rowsOnPage: 2, dataLength: 5});
        });

        it("data should be 3. and 4. items when page change", ()=> {
            datatable.setPage(2,2);
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([{id: 2, name: 'ącki'}, {id: 5, name: 'Ðrone'}]);
        });

        it("data should be three first items when page change", ()=> {
            datatable.setPage(1,3);
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([{id: 3, name: 'banana'},{id: 1, name: 'Duck'},{id: 2, name: 'ącki'}]);
        });

        it("data should be two last items when page change", ()=> {
            datatable.setPage(2,3);
            datatable.setPage(2,3);
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([{id: 5, name: 'Ðrone'},{id: 4, name: 'Ananas'}]);
        });
    });

    describe("sorting", ()=>{

        it("id should return current sort setting", () => {
            datatable.setSort("id", "desc");
            expect(datatable.getSort()).toEqual({sortBy: "id", sortOrder: "desc"});
        });

        it("shouldn't refresh data when set page with same settings", ()=>{
            datatable.setSort("name", "asc");
            datatable.ngDoCheck();
            let data = datatable.data;
            datatable.setSort("name", "asc");
            datatable.ngDoCheck();
            expect(datatable.data).toBe(data);
        });

        it("should sort data ascending by name", ()=>{
            datatable.setSort("name", "asc");
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([
                {id: 4, name: 'Ananas'},
                {id: 3, name: 'banana'},
                {id: 1, name: 'Duck'},
                {id: 5, name: 'Ðrone'},
                {id: 2, name: 'ącki'}
            ])
        });

        it("should sort data descending by id", ()=>{
            datatable.setSort("id", "desc");
            datatable.ngDoCheck();
            expect(datatable.data).toEqual([
                {id: 5, name: 'Ðrone'},
                {id: 4, name: 'Ananas'},
                {id: 3, name: 'banana'},
                {id: 2, name: 'ącki'},
                {id: 1, name: 'Duck'}
            ])
        });
    });
});
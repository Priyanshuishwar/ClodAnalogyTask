import { LightningElement, track, wire } from 'lwc';

import getObjects from '@salesforce/apex/getallObject.getObjects';
import getFields from '@salesforce/apex/getallObject.getFields';
import getRecords from '@salesforce/apex/getallObject.getRecords';

export default class Task2 extends LightningElement {

    // rows
    @track rows = [
        {
            id: 1,
            obj: '',
            field: '',
            op: '',
            inp: '',
            fieldOptions: []
        }
    ];

    counter = 1;

    // object dropdown
    @track objectOptions = [];

    // table
    @track data = [];
    @track columns = [];
    showData = false;

    // operator dropdown
    operators = [
        { label: 'Equals', value: 'equals' },
        { label: 'Greater Than', value: 'greater' },
        { label: 'Less Than', value: 'less' },
        { label: 'Contains', value: 'contains' }
    ];

    // load all objects
    @wire(getObjects)
    wiredObjects({ data, error }) {
        if (data) {
            this.objectOptions = data.map(item => {
                return {
                    label: item,
                    value: item
                };
            });
        } else if (error) {
            console.log(error);
        }
    }

    // object change
    handleObjectChange(event) {

        const rowId = Number(event.currentTarget.dataset.id);
        const value = event.detail.value;

        this.rows = this.rows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    obj: value,
                    field: '',
                    op: '',
                    inp: '',
                    fieldOptions: []
                };
            }
            return row;
        });

        getFields({ objectName: value })
            .then(result => {

                const options = result.map(item => {
                    return {
                        label: item,
                        value: item
                    };
                });

                this.rows = this.rows.map(row => {
                    if (row.id === rowId) {
                        return {
                            ...row,
                            fieldOptions: options
                        };
                    }
                    return row;
                });

            })
            .catch(error => {
                console.log(error);
            });
    }

    // field change
    handleFieldChange(event) {

        const rowId = Number(event.currentTarget.dataset.id);
        const value = event.detail.value;

        this.rows = this.rows.map(row => {
            if (row.id === rowId) {
                return { ...row, field: value };
            }
            return row;
        });
    }

    // operator change
    handleOperatorChange(event) {

        const rowId = Number(event.currentTarget.dataset.id);
        const value = event.detail.value;

        this.rows = this.rows.map(row => {
            if (row.id === rowId) {
                return { ...row, op: value };
            }
            return row;
        });
    }

    // input change
    handleInputChange(event) {

        const rowId = Number(event.currentTarget.dataset.id);
        const value = event.target.value;

        this.rows = this.rows.map(row => {
            if (row.id === rowId) {
                return { ...row, inp: value };
            }
            return row;
        });
    }

    // add row
    handleIncrement() {

        this.counter++;

        this.rows = [
            ...this.rows,
            {
                id: this.counter,
                obj: '',
                field: '',
                op: '',
                inp: '',
                fieldOptions: []
            }
        ];
    }

    // delete row
    handleDecrement(event) {

        const rowId = Number(event.currentTarget.dataset.id);

        if (this.rows.length === 1) {
            return;
        }

        this.rows = this.rows.filter(row => row.id !== rowId);
    }

    // generate data (first row only)
    handleGenerate() {

        const firstRow = this.rows[0];

        if (!firstRow.obj || !firstRow.field || !firstRow.op || !firstRow.inp) {
            return;
        }

        getRecords({
            objectName: firstRow.obj,
            fieldName: firstRow.field,
            operator: firstRow.op,
            value: firstRow.inp
        })
            .then(result => {

                this.data = result.data;
                this.columns = result.columns;
                this.showData = true;

            })
            .catch(error => {
                console.log(error);
            });
    }

    // clear all
    handleClear() {

        this.rows = [
            {
                id: 1,
                obj: '',
                field: '',
                op: '',
                inp: '',
                fieldOptions: []
            }
        ];

        this.counter = 1;
        this.data = [];
        this.columns = [];
        this.showData = false;
    }
}

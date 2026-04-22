import { LightningElement, wire, track } from 'lwc';
import getAlllName from '@salesforce/apex/getAllNames.getAlllName';
import helper from '@salesforce/apex/getAllNames.helper';
// import displayData from '@salesforce/apex/getAllNames.displayData';

export default class TaskLwc1 extends LightningElement {
    @track objectOptions = [];
    @track selObjectvalue = '';
    @track feildOptions = [];
    @track selFeildValue = '';
    @track columns = [];
    @track data = [];
    userInput = '';
    showData = false;
    a = 1;
    @track rows = [
        {
            id: this.a,
            feild: []
        }
    ];

    @track operators = [
        { label: 'Equals', value: 'equals' },
        { label: 'Greater', value: 'greater' },
        { label: 'Less', value: 'less' },
        { label: 'Contains', value: 'contains' }
    ];

    selected = [
        { id: this.a, obj: '', feild: '', op: '', inp: '' }
    ];
    @wire(getAlllName)
    wiredObjects({ data, error }) {
        if (data) {
            this.objectOptions = Object.keys(data).map(api => ({
                label : data[api],
                value : api
            }));
        }
    }
//     @wire(getAlllName)
// wiredObjects({ data, error }) {
//     if (data) {
//         this.objectOptions = Object.keys(data).map(api => ({
//             label: data[api],
//             value: api
//         }));
//     }
// }

    handleChange(event) {
        // let id = Number((event.target.id).split('-')[0]);
        let id = Number(event.currentTarget.dataset.id);
        this.selected.forEach(row => {
            if (row.id === id) {
                row.obj = event.detail.value;
            }
        })
        console.log(id);
        this.selObjectvalue = event.detail.value;
        helper({ allObjectName: this.selObjectvalue })
            .then(result => {
                this.feildOptions = result.map(field => ({
                    label: field, value: field
                }));
                this.rows.forEach(row => {
                    if (row.id === id) {
                        row.feild = this.feildOptions;
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    handlFieldeChange(event) {
        // this.selFeildValue = event.detail.value;
        let id = Number(event.currentTarget.dataset.id);
        // this.selected.forEach(row => {
        //     if (row.id === id) {
        //         row.feild = event.detail.value;
        //     }
        // })
        // let value = event.detail.value;
        // this.selected.map()

        // console.log('Row ID:', id);
        // console.log('Selected Field:', value);

        // this.rows.forEach(row => {
        //     if (row.id === id) {
        //         row.selectedField = value;
        //     }
        // });

        let value = event.detail.value;

        this.selected.forEach(row => {
            if (row.id === id) {
                row.field = value;
            }
        });

        this.selected = [...this.selected];
    }
    handleOperatorChange(event) {
        // let id = Number(event.target.id.split('-')[0]);
        let id = Number(event.currentTarget.dataset.id);
        this.selected.forEach(row => {
            if (row.id === id) {
                row.op = event.detail.value;
            }
        })
        this.selectedOperator = event.detail.value;
    }
    handleInputChange(event) {
        this.userInput = event.target.value;
        // let id = Number(event.target.id.split('-')[0]);
        let id = Number(event.currentTarget.dataset.id);
        this.selected.forEach(row => {
            if (row.id === id) {
                row.inp = event.target.value;
            }
        })
        // console.log(this.userInput);
    }
    handleIncrement() {
        this.a += 1;
        this.rows.push({ id: this.a, feild: [{}] });
    }
    handleDecrement(event) {
        let delId = Number(event.currentTarget.dataset.id);
        if (delId == 1) {
            return;
        }

        this.rows = [...this.rows].filter(del => del.id != delId);
    }

    handleToggle() {
        //     if (IsActive) {
        // console.log(this.selObjectvalue);
        // console.log(this.selFeildValue);
        // console.log(this.selectedOperator);
        // console.log(this.userInput);

        //         if (this.selFeildValue) {

        //         }
        //     }
    }

    columns = [
        { label: 'Id', fieldName: 'id' },
        { label: 'Object', fieldName: 'objectName' },
        { label: 'Feild', fieldName: 'FieldName' }
    ];
    buildTableData() {
        this.data = this.selected.map(row => {
            return {
                id: row.id,
                objectName: row.obj,
                fieldName: row.feild || row.field
            };
        });
    }

    handleGenerate() {
        this.buildTableData();
        this.showData = true;

    }
}

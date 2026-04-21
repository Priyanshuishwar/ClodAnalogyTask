import { LightningElement, wire, track } from 'lwc';
import getAlllName from '@salesforce/apex/getAllNames.getAlllName';
import helper from '@salesforce/apex/getAllNames.helper';

export default class TaskLwc1 extends LightningElement {
    @track objectOptions = [];
    @track selObjectvalue = '';
    @track feildOptions = [];
    @track selFeildValue = '';
    @track operators = [
        { label: 'Equals', value: 'equals' },
        { label: 'Greater', value: 'greater' },
        { label: 'Less', value: 'less' },
        { label: 'Contains', value: 'contains' }
    ];

    @wire(getAlllName)
    wiredObjects({ data, error }) {
        if (data) {
            this.objectOptions = data.map(name => {
                return {
                    label: name,
                    value: name
                };
            });
        } else if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        this.selObjectvalue = event.detail.value;

        helper({ allObjectName: this.selObjectvalue })
            .then(result => {
                this.feildOptions = result.map(field => {
                    return { label: field, value: field }
                });
            })
            .catch(error => {
                console.log(error);
            });

    }
    handlFieldeChange(event){
        this.selFeildValue = event.detail.value;
    }
    handleOperatorChange(event) {
        this.selectedOperator = event.detail.value;
    }
}

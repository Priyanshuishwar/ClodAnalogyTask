import { LightningElement, wire, track } from 'lwc';
import getAlllName from '@salesforce/apex/getAllNames.getAlllName';
import helper from '@salesforce/apex/getAllNames.helper';
import IsActive from '@salesforce/schema/Pricebook2.IsActive';

export default class TaskLwc1 extends LightningElement {
    @track objectOptions = [];
    @track selObjectvalue = '';
    @track feildOptions = [];
    @track selFeildValue = '';
    @track columns = [];
    @track data = [];
    userInput = '';
    // isExposed = false;
    a = 1;
    @track rows = [
        { 
            id: this.a ,
            feild : [{}]
        }
    ];
    
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
        let id = Number((event.target.id).split('-')[0]);
        console.log(id);
        this.selObjectvalue = event.detail.value;
        helper({ allObjectName: this.selObjectvalue })
            .then(result => {
                this.feildOptions = result.map(field =>( {
                     label: field, value: field 
                }));
                this.rows.forEach(row =>{
                    if(row.id === id){
                        row.feild = this.feildOptions;
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    handlFieldeChange(event) {
        this.selFeildValue = event.detail.value;
    }
    handleOperatorChange(event) {
        this.selectedOperator = event.detail.value;
    }
    handleInputChange(event) {
        this.userInput = event.target.value;
        // console.log(this.userInput);
    }
    handleIncrement() {
        this.a += 1;
        this.rows.push({ id: this.a ,feild:[{}]});
    }
    handleDecrement(event) {
        let delId = Number((event.target.id).split('-')[0]);
         
        if (delId == 1) {
            return ;
        }

        this.rows = [...this.rows].filter(del => del.id != delId);
    }

    // handleToggle() {
    //     if (IsActive) {
            // console.log(this.selObjectvalue);
            // console.log(this.selFeildValue);
            // console.log(this.selectedOperator);
            // console.log(this.userInput);

    //         if (this.selFeildValue) {

    //         }
    //     }
    // }
    // columns = [
    //     {label : 'selObjectvalue', fieldName : 'selFeildValue'},
    //     {label : 'selFeildValue', fieldName : 'selFeildValue'}
    // ];
    // handleGenerate(event){
    //     // isExposed = true;
    // }
}

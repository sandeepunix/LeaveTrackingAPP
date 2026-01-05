import { LightningElement, wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
import {showToastEvent} from 'lightning/platformShowToastEvent';
const COLUMNS = [
        { label: 'Request Id', fieldName: 'Name', cellAtributes: { class: { fieldName: 'cellClass' } } },
        { label: 'From Date', fieldName: 'From_Date__c', cellAtributes: { class: { fieldName: 'cellClass' } } },
        { label: 'To Date', fieldName: 'To_Date__c', cellAtributes: { class: { fieldName: 'cellClass' } } },
        { label: 'Reason', fieldName: 'Reason__c', cellAtributes: { class: { fieldName: 'cellClass' } } },
        { label: 'Status', fieldName: 'Status__c', cellAtributes: { class: { fieldName: 'cellClass' } } },
        { label: 'Manager Comment', fieldName: 'Manager_Comment__c', cellAtributes: { class: { fieldName: 'cellClass' } } },
        {
            type:"button" , typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            value: 'Edit',
            disabled: { fieldName: 'isEditDisabled'}
        },  cellAtributes: { class: { fieldName: 'cellClass' } }
    }
];

export default class MyLeaves extends LightningElement {
    columns = COLUMNS;
    myLeaves = [];
    myLeavesWiredResult;
    showModelPopup = false;
    objectApiName = 'LeaveRequest__c';
    recordId = '';
    @wire(getMyLeaves)
    wiredMyLeaves(result){
        this.myLeavesWiredResult = result;
        if(result.data){
            this.myLeaves = result.data.map(a=>({
                ...a,
                cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' :
                a.Status__c == 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled : a.Status__c != 'Pending'}));
        }

        if(result.error){
            console.log('error occured while fething my leaves', result.error);
        }
  }
  get noRecordFound(){
    return this.myLeaves.length === 0;
  } 

  newLeaveRequestHandler(){
    this.recordId = '';
    this.showModelPopup = true;
  }
  popupCloseHandler(){
    this.showModelPopup = false;
  } 
    rowActionHandler(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if(actionName === 'Edit'){  
            this.recordId = row.Id;
            this.showModelPopup = true;
        }
    }
successHandler(event){
    this.showModelPopup = false;
    this.showToast('Leave Request updated successfully');
}
showToast(message,title='sucess',variant='success'){
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(evt);
}
}
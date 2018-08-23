import { Component, OnInit } from '@angular/core';
import { FormArray,  FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { formControlBinding } from '@angular/forms/src/directives/reactive_directives/form_control_directive';
import { FormService } from './welcome.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public myForm: FormGroup;
  public arrayForm;
  public formSubmitAttempt = false;
  public ledgets;
  public dataReceived;
  public arrayValues=[];
  public totalCredit= 0;
  public totalDebit= 0;
  public totalAmount=0;
  public submitted = false;
  public showError= false;
  constructor(private fb: FormBuilder,
    private formService: FormService) { }

  ngOnInit() {
    this.initForm();
    this.getLedgets();
  }

  initForm() {
    this.myForm = this.fb.group({
      arrayTestForm: this.fb.array([]),
    });
    this.arrayForm = (<FormArray>this.myForm.controls.arrayTestForm).controls;
    for(let index=0; index < 2; index++){
      this.addNewSectionForm();
    }

  }

/**
   * Adding a new Form
   */
  async addNewSectionForm() {
    const control = <any>this.myForm.controls['arrayTestForm'];
    const formGroup = this.createForm();
    control.push(this.fb.group(formGroup));

  }

  createForm() {
    const arraynewValue = {
      ledget: '',
      debit: '',
      credit:''
    }
    this.arrayValues.push(arraynewValue);
    return{
      ledget: new FormControl('', Validators.required),
      debit: new FormControl(''),
      credit: new FormControl('')
    };
  }

  getLedgets() {
    this.formService.getLedgets().subscribe(
      response => {
        this.ledgets = response.message;
      },
      error => {

      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if(this.validateTotal()){
      this.totalAmount =  this.totalCredit - this.totalDebit;
      console.log("DATA TO SEND", this.arrayValues);
      this.showError=false;
    } else{
      this.showError=true;
    }
  }

  validateTotal() {
    this.totalCredit = 0;
    this.totalDebit = 0;
    this.arrayValues.forEach( value => {
      this.totalCredit += value.credit ? value.credit : 0;
      this.totalDebit +=  value.debit ? value.debit : 0;
    
     });
   return  this.totalCredit === this.totalDebit;
  }
}

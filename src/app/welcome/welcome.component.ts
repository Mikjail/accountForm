import { DataModelToSend } from './data.model';
import { Component, OnInit } from '@angular/core';
import { FormArray,  FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FormService } from './welcome.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public myForm: FormGroup;
  public arrayForm;
  public ledgets = [];
  public arrayValues: DataModelToSend[]  = [];
  public totalCredit = 0;
  public totalDebit = 0;
  public totalAmount = 0;
  public submitted = false;
  public showError = false;
  public indexInput = 0;
  public myControl = [];
  public ladgetFilter: Observable<string[]>;
  constructor(private fb: FormBuilder,
    private formService: FormService) { }

  ngOnInit() {
    this.getLedgets();
  }

 
  private initForm(): void {
    this.myForm = this.fb.group({
      arrayTestForm: this.fb.array([]),
    });
    this.arrayForm = (<FormArray>this.myForm.controls.arrayTestForm).controls;
    for ( let index = 0; index < 2; index++) {
      this.addNewSectionForm();
    }

  }


  private addNewSectionForm() {
    const control = <any>this.myForm.controls['arrayTestForm'];
    const formGroup = this.createForm();
    control.push(this.fb.group(formGroup));
  }

  public createForm() {
    const arraynewValue = {
      ledget: '',
      debit: '',
      credit: ''
    };
    this.arrayValues.push(arraynewValue);
    this.myControl[this.arrayValues.length - 1] = new FormControl('', Validators.required);
    this.ladgetFilter = this.myControl[this.arrayValues.length - 1].valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(<string>value))
    );
    return{
      ledget:  new FormControl('', Validators.required),
      debit:   new FormControl('',  Validators.required),
      credit: new FormControl('',  Validators.required)
    };
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.ledgets.length > 0) {
      return this.ledgets.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }


  private getLedgets() {
    this.formService.getLedgets().subscribe(
      response => {
        this.ledgets = response.message;
        this.initForm();
      },
      error => {

      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.validateTotal()) {
      const valueToSend = this.parseDataToSend();
      console.log("DATA TO SEND", valueToSend);
      this.showError = false;
    } else {
      this.showError = true;
    }
  }

  private parseDataToSend() {
    const valueToSend = [];
    this.arrayValues.forEach( value => {
      const credit =  value.credit ?  value.credit.toFixed(2) : '0';
      const debit = value.debit ?  value.debit.toFixed(2) : '0';
      valueToSend.push({ credit, debit, ledget: value.ledget});
    });

    return valueToSend;
  }

  validateTotal() {
   return  this.totalCredit === this.totalDebit;
  }

  showTotalCredit() {
    this.totalCredit = 0;
    this.arrayValues.forEach( value => {
      this.totalCredit += value.credit ? value.credit : 0;
     });
     return this.totalCredit;
  }

  showTotalDebit() {
    this.totalDebit = 0;
    this.arrayValues.forEach( value => {
      this.totalDebit += value.debit ? value.debit : 0;
    });
    return this.totalDebit;
  }

  valueHasChanged(formValue, formValueDependency) {
    if (formValue > 0) {
      formValueDependency.setErrors(null);
    }
  }
}

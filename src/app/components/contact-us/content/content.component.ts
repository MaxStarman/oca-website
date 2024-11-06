import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

    emailForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.emailForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.emailForm.valid) {
            console.log('Form Submitted', this.emailForm.value);
            this.emailForm.reset();
        }
    }

}

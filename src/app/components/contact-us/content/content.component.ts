import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ViewportScroller} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent {

    @ViewChild('contact-feedback-section') feedback!: ElementRef

    emailForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private viewportScroller: ViewportScroller) {
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    // TODO form submit
    onSubmit() {
        if (this.emailForm.valid) {
            console.log('Form Submitted', this.emailForm.value);
            this.emailForm.reset();
        }
    }

    scrollToFeedback() {
        this.viewportScroller.scrollToAnchor('contact-feedback-section')
    }

}

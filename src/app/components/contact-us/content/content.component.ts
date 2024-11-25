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
            message: ['', Validators.required],
            subject: ['']
        });
    }

    handleSuccess(captchaResponse: string) {
        console.log('Resolved captcha with response: ', captchaResponse);
        // Further processing
    }

    // TODO form submit with firebase
    onSubmit() {
        if (this.emailForm.valid) {
            console.log('Form Submitted', this.emailForm.value);
            // const formData = this.emailForm.value;

            // TODO before deploy check for api email implementation
            const subject = this.emailForm.get('subject')?.value;
            const message = this.emailForm.get('message')?.value;
            const email = this.emailForm.get('email')?.value;
            window.location.href = `mailto:info@protonmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

            setTimeout(() => {
                this.emailForm.reset();
            }, 2000)
        }
    }

    scrollToFeedback() {
        this.viewportScroller.scrollToAnchor('contact-feedback-section')
    }

}

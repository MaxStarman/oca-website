import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ViewportScroller} from "@angular/common";
import {doc, setDoc} from "@angular/fire/firestore";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent {

    @ViewChild('contact-feedback-section') feedback!: ElementRef

    emailForm: FormGroup;

    constructor(private fb: FormBuilder,
                private ngFire: AngularFirestore,
                private viewportScroller: ViewportScroller,
    ) {
        this.emailForm = this.fb.group({
            name: ['', Validators.required],
            subject: [''],
            message: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }


    // TODO form submit with firebase and validation fix
    onSubmit() {

        if (this.emailForm.valid) {
            console.log('Form Submitted', this.emailForm.value);

            const subject = this.emailForm.get('subject')?.value;
            const message = this.emailForm.get('message')?.value;

            // Good upgrade for min price -> Trigger Email from Firestore
            // https://extensions.dev/extensions/firebase/firestore-send-email
            // window.location.href = `mailto:info@protonmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;


            const email = this.emailForm.get('email')?.value;
            const name = this.emailForm.get('name')?.value;

            this.emailForm.reset();
            alert("Sedaj kliknite pošlji na oknu, ki se vam bo odprlo.")

            // this.saveUserEmail(email, name).then(
            //     () => {
            //
            //     }
            // );

        } else if (this.emailForm.invalid) {
            alert('Napolni polja!')
            this.emailForm.markAsTouched();
        }
    }


    async saveUserEmail(email: string, name: string) {
        const userRef = doc(this.ngFire.firestore, `fans/${email}`);
        return setDoc(userRef, {name: name}, {merge: false});
    }

    scrollToFeedback() {
        this.viewportScroller.scrollToAnchor('contact-feedback-section')
    }

}

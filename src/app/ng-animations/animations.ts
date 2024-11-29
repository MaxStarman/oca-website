import {animate, style, transition, trigger} from '@angular/animations';

export const fadeAnimations = [
    trigger('fadeIn', [
        transition(':enter', [
            style({opacity: 0}),
            animate('1000ms', style({opacity: 1}))
        ]),
        transition(':leave', [
            animate('1000ms', style({opacity: 0}))
        ])
    ]),
    trigger('fadeOut', [
        transition(':leave', [
            animate('1000ms', style({opacity: 0}))
        ])
    ])
];

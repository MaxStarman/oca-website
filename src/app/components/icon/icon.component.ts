import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IconName, ICONS} from "./icons";

// Inline SVG icon, sized like text: 1em tall in the current font size and colored with currentColor.
// Decorative only (aria-hidden); the surrounding control carries the label.
@Component({
    selector: 'icon',
    template: `
        <svg [attr.viewBox]="'0 0 ' + shape.width + ' ' + shape.height" [style.width.em]="shape.width / shape.height"
             aria-hidden="true" focusable="false">
            <path [attr.d]="shape.d"/>
        </svg>`,
    styles: [`
        :host {
            display: inline-block;
            line-height: 1;
            vertical-align: -.125em;
        }

        svg {
            display: block;
            height: 1em;
            fill: currentColor;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {

    @Input({required: true}) name!: IconName;

    get shape() {
        return ICONS[this.name];
    }
}

import {Pipe, PipeTransform} from '@angular/core';
import {I18nService} from "./i18n.service";
import {TranslationKey} from "./sl";

// Impure so a language switch re-renders every label; the lookup is a plain object read, so it's cheap.
@Pipe({
    name: 't',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private i18n: I18nService) {
    }

    transform(key: TranslationKey): string {
        return this.i18n.t(key);
    }
}

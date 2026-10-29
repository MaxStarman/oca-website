import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {sl, TranslationKey} from "./sl";
import {en} from "./en";

export type Lang = 'sl' | 'en';

const STORAGE_KEY = 'oca.lang';
const DICTIONARIES: Record<Lang, Record<TranslationKey, string>> = {sl, en};
// Angular locale ids for the date pipe (sl is registered in app.module.ts)
const LOCALES: Record<Lang, string> = {sl: 'sl', en: 'en-US'};

@Injectable({
    providedIn: 'root'
})
export class I18nService {

    private langSubject: BehaviorSubject<Lang>;
    lang$;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.langSubject = new BehaviorSubject<Lang>(this.initialLang());
        this.lang$ = this.langSubject.asObservable();
        this.document.documentElement.lang = this.lang;
    }

    get lang(): Lang {
        return this.langSubject.value;
    }

    get locale(): string {
        return LOCALES[this.lang];
    }

    setLang(lang: Lang): void {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // Storage blocked (private mode): the choice just isn't remembered
        }
        this.document.documentElement.lang = lang;
        this.langSubject.next(lang);
    }

    t(key: TranslationKey): string {
        return DICTIONARIES[this.lang][key];
    }

    // Saved choice first, then the browser language; Slovene for Slovene browsers, English for everyone else
    private initialLang(): Lang {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'sl' || saved === 'en') {
                return saved;
            }
        } catch {
            // Storage blocked: fall through to the browser language
        }
        return navigator.language.toLowerCase().startsWith('sl') ? 'sl' : 'en';
    }
}

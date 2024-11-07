import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { AppModule } from './app/app.module';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';

import { ReplaySubject } from 'rxjs';
import { AppProps } from 'single-spa';
// @ts-ignore
import { setPublicPath } from "systemjs-webpack-interop";

export const singleSpaPropsSubject = new ReplaySubject<SingleSpaProps>(1)

export type SingleSpaProps = AppProps & {
// Add any custom single-spa props you have to this type def
// https://single-spa.js.org/docs/building-applications.html#custom-props
}

export const environment = {
    production: false
};

if (environment.production) {
    enableProdMode();
}

// This sets the name of your application that will be consumed when sharing data with other spa applications
setPublicPath("@bitovi/micro-fe-billing");

const lifecycles = singleSpaAngular({
    bootstrapFunction: singleSpaProps => {
        singleSpaPropsSubject.next(singleSpaProps);
        return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
    },
    template: '<micro-fe-billing-root />',
    Router,
    NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

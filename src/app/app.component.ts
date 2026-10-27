import {Component} from '@angular/core';
import {LoadingService} from "./services/loading.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(loadingService: LoadingService) {
        // Subscribe before the initial navigation starts so its NavigationEnd isn't missed
        loadingService.dismissWhenReady();
    }
}

import {Component, OnInit} from '@angular/core';
import {LoadingService} from "./services/loading.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    isLoading = true;

    constructor(public loadingService: LoadingService) {
    }

    ngOnInit(): void {
        // this.loadingService.loading$.subscribe((loading) => {
        //     this.isLoading = loading;
        // });

        setTimeout(() => {
            this.isLoading = false;
        }, 1500)
    }
}

import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingService} from 'src/app/services/loading.service';

@Pipe({
    name: 'loading',
    pure: false, // To ensure it updates when the observable value changes
})
export class LoadingPipe implements PipeTransform {
    constructor(private loadingService: LoadingService) {
    }

    transform(value: any): Observable<boolean> {
        return this.loadingService.loading$;
    }
}

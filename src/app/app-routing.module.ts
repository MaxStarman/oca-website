import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {YtVideosComponent} from "./components/yt-videos/yt-videos.component";
import {NewsComponent} from "./components/news/display-posts/news/news.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {HomePageComponent} from "./components/home-page/home-page.component";

const routes: Routes = [
    {path: '', component: HomePageComponent},
    {path: 'news', component: NewsComponent},
    {path: 'music', component: YtVideosComponent},
    {path: 'contact', component: ContactUsComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

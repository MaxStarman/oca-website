import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {YtVideosComponent} from "./components/yt-videos/yt-videos.component";
import {NewsComponent} from "./components/news/news.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {DisplayPostsComponent} from "./components/news/display-posts/display-posts.component";

const routes: Routes = [
    {path: '', component: HomePageComponent},
    {path: 'news', component: NewsComponent},
    {path: 'news/post/:id', component: DisplayPostsComponent},
    {path: 'music', component: YtVideosComponent},
    {path: 'music/video/:id', component: YtVideosComponent},
    {path: 'contact', component: ContactUsComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ChannelPage } from './pages/channel/channel.page';
import { PublicChannelsPage } from './pages/public-channels/public-channels.page';

const routes: Routes = [
    {
        path: '', component: HomePage,
        children: [
            { path: '', component: PublicChannelsPage },
            { path: 'channel/:channelId', component: ChannelPage },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
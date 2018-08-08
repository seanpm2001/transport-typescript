import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { RestService } from '@vmw/bifrost/core/services/rest/rest.service';
import { TangoAngularHttpClientAdapter } from '@vmw/tango';
import { HttpClient } from '@angular/common/http';
import { HttpRequest, RestObject } from '@vmw/bifrost/core/services/rest/rest.model';
import { GeneralUtil } from '@vmw/bifrost/util/util';

@Component({
    selector: 'resty',
    templateUrl: './resty.component.html',
    styleUrls: ['./resty.component.css']
})
export class RestyComponent extends AbstractBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;

    constructor(private http: HttpClient) {
        super('RestyComponent');
    }

    ngOnInit() {
    }

    public connectResty() {
        const tangoHttpClientAdaptor = new TangoAngularHttpClientAdapter(this.http, '/');
        ServiceLoader.addService(RestService, tangoHttpClientAdaptor);
        this.status = 'online';
        this.online = true;

        const rest: RestObject  = new RestObject(
            HttpRequest.Get,
            '/icanhazdadjoke.com',
            null,
            {'Accept': 'application/json'}
        );

        this.bus.requestOnceWithId(GeneralUtil.genUUIDShort(), RestService.channel, rest)
            .handle(
                (resp: RestObject) => {
                    console.log('Dad Joke!:', resp.response.joke);
                }
            );

    }

}
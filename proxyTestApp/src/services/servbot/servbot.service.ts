import { AbstractService } from '@vmw/bifrost/core';
import { EventBus, GalacticResponse, MessageArgs } from '@vmw/bifrost';
import { ChatCommand, ServbotRequest, ServbotResponse } from './servbot.model';
import { ChatMessage, GeneralChatChannel } from '../../app/chat-message';


export class ServbotService extends AbstractService<ServbotRequest, ServbotResponse> {

    public static queryChannel = 'servbot-query';
    public static serviceChannel = 'servbot';

    constructor() {
        super('ServBot', ServbotService.queryChannel);
        this.log.info("ServBot Service Online");
    }

    private connectService() {

        this.bus.connectBridge(
            () => {
                this.log.info(`ServBotService connected to broker successfully on bus ${EventBus.id}`);
            },
            '/bifrost',
            '/topic',
            '/queue',
            1,
            'localhost',
            8080,
            '/pub'
        );

        // listen to general chat and relay to servbot.
        this.listenToChat();
    }

    protected handleServiceRequest(requestObject: ServbotRequest, requestArgs?: MessageArgs): void {
        switch (requestObject.command) {

            case ChatCommand.Connect:
                this.connectService();
                break;

            default:
                this.delegate(requestObject);
                break;
        }
    }

    private delegate(requestObject: ServbotRequest): void {
        console.log('galactic delegation', requestObject);
        this.makeGalacticRequest(
            this.buildGalacticRequest(ChatCommand[requestObject.command], null),
            ServbotService.serviceChannel,
            this.handleQueryResponse.bind(this));
    }

    private handleQueryResponse(response: GalacticResponse<string>): void {
        this.postResponse(ServbotService.queryChannel, {body: response[0]})
    }

    private listenToChat() {
        this.bus.listenStream(GeneralChatChannel).handle(
            (chatMessage: ChatMessage) => {
                const payload = this.buildGalacticRequest(ChatCommand[ChatCommand.PostMessage], chatMessage)
                this.bus.sendGalacticMessage(ServbotService.serviceChannel, payload, this.getName())
            },
            (error) => {
                console.log('MUM! MY MUM.....', error);
            }
        );

        // tell everyone that servbot is online!
        this.bus.sendResponseMessage<ChatMessage>(GeneralChatChannel,
            {
                from: this.getName(),
                avatar: '🤖',
                body: 'Type /help to see a list of commands',
                time: Date.now(),
                controlEvent: null,
                error: false
            })
    }

}

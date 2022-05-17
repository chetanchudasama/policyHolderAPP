import SignalRController, { ICreateSignalRConnection } from '@/api/signalrController';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

interface IHubMethodHandler {
    name: string;
    handler: (...args: any[]) => void;
}

export default class SignalRHubConnection {
    private readonly maxRetries: number = 3;
    // tslint:disable:variable-name
    private _hubName: string;
    private _status: ConnectionState;
    private _statusMessage: string;

    private hubConnection: HubConnection | null;
    private handlers: IHubMethodHandler[];
    private retryCount: number;

    // create new instance of a signalr hub connection.
    // once created you can add/remove event handlers using
    // the avaliable methods and then start the connection by calling connect.
    // Note: if connection drops it will attept reconenction automaticaly, also
    // once the access token has expired a new token will be generated and the connection refreshed
    public constructor(hubName: string) {
        this._hubName = hubName;
        this._status = 'disconnected';
        this._statusMessage = '';
        this.hubConnection = null;
        this.handlers = [];
        this.retryCount = 0;
    }

    public get hubName(): string {
        return this._hubName;
    }

    public get status(): ConnectionState {
        return this._status;
    }

    public get statusMessage(): string {
        return this._statusMessage;
    }

    // connect to the service, if failed due to "too many retry attempts"
    // you will need to parse the force parameter to force a reconnect
    public async connect(trackingId: string, force?: boolean): Promise<void> {
        if (this.status === 'connected' || this.status === 'connecting') { return; }
        if (force) {
            // reset retry count if force is true
            this.retryCount = 0;
        }

        if (this.retryCount > this.maxRetries) {
            this._status = 'disconnected';
            this._statusMessage = 'too many retry attempts';
            return;
        }

        this._status = 'connecting';
        this._statusMessage = 'connecting (' + this.retryCount + ') ...';

        // pause between retries (for 2 extra second's each retry attempt)
        await this.sleep(this.retryCount * 2);

        const req = await SignalRController.CreateNewSignalRNegotiateRequest(this.hubName);
        if (req === null) {
            this._status = 'disconnected';
            this._statusMessage = 'failed to negotiate connection request';
            // retry
            this.retryCount++;
            this.connect(trackingId);
            return;
        }

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(req.url, {
                accessTokenFactory: () => req.accessToken,
            })
            .build();

        this.hubConnection.onclose(() => {
            const previousStatus = this.status;
            this._status = 'disconnected';
            this._statusMessage = 'connection closed';
            if (previousStatus === 'disconnecting') {
                // user request (reset retry count and return now)
                this.retryCount = 0;
                return;
            }
            // unexpected close (increase retry count and attempt to connect again)
            this.retryCount++;
            this.connect(trackingId);
        });

        // add handlers
        for (const handler of this.handlers) {
            this.hubConnection.on(handler.name, handler.handler);
        }

        try {
            // attempt start
            await this.hubConnection.start();
            this._status = 'connected';
            this._statusMessage = 'connected';
            this.retryCount = 0; // reset to zero as connected OK
        } catch (err) {
            this._status = 'disconnected';
            this._statusMessage = 'failed to connect, start failed';
            this.connect(trackingId);
            this.retryCount++;
            return;
        }
    }

    // disconnects the current signalr connection (if connected)
    public async disconnect(): Promise<void> {
        if (this.status !== 'connected') { return; }
        if (this.hubConnection === null) { return; }
        this._status = 'disconnecting';
        await this.hubConnection.stop();
    }

    // adds the handler for the given event if one
    // has not already been registered
    public addHandler(name: string, handler: (...args: any[]) => void) {
        let matchedIndex = this.handlers.findIndex((e) => e.name === name);
        if (matchedIndex !== -1) { return; }
        matchedIndex = this.handlers.push({ name, handler });
        if (this.hubConnection) {
            this.hubConnection.on(name, this.handlers[matchedIndex].handler);
        }
    }

    // removes all handlers for the given event
    public removeHandler(name: string) {
        const matchedIndex = this.handlers.findIndex((e) => e.name === name);
        if (matchedIndex === -1) { return; }
        if (this.hubConnection) {
            this.hubConnection.off(name);
        }
        this.handlers.splice(matchedIndex, 1);
    }

    public runHandler(name: string, ...args: any[]) {
        const match = this.handlers.find((e) => e.name === name);
        if (match) {
            match.handler.apply(this, args);
        }
    }

    private sleep(seconds: number) {
        return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
    }
}

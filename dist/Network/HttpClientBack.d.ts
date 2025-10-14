import { HttpClientInterface, Response, RequestInterface } from "../Types/request";
export default class HttpClient implements HttpClientInterface {
    private defaultTimeout;
    private retryCount;
    constructor(options?: {
        timeout?: number;
        retryCount?: number;
    });
    private _sendRequestAxios;
    private serializeBody;
    private parseResponse;
    get(request: RequestInterface): Promise<Response>;
    post(request: RequestInterface): Promise<Response>;
}

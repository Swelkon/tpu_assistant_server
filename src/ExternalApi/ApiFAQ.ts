import {HttpService} from "@nestjs/axios";

export class ApiFAQ {

    private httpService: HttpService;
    private FAQ_BASE_URL = process.env.FAQ_BASE_URL
    private FAQ_ENDPOINT_KEY = process.env.ENDPOINT_KEY

    constructor(httpService: HttpService) {
        this.httpService = httpService
    }

    public async getAnswerFAQ(question: string) {

        try{
            // Get answer
            const answerTokenObservable = await this.httpService.post(`${this.FAQ_BASE_URL}/generateAnswer`,
                {'question': question}, {
                    headers: {
                        'Authorization': `EndpointKey ${this.FAQ_ENDPOINT_KEY}`,
                        'Content-Type': 'application/json'
                    }
                })
            const response = await answerTokenObservable.toPromise();

            return response.data

        } catch (e) {
            return null
        }
    }

}
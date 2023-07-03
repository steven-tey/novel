export declare class CustomFormData extends FormData {
    private _boundary;
    constructor(...args: any);
    getHeaders(): {
        "content-type": string;
    };
}

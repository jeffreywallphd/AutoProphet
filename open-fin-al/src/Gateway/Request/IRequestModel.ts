export interface IRequestModel {
    type: string;
    request: any;

    convert(request: any): void;
}
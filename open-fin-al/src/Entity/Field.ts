export class Field {
    name: string;
    dataType: string;
    value: any;

    constructor(name: string, dataType: string, value: any) {
        this.name = name;
        this.dataType = dataType;
        this.value = value;
    }

    setValue(value: any) {
        this.value = value;
    }
}
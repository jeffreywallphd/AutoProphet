import {IEntity} from "../../Entity/IEntity";

export interface IResponseModel {
    response: any;

    convertFromEntity(entities: Array<IEntity>): void;
}

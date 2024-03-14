import {IEntity} from "../../Entity/IEntity";

export interface IDataGateway {
    key: string;
    connect(): void;
    disconnect(): void;
    create(entity: IEntity): Promise<Boolean>;
    read(entity: IEntity): Promise<Array<IEntity>>;
    update(entity: IEntity): Promise<number>;
    delete(entity: IEntity): Promise<number>;
    search(entity: IEntity): Promise<Array<IEntity>>;
}
import { ProjectStatus } from '../../src/models/projectStatus';
import { ValidaAdvpl } from './../validaAdvpl';
export declare class Fila {
    status: ProjectStatus;
    list: ItensValidacao[];
    returnList: ValidaAdvpl[];
    run(): Promise<ValidaAdvpl[]>;
}
export declare class ItensValidacao {
    finally: boolean;
    running: boolean;
    fileName: string;
    project: string;
    content: string;
    validaAdvpl: ValidaAdvpl;
    constructor(fileName: string, project: string, content: string, validaAdvpl: ValidaAdvpl);
}

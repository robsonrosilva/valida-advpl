export declare enum Severity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}
export declare class Erro {
    startLine: number;
    endLine: number;
    message: string;
    severity: Severity;
    constructor(startLine: number, endLine: number, message: string, severity?: Severity);
}

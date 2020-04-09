export enum Severity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3
}

export class Erro {
  startLine: number;
  endLine: number;
  message: string;
  severity: Severity;
  constructor(
    startLine: number,
    endLine: number,
    message: string,
    severity?: Severity
  ) {
    this.startLine = startLine;
    this.endLine = endLine;
    this.message = message;
    this.severity = severity;
  }
}

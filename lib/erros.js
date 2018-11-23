"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Severity;
(function (Severity) {
    Severity[Severity["Error"] = 0] = "Error";
    Severity[Severity["Warning"] = 1] = "Warning";
    Severity[Severity["Information"] = 2] = "Information";
    Severity[Severity["Hint"] = 3] = "Hint";
})(Severity = exports.Severity || (exports.Severity = {}));
class Erro {
    constructor(startLine, endLine, message, severity) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.message = message;
        this.severity = severity;
    }
}
exports.Erro = Erro;
//# sourceMappingURL=erros.js.map
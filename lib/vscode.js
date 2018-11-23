"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 * Represents the severity of diagnostics.
 */
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    /* *
     * Something not allowed by the rules of a language or other means.
     */
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
    /* *
     * Something suspicious but allowed.
     */
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
    /* *
     * Something to inform about but not a problem.
     */
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
    /* *
     * Something to hint to a better way of doing it, like proposing
     * a refactoring.
     */
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
})(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
/* *
 * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
 * are only valid in the scope of a file.
 */
class Diagnostic {
    /* *
     * Creates a new diagnostic object.
     *
     * @param range The range to which this diagnostic applies.
     * @param message The human-readable message.
     * @param severity The severity, default is [error](#DiagnosticSeverity.Error).
     */
    constructor(range, message, severity) {
        this.range = range;
        this.message = message;
        this.severity = severity;
    }
}
exports.Diagnostic = Diagnostic;
/* *
 * A range represents an ordered pair of two positions.
 * It is guaranteed that [start](#Range.start).isBeforeOrEqual([end](#Range.end))
 *
 * Range objects are __immutable__. Use the [with](#Range.with),
 * [intersection](#Range.intersection), or [union](#Range.union) methods
 * to derive new ranges from an existing range.
 */
class Range {
    /* *
     * Create a new range from number coordinates. It is a shorter equivalent of
     * using `new Range(new Position(startLine, startCharacter), new Position(endLine, endCharacter))`
     *
     * @param startLine A zero-based line value.
     * @param startCharacter A zero-based character value.
     * @param endLine A zero-based line value.
     * @param endCharacter A zero-based character value.
     */
    constructor(startLine, startCharacter, endLine, endCharacter) {
    }
}
exports.Range = Range;
/* *
 * Represents a line and character position, such as
 * the position of the cursor.
 *
 * Position objects are __immutable__. Use the [with](#Position.with) or
 * [translate](#Position.translate) methods to derive new positions
 * from an existing position.
 */
class Position {
    /* *
     * @param line A zero-based line value.
     * @param character A zero-based character value.
     */
    constructor(line, character) {
    }
}
exports.Position = Position;
//# sourceMappingURL=vscode.js.map
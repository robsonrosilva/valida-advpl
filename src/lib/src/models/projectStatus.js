"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStatus = void 0;
class ProjectStatus {
    set _total(total) {
        this.total = total;
        if (this._changeEmmit) {
            this._changeEmmit();
        }
    }
    get _total() {
        return this.total;
    }
    set _atual(atual) {
        this.atual = atual;
        if (this._changeEmmit) {
            this._changeEmmit();
        }
    }
    get _atual() {
        return this.atual;
    }
}
exports.ProjectStatus = ProjectStatus;
//# sourceMappingURL=projectStatus.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const os = __importStar(require("os"));
const fileSystem = __importStar(require("fs"));
class Cache {
    constructor(fileCache) {
        this.fileCache = fileCache;
        this.tmpFolder = os.tmpdir();
        this.fileCache =
            this.fileCache.replace(/\\/g, '').replace(/\:/g, '').replace(/\//g, '') +
                '.cache';
        let content;
        try {
            if (!fileSystem.existsSync(this.tmpFolder + '\\' + this.fileCache)) {
                fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, '', {
                    mode: 0o755,
                });
            }
            content = fileSystem.readFileSync(this.tmpFolder + '\\' + this.fileCache, 'utf8');
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
        if (content) {
            this.filesInCache = JSON.parse(content);
        }
        else {
            this.filesInCache = [];
        }
    }
    //adiciona o item e grava em cache
    addFile(file) {
        // Faz uma cópia do objeto pois como uso sempre o mesmo evito maiores problemas
        file.validaAdvpl = JSON.parse(JSON.stringify(file.validaAdvpl));
        this.filesInCache.push(file);
        try {
            fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, JSON.stringify(this.filesInCache), { flag: 'w' });
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
    }
    //remove o item e grava em cache
    delFile(fsPath) {
        this.filesInCache = this.filesInCache.filter((_file) => _file.file !== fsPath);
        try {
            fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, JSON.stringify(this.filesInCache), { flag: 'w' });
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map
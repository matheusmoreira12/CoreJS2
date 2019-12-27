var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IdentifierGenerator } from "./IdentifierGenerator.js";
import { Ajax } from "./Ajax.js";
import { URLData } from "./URLUtils.js";
const CURRENT_MODULE_URL = URLData.parse(import.meta.url);
const CORE_BASE_URL = URLData.parse(CURRENT_MODULE_URL + "/..").collapse().toString();
const CORE_URL = URLData.parse(CORE_BASE_URL + "/..").collapse().toString();
const MODULE_EXTENSION = ".m.js";
const scriptIdGenerator = new IdentifierGenerator("script");
function loadModuleScript(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = scriptIdGenerator.generate();
        let text = yield Ajax.get(url, { responseType: "text" });
        const script = document.createElement("script");
        script.id = id;
        script.type = "module";
        script.innerText = text;
        return script;
    });
}
export class ScriptLoader {
    constructor(url) {
        this.status = ScriptLoader.STATUS_PENDING;
        this.scriptTag = null;
        this.url = url;
    }
    static get STATUS_FAILED() { return -1; }
    static get STATUS_PENDING() { return 0; }
    static get STATUS_LOADING() { return 1; }
    static get STATUS_LOADED() { return 2; }
    static load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let moduleLoader = new ScriptLoader(url);
            yield moduleLoader.load();
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = ScriptLoader.STATUS_LOADING;
            try {
                const scriptTag = yield loadModuleScript(this.url);
                document.head.appendChild(scriptTag);
                this.status = ScriptLoader.STATUS_LOADED;
                return scriptTag;
            }
            catch (e) {
                this.status = ScriptLoader.STATUS_FAILED;
                throw e;
            }
        });
    }
}

import { IdentifierGenerator } from "./IdentifierGenerator.js";
import { Ajax } from "./Ajax.js";
import { URLUtils, URLData } from "./URLUtils.js";

const CURRENT_MODULE_URL = URLData.parse(import.meta.url);
const CORE_BASE_URL = URLData.parse(CURRENT_MODULE_URL + "/..").collapse().toString();
const CORE_URL = URLData.parse(CORE_BASE_URL + "/..").collapse().toString();

const MODULE_EXTENSION = ".m.js";

const scriptIdGenerator = new IdentifierGenerator("script");

async function loadModuleScript(url) {
    const id = scriptIdGenerator.generate();

    let text = await Ajax.get(url, { responseType: "text" });

    const script = document.createElement("script");
    script.id = id;
    script.type = "module";
    script.innerText = text;
    return script;
}

export class ScriptLoader {
    static get STATUS_FAILED() { return -1; }
    static get STATUS_PENDING() { return 0; }
    static get STATUS_LOADING() { return 1; }
    static get STATUS_LOADED() { return 2; }

    static async load(url) {
        let moduleLoader = new ScriptLoader(url);
        await moduleLoader.load();
    }

    constructor(url) {
        this.url = url;
    }

    async load() {
        this.status = ScriptLoader.STATUS_LOADING;

        try {
            const scriptTag = await loadModuleScript(this.url);
            document.head.appendChild(scriptTag);

            this.status = ScriptLoader.STATUS_LOADED;
            return scriptTag;
        }
        catch (e) {
            this.status = ScriptLoader.STATUS_FAILED;
            throw e;
        }
    }

    status = ScriptLoader.STATUS_PENDING;
    scriptTag = null;
}
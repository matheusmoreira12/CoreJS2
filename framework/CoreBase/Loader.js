const pendingLoaders = [];
const resolvedLoaders = [];

export const Loader = {
    async load(url) {
        let moduleLoader = new ModuleLoader(url);
        pendingLoaders.push(moduleLoader);

        await moduleLoader.load();
    }
};

function clearResolved() {
    for (let i = pendingLoaders.length - 1; i > 0; i--) {
        const loader = pendingLoaders[i];
        if (loader.status === ModuleLoader.STATUS_PENDING ||
            loader.status === ModuleLoader.STATUS_LOADING)
            continue;
        pendingLoaders.splice(i, 1);
    }
}

const MODULE_EXTENSION = ".m.js";

const moduleScriptIdCount = 0;
function getNewModuleScriptId() {
    return "module" + moduleScriptIdCount;
    moduleScriptIdCount++;
}

function loadModuleScript(url) {
    return new Promise((resolve, reject) => {
        const id = namespaceToTagId();

        const script = document.createElement("script");
        script.id = id;
        script.type = module;
        script.src = url;

        function load_handler() {
            resolve(script);
        }
        script.onload = load_handler;

        function error_handler() {
            reject(`Error loading script "${url}".`);
        }
        script.onerror = error_handler;
    });
}

class ModuleLoader {
    get STATUS_FAILED() { return -1; }
    get STATUS_PENDING() { return 0; }
    get STATUS_LOADING() { return 1; }
    get STATUS_LOADED() { return 2; }

    constructor(url) {
        this.url = url;
    }

    async load() {
        this.status = ModuleLoader.STATUS_LOADING;

        try {
            const scriptTag = await loadModuleScript(this.url);
            document.head.appendChild(scriptTag);

            this.scriptTag = script;
            this.status = ModuleLoader.STATUS_LOADED;
        }
        catch (e) {
            this.status = ModuleLoader.STATUS_FAILED;

            throw e;
        }
    }

    status = ModuleLoader.STATUS_PENDING;
    scriptTag = null;
}
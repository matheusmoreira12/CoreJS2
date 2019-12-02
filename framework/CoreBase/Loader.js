const pendingModuleLoaders = [];

export const Loader = {
    async load(url) {
        let moduleLoader = new ModuleLoader(url);
        await pendingModuleLoaders.push(moduleLoader);
    }
};

const MODULE_EXTENSION = ".m.js";
const TAG_ID_SEPARATOR = "_";

function createModuleScriptTag(namespace) {
    function namespaceToTagId() {
        return namespace.items.join(TAG_ID_SEPARATOR);
    }

    function namespaceToUrl() {
        return namespace.ToString() + MODULE_EXTENSION;
    }

    return new Promise((resolve, reject) => {
        const url = namespaceToUrl();
        const id = namespaceToTagId();

        const script = document.createElement("script");
        script.id = id;
        script.type = module;

        function load_handler() {
            resolve(script);
        }
        script.onload = load_handler;

        function error_handler() {
            reject(`Error loading script "${url}".`);
        }
        script.onerror = error_handler;

        script.src = url;
    });
}

class ModuleLoader {
    get STATUS_FAILED() { return -1; }
    get STATUS_PENDING() { return 0; }
    get STATUS_LOADING() { return 1; }
    get STATUS_LOADED() { return 2; }

    load(url) {
        this.status = ModuleLoader.STATUS_LOADING;

        if (!url.endsWith(".m.js"))
            throw `Cannot load module. Module URL must have extension "*.m.js".`;

        try {
            const blob = await loadResource(url);
            const script = createModuleScriptTag(blob);
            document.head.appendChild(script);

            this.status = ModuleLoader.STATUS_LOADED;
        }
        catch (e) {
            this.status = ModuleLoader.STATUS_FAILED;

            throw e;
        }
    }

    status = ModuleLoader.STATUS_PENDING;
}
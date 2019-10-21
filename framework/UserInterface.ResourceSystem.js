let currentContext = ReferenceManager.rootContext.derive();

const ResourceManager = {
    declare(key, resource) {
    },

    async request(key) {
        return await ReferenceManager.request();
    }
};

export { ResourceSystem };
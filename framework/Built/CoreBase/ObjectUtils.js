export const ObjectUtils = {
    getBlank(obj) {
        return Object.create(Object.getPrototypeOf(obj));
    },
    getDeepReadonly(obj) {
        function getFrozen(obj) {
            if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
                return obj;
            let frozenObj = this.getBlank(obj);
            for (let key in obj)
                frozenObj[key] = getFrozen(obj[key]);
            return Object.freeze(frozenObj);
        }
        return getFrozen(obj);
    },
    getDeepClone(obj) {
        function getClone(obj) {
            if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
                return obj;
            let clonedObj = this.getBlank(obj);
            for (let key in obj)
                clonedObj[key] = getClone(obj[key]);
        }
        return getClone(obj);
    }
};

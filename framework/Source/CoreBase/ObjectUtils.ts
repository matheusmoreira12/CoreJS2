export const ObjectUtils = {
    deepFreeze(obj) {
        function getFrozen(obj) {
            if (typeof obj !== "object")
                return obj;

            let frozenObj = {};
            for (let key in obj)
                frozenObj[key] = getFrozen(obj[key]);

            return Object.freeze(frozenObj);
        }

        return getFrozen(obj);
    }
};
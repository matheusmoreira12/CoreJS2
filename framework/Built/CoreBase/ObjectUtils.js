export var CoreBase;
(function (CoreBase) {
    CoreBase.ObjectUtils = {
        deepFreeze(obj) {
            function getFrozen(obj) {
                if (typeof obj !== "object")
                    return obj;
                let readonlyObj = {};
                for (let key in obj)
                    readonlyObj[key] = getFrozen(obj[key]);
                return Object.freeze(readonlyObj);
            }
            return getFrozen(obj);
        }
    };
})(CoreBase || (CoreBase = {}));

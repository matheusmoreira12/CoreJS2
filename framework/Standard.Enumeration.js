const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    static getName(enumeration, flag) {
        for (let flagPair of this.getAllFlags(enumeration))
            if (flagPair.value == flag)
                return flagPair.key;

        return null;
    }

    static *getAllFlags(enumeration) {
        for (let key of Object.getOwnPropertyNames(enumeration)) {
            let flag = enumeration[key];

            if (!key.match(ENUMERATION_FLAG_NAME_PATTERN)) continue;

            if (typeof flag === "number")
                yield new KeyValuePair(key, flag);
        }
    }

    static isSet(enumeration, flag) {
        return (flag & enumeration) == flag;
    }

    static create(map) {
        let customEnum = class CustomEnumeration extends Enumeration { };

        function addFlag(name, value) {
            Object.defineProperty(customEnum, name, {
                get() { return value; }
            });
        }

        if (map instanceof Array) {
            for (let i = 0; i < map.length; i++)
                addFlag(map[i], i);
        }
        else if (typeof map === "object")
            for (let key in map) {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("EnumerationName", key);

                let value = map[key];

                if (typeof value != "number")
                    throw new InvalidTypeException("value", Number);

                addFlag(key, value);
            }
        else
            throw new ArgumentTypeException("map", [Array, Object]);

        return customEnum;
    }
}
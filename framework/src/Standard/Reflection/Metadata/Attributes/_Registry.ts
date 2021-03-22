import { Attribute } from "./index.js";
import { ClassOf } from "../../Types.js";

type RegistryEntry = {
    ctor: ClassOf<any>;
    key: string | symbol | null;
    attributes: Attribute[]
}

const registeredAttributes: RegistryEntry[] = [];

export function registerAttributes(ctor: ClassOf<any>, key: string | symbol | null, attributes: Attribute[]) {
    let entry = registeredAttributes.find(e => e.ctor === ctor && e.key === null);
    if (entry)
        entry.attributes.push(attributes);
    else {
        entry = {
            ctor,
            key,
            attributes
        }
        registeredAttributes.push(entry);
    }
}

export function getRegisteredAttributes(ctor: ClassOf<any>, key: string | symbol | null, attrCtor?: ClassOf<Attribute>): Attribute[] {
    const entry = registeredAttributes.find(e => e.ctor === ctor && e.key === key);
    if (entry) {
        if (attrCtor === undefined)
            return entry.attributes;
        else
            return entry.attributes.filter(a => a.constructor === attrCtor);
    }
    return [];
}
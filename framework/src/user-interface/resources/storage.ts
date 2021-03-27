import { TryOutput } from "../../standard/reflection/types.js";
import { ResourceDictionary } from "./resource-dictionary.js";

const allDictionaries: ResourceDictionary[] = [];

export function tryGet(key: string, output: TryOutput<ResourceDictionary> = {}) {
    const resourceDictionary = allDictionaries.find(rd => rd.key == key);
    if (resourceDictionary) {
        output.result = resourceDictionary;
        return true;
    }
    else
        return false;
}

export function store(dictionary: ResourceDictionary) {
    allDictionaries.push(dictionary);
}
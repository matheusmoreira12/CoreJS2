import { DependencyProperty, DependencyObject } from "../DependencyObjects/index.js";
import { TryOutput } from "../../Standard/Types/Types.js";
import { InvalidOperationException } from "../../Standard/index.js";
import * as Storage from "./Storage.js";
import { Type } from "../../Standard/Types/Type.js";

export class ResourceDictionary extends DependencyObject {
    static get(key: string): ResourceDictionary {
        const storageTryGetOutput: TryOutput<ResourceDictionary> = {};
        if (Storage.tryGet(key, storageTryGetOutput))
            return <ResourceDictionary>storageTryGetOutput.result;
        else
            throw new InvalidOperationException("Cannot get resource dictionary. No resource dictionary matches the specified key.");
    }

    constructor() {
        super();

        Storage.store(this);
    }

    static nestedDictionariesProperty = DependencyProperty.register(ResourceDictionary, "nestedDictionaries", { valueType: Type.get(Array) });
    get nestedDictionaries(): ResourceDictionary[] { return this.get(ResourceDictionary.nestedDictionariesProperty); };
    set nestedDictionaries(value: ResourceDictionary[]) { this.set(ResourceDictionary.nestedDictionariesProperty, value); }

    static resourcesProperty = DependencyProperty.register(ResourceDictionary, "resources", { valueType: Type.get(Array) });
    get resources(): any[] { return this.get(ResourceDictionary.resourcesProperty); }
    set resources(value: any[]) { this.set(ResourceDictionary.resourcesProperty, value); }

    static keyProperty = DependencyProperty.register(ResourceDictionary, "key", { valueType: Type.get(String) });
    get key(): string { return this.get(ResourceDictionary.keyProperty); }
    set key(value: string) { this.set(ResourceDictionary.keyProperty, value); }

    static resource_keyProperty = DependencyProperty.register(ResourceDictionary, "key", { valueType: Type.get(String) });
}
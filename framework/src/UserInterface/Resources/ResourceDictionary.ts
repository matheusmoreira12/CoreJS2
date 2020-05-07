import { DependencyProperty, DependencyObject } from "../DependencyObjects/index.js";
import { TryOutput } from "../../Standard/Types/Types.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import * as Storage from "./Storage.js";
import { Type } from "../../Standard/Types/Type.js";
import { Collection } from "../../Standard/Collections/index.js";

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

        this.resources = new Collection();
        this.nestedDictionaries = new Collection();

        Storage.store(this);
    }

    tryGetResource(key: string, output: TryOutput<any>): boolean {
        //Search in resources
        for (let resource of this.resources) {
            const resourceKey = resource.get(ResourceDictionary.resource_keyProperty);
            if (resourceKey == key) {
                output.result = resource;
                return true;
            }
        }
        //Search in nested dictionaries
        for (let dictionary of this.nestedDictionaries) {
            const tryGetResourceOutput: TryOutput<any> = {};
            if (dictionary.tryGetResource(key, tryGetResourceOutput)) {
                output.result = tryGetResourceOutput.result;
                return true;
            }
        }
        return false;
    }

    getResource(key: string): any {
        const tryGetResourceOutput: TryOutput<any> = {};
        if (this.tryGetResource(key, tryGetResourceOutput))
            return tryGetResourceOutput.result!;
        else
            throw new InvalidOperationException("Cannot get resource. No resource matches the specified key.");
    }

    static nestedDictionariesProperty = DependencyProperty.register(ResourceDictionary, "nestedDictionaries", { valueType: Type.get(Array) });
    get nestedDictionaries(): ResourceDictionary[] { return this.get(ResourceDictionary.nestedDictionariesProperty); };
    set nestedDictionaries(value: ResourceDictionary[]) { this.set(ResourceDictionary.nestedDictionariesProperty, value); }

    static resourcesProperty = DependencyProperty.register(ResourceDictionary, "resources", { valueType: Type.get(Collection) });
    get resources(): Collection<DependencyObject> { return this.get(ResourceDictionary.resourcesProperty); }
    set resources(value: Collection<DependencyObject>) { this.set(ResourceDictionary.resourcesProperty, value); }

    static keyProperty = DependencyProperty.register(ResourceDictionary, "key", { valueType: Type.get(String) });
    get key(): string { return this.get(ResourceDictionary.keyProperty); }
    set key(value: string) { this.set(ResourceDictionary.keyProperty, value); }

    static resource_keyProperty = DependencyProperty.register(ResourceDictionary, "key", { valueType: Type.get(String) });
}
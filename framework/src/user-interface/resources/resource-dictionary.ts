import { DependencyProperty, DependencyObject, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { OutputArgument } from "../../standard/reflection/types.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import * as Storage from "./storage.js";
import { Type } from "../../standard/reflection/type.js";
import { Collection } from "../../standard/collections/index.js";

export class ResourceDictionary extends DependencyObject {
    static get(key: string): ResourceDictionary {
        const storageTryGetOutput: OutputArgument<ResourceDictionary> = {};
        if (Storage.tryGet(key, storageTryGetOutput))
            return <ResourceDictionary>storageTryGetOutput.value;
        else
            throw new InvalidOperationException("Cannot get resource dictionary. No resource dictionary matches the specified key.");
    }

    constructor() {
        super();

        this.resources = new Collection();
        this.nestedDictionaries = new Collection();

        Storage.store(this);
    }

    * getAllResources(): IterableIterator<DependencyObject> {
        yield * this.resources;
        
        for (let nestedDictionary of this.nestedDictionaries)
            yield * nestedDictionary.resources;
    }

    tryGetResource(key: string, output: OutputArgument<any>): boolean {
        for (let resource of this.getAllResources()) {
            const resourceKey = resource.get(ResourceDictionary.resource_keyProperty);
            if (resourceKey == key) {
                output.value = resource;
                return true;
            }
        }
        return false;
    }

    getResource(key: string): any {
        const tryGetResourceOutput: OutputArgument<any> = {};
        if (this.tryGetResource(key, tryGetResourceOutput))
            return tryGetResourceOutput.value!;
        else
            throw new InvalidOperationException("Cannot get resource. No resource matches the specified key.");
    }

    static nestedDictionariesProperty = DependencyProperty.registerAttached(Type.get(ResourceDictionary), "nestedDictionaries", new PropertyMetadata(Type.get(Array)));
    get nestedDictionaries(): ResourceDictionary[] { return this.get(ResourceDictionary.nestedDictionariesProperty); };
    set nestedDictionaries(value: ResourceDictionary[]) { this.set(ResourceDictionary.nestedDictionariesProperty, value); }

    static resourcesProperty = DependencyProperty.registerAttached(Type.get(ResourceDictionary), "resources", new PropertyMetadata(Type.get(Collection)));
    get resources(): Collection<DependencyObject> { return this.get(ResourceDictionary.resourcesProperty); }
    set resources(value: Collection<DependencyObject>) { this.set(ResourceDictionary.resourcesProperty, value); }

    static keyProperty = DependencyProperty.registerAttached(Type.get(ResourceDictionary), "key", new PropertyMetadata(Type.get(String)));
    get key(): string { return this.get(ResourceDictionary.keyProperty); }
    set key(value: string) { this.set(ResourceDictionary.keyProperty, value); }

    static resource_keyProperty = DependencyProperty.register(Type.get(ResourceDictionary), "key", new PropertyMetadata(Type.get(String)));
}
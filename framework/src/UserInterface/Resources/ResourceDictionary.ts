import { DependencyProperty, DependencyObject, PropertyChangeEventArgs } from "../DependencyObjects/index";

export class ResourceDictionary extends DependencyObject {
    constructor() {
        super();

        this.PropertyChangeEvent.attach(this.__onPropertyChange, this);
    }

    static nestedDictionariesProperty = DependencyProperty.register(ResourceDictionary, "nestedDictionaries", { valueType: Array });
    get nestedDictionaries(): ResourceDictionary[] { return this.get(ResourceDictionary.nestedDictionariesProperty); };
    set nestedDictionaries(value: ResourceDictionary[]) { this.set(ResourceDictionary.nestedDictionariesProperty, value); }

    static resourcesProperty = DependencyProperty.register(ResourceDictionary, "resources", { valueType: Array });
    get resources(): any[] { return this.get(ResourceDictionary.resourcesProperty); }
    set resources(value: any[]) { this.set(ResourceDictionary.resourcesProperty, value); }

    static keyProperty = DependencyProperty.register(ResourceDictionary, "key", { valueType: String });
    get key(): string { return this.get(ResourceDictionary.keyProperty); }
    set key(value: string) { this.set(ResourceDictionary.keyProperty, value); }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) {

    }
}
import { DataContext } from "../../DataContexts/index";
import { DependencyProperty } from "../DependencyProperty";
import { Collection } from "../../../Standard/Collections/index";
import { assertEachParams, assertParams } from "../../../Validation/index";
import { StorageSetter } from "./StorageSetter";
import { PropertyMetadata } from "../PropertyMetadata";
import { MetadataOverride } from "./MetadataOverride";

const $setters = Symbol();
const $metadataOverrides = Symbol();

export class DependencyDataContext extends DataContext {
    constructor(target: typeof Object, ...children: DependencyDataContext[]) {
        assertEachParams({ children }, Array, DependencyDataContext);

        super(target, ...children);

        this[$setters] = new Collection();
        this[$metadataOverrides] = new Collection();
    }

    setValue(source: object, target: object, property: DependencyProperty, value: any) {
        assertParams({ source }, Object);

        setValueOnContext.call(this, source, target, property, value);
    }

    unsetValue(source: object, target: object, property: DependencyProperty) {
        assertParams({ source }, Object);

        unsetValueOnContext.call(this, source, target, property);
    }

    overrideMetadata(property: DependencyProperty, metadata: PropertyMetadata) {
        assertParams({ property }, DependencyProperty);
        assertParams({ metadata }, PropertyMetadata);

        overrideMetadataOnContext.call(this, property, metadata);
    }

    computeMetadata(property: DependencyProperty): PropertyMetadata | null {
        assertParams({ property }, DependencyProperty);

        return computeMetadataOnContext.call(this, property);
    }

    computeValue(property: DependencyProperty, target: object): any {
        assertParams({ property }, DependencyProperty);

        return computeValueOnContext.call(this, property, target);
    }

    get setters(): Collection<StorageSetter> { return this[$setters]; }
    private [$setters]: Collection<StorageSetter>;

    get metadataOverrides(): Collection<MetadataOverride> { return this[$metadataOverrides]; }
    private [$metadataOverrides]: Collection<MetadataOverride>;
}

function setValueOnContext(this: DependencyDataContext, source: object, target: object, property: DependencyProperty, value: any) {
    let setter = this.setters.find(s => s.source === source && s.property === property);
    if (setter === undefined) {
        setter = StorageSetter.create(source, target, property, value);
        this.setters.add(setter);
    }
    else
        setter.value = value;
}

function unsetValueOnContext(this: DependencyDataContext, source: object, target: object, property: DependencyProperty) {
    const setter = this.setters.find(s => s.source === source && s.target === target && s.property === property);
    if (setter !== undefined)
        this.setters.remove(setter);
}

function computeValueOnContext(this: DependencyDataContext, property: DependencyProperty, target: object): any {
    for (let context of this.getTree())
        if (context instanceof DependencyDataContext) {
            const setter = context.setters.reverse().find(s => s.property === property && s.target === target && s.value !== DependencyProperty.unsetValue);
            if (setter)
                return setter.value;
        }

    return DependencyProperty.unsetValue;
}

function overrideMetadataOnContext(this: DependencyDataContext, property: DependencyProperty, metadata: PropertyMetadata) {
    let metadataOverride = this.metadataOverrides.find(mo => mo.property === property)
    if (metadataOverride)
        metadataOverride.metadata = metadata
    else {
        metadataOverride = MetadataOverride.create(property, metadata);
        this.metadataOverrides.add(metadataOverride);
    }
}

function computeMetadataOnContext(this: DependencyDataContext, property: DependencyProperty): PropertyMetadata | null {
    for (let context of this.getTree()) {
        if (context instanceof DependencyDataContext) {
            const metadataOverride = this.metadataOverrides.find(o => o.property === property);
            if (metadataOverride)
                return metadataOverride.metadata;
        }
    }
    return null;
}
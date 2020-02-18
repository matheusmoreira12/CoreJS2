import { DataContext } from "../../DataContexts/index";
import { DependencyObject } from "../DependencyObject";
import { DependencyProperty } from "../DependencyProperty";
import { Collection } from "../../../Standard/Collections/index";
import { assertEachParams, assert, assertParams } from "../../../Validation/index";
import { StorageSetter, createStorageSetter } from "./StorageSetter";
import { PropertyMetadata } from "../PropertyMetadata";

type Target = typeof DependencyObject | DependencyObject;

const $setters = Symbol();
const $metadata = Symbol();

export class DependencyDataContext extends DataContext {
    constructor(target: typeof DependencyObject | DependencyObject, ...children: DependencyDataContext[]) {
        assertEachParams({ children }, Array, DependencyDataContext);

        super(target, ...children);

        this[$setters] = new Collection();
        this[$metadata] = new Collection();
    }

    branchOut(target: typeof DependencyObject | DependencyObject): DependencyDataContext {
        return branchOut.call(this, target);
    }

    setValue(source: object, property: DependencyProperty, value: any) {
        assertParams({ source }, Object);

        setValueOnContext.call(this, source, property, value);
    }

    unsetValue(source: object, property: DependencyProperty) {
        assertParams({ source }, Object);

        unsetValueOnContext.call(this, source, property);
    }

    overrideMetadata(property: DependencyProperty, metadata: PropertyMetadata) {
        assertParams({ property }, DependencyProperty);
        assertParams({ metadata }, PropertyMetadata);

        overrideMetadataOnContext.call(this, property, metadata);
    }

    computeMetadata(property: DependencyProperty): PropertyMetadata | null {
        assert({ property }, DependencyProperty);

        return computeMetadataOnContext.call(this, property);
    }

    computeValue(property: DependencyProperty): any {
        assert({ property }, DependencyProperty);

        return computeValueOnContext.call(this, property);
    }

    get setters(): Collection<StorageSetter> { return this[$setters]; }
    private [$setters]: Collection<StorageSetter>;

    get metadata(): Collection<PropertyMetadata> { return this[$metadata]; }
    private [$metadata]: Collection<PropertyMetadata>;
}

function branchOut(this: DependencyDataContext, target: Target): DependencyDataContext {
    const branchContext = new DependencyDataContext(target);
    this.children.add(branchContext);
    return branchContext;
}

function setValueOnContext(this: DependencyDataContext, source: object, property: DependencyProperty, value: any) {
    let setter = this.setters.find(s => s.source === source && s.property === property);
    if (setter === undefined) {
        setter = createStorageSetter(source, property, value);
        this.setters.add(setter);
    }
    else
        setter.value = value;
}

function unsetValueOnContext(this: DependencyDataContext, source: object, property: DependencyProperty) {
    const setter = this.setters.find(s => s.source === source && s.property === property);
    if (setter !== undefined)
        this.setters.remove(setter);
}

function computeValueOnContext(this: DependencyDataContext, property: DependencyProperty) {
    const metadata = this.computeMetadata(property);

    for (let context of this.getTree())
        if (context instanceof DependencyDataContext) {
            const reversedSetters = context.setters.reverse();
            for (let setter of reversedSetters)
                if (setter.property === property && setter.value !== DependencyProperty.unsetValue)
                    return setter.value;
        }

    return DependencyProperty.unsetValue;
}

function overrideMetadataOnContext(this: DependencyDataContext, property: DependencyProperty, metadata: PropertyMetadata) {
}

function computeMetadataOnContext(this: DataContext, property: DependencyProperty): PropertyMetadata | null {
    for (let context of this.getTree()) {
        if (context instanceof DependencyDataContext) {
            const metadata = context.metadata;
            for (let metadataEntry of metadata)
                if (metadataEntry.property === property)
                    return metadataEntry;
        }
    }
    return null;
}
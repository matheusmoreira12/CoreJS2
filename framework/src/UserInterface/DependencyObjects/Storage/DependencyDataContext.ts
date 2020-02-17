import { DataContext } from "../../DataContexts/index";
import { DependencyObject } from "../DependencyObject";
import { DependencyProperty } from "../DependencyProperty";
import { Collection } from "../../../Standard/Collections/index";
import { assertEachParams, assert } from "../../../Validation/index";
import { StorageSetter, createStorageSetter } from "./StorageSetter";
import { PropertyMetadata } from "../PropertyMetadata";

const $setters = Symbol();
const $metadata = Symbol();

export class DependencyDataContext extends DataContext {
    constructor(target: typeof DependencyObject | DependencyObject, ...children: DependencyDataContext[]) {
        assertEachParams({ children }, Array, DependencyDataContext);

        super(target, ...children);

        this[$setters] = new Collection();
    }

    branchOut(target: typeof DependencyObject | DependencyObject): DependencyDataContext {
        const branchContext = new DependencyDataContext(target);
        this.children.add(branchContext);
        return branchContext;
    }

    setValue(source: object, property: DependencyProperty, value: any) {
        let setter = this.setters.find(s => s.source === source && s.property === property);
        if (setter === undefined) {
            setter = createStorageSetter(source, property, value);
            this.setters.add(setter);
        }
        else
            setter.value = value;
    }

    unsetValue(source: object, property: DependencyProperty) {
        const setter = this.setters.find(s => s.source === source && s.property === property);
        if (setter !== undefined)
            this.setters.remove(setter);
    }

    computeMetadata(property: DependencyProperty): PropertyMetadata | null {
        assert({ property }, DependencyProperty);

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

    computeValue(property: DependencyProperty): any {
        assert({ property }, DependencyProperty);

        for (let context of this.getTree())
            if (context instanceof DependencyDataContext) {
                const reversedSetters = context.setters.reverse();
                for (let setter of reversedSetters)
                    if (setter.property === property && setter.value !== DependencyProperty.unsetValue)
                        return setter.value;
            }

        return DependencyProperty.unsetValue;
    }

    get setters(): Collection<StorageSetter> { return this[$setters]; }
    private [$setters]: Collection<StorageSetter>;

    get metadata(): Collection<PropertyMetadata> { return this[$metadata]; }
    private [$metadata]: Collection<PropertyMetadata>;
}
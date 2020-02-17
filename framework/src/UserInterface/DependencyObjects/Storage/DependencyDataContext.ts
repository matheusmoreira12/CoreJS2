import { DataContext } from "../../DataContexts/index";
import { DependencyObject } from "../DependencyObject";
import { DependencyProperty } from "../DependencyProperty";
import { Collection } from "../../../Standard/Collections/index";
import { assertEachParams } from "../../../Validation/index";
import { StorageSetter, createStorageSetter } from "./StorageSetter";

const $setters = Symbol();

export class DependencyDataContext extends DataContext {
    constructor(target: typeof DependencyObject | DependencyObject, ...children: DependencyDataContext[]) {
        assertEachParams({ children }, Array, DependencyDataContext)

        super(target, ...children);
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

    computeValue(property: DependencyProperty): any {
        const contextRecursion = this.getTree();
        for (let context of contextRecursion)
            if (context instanceof DependencyDataContext) {
                const reversedSetters = context.setters.reverse();
                for (let setter of reversedSetters)
                    if (setter.property === property && setter.value !== DependencyProperty.unsetValue)
                        return setter.value;
            }
    }

    get setters(): Collection<StorageSetter> { return this[$setters]; }
    private [$setters]: Collection<StorageSetter>;
}
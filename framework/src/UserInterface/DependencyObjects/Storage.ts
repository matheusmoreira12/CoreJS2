import { DependencyProperty } from "./DependencyProperty";
import { InvalidOperationException, Destructible } from "../../Standard/index";
import { DependencyObject } from "./DependencyObject";
import { DataContext } from "../DataContexts/index";
import { Collection } from "../../Standard/Collections/index";

class InternalSetter extends Destructible {
    constructor(context: DataContext, property: DependencyProperty, value: any) {
        super();

        this.context = context;
        this.property = property;
        this.value = value;

        internalSetters.add(this);
    }

    context: DataContext;
    property: DependencyProperty;
    value: any;

    protected destructor() {
        internalSetters.remove(this);
    }
}

const internalSetters: Collection<InternalSetter> = new Collection();

function findSettersByContextAndProperty(context: DataContext, property: DependencyProperty): InternalSetter[] {
    return internalSetters.filter(s => s.context === context && s.property === property).reverse();
}

function findAllSettersByContextAndProperty(context: DataContext, property: DependencyProperty): InternalSetter[] {
    const setters: InternalSetter[] = [];
    while (context) {
        setters.push(...findSettersByContextAndProperty(context, property));
        context = <DataContext>context.parent;
    }
    return setters;
}

export function setValue(target: DependencyObject, property: DependencyProperty, value: any) {
    const context = DataContext.find(target);
    if (!context)
        throw new InvalidOperationException("Cannot set value. No data context for the specified target has been found.");

    const setter = new InternalSetter(context, property, value);
    internalSetters.add(setter);
}

export function unsetValue(target: DependencyObject, property: DependencyProperty) {
    const context = DataContext.findNearest(target);
    if (context) {
        const setters = findSettersByContextAndProperty(context, property);
        for (let setter of setters)
            setter.destruct();
    }
}

export function getValue(target: DependencyObject, property: DependencyProperty): any {
    const context = DataContext.findNearest(target);
    if (context) {
        const setters = findAllSettersByContextAndProperty(context, property);
        for (let setter of setters) {
            if (setter.value !== DependencyProperty.unsetValue)
                return setter.value;
        }
        return DependencyProperty.unsetValue;
    }
    else
        throw new InvalidOperationException("Cannot get value. No data context for the specified target has been found.");
}
import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import { DataContext } from "../DataContexts/index";
import { InvalidOperationException } from "../../Standard/index";
import { DataContexts } from "../index";
import { DependencyDataContext } from "./Storage/index";
import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index";
import { Type } from "../../Standard/Types/index";
import { assertParams } from "../../Validation/index";

export const IDependencyObject = new Interface(
    new InterfaceMember("get", InterfaceMemberType.Function),
    new InterfaceMember("set", InterfaceMemberType.Function),
    new InterfaceMember("PropertyChangeEvent", InterfaceMemberType.Property, Type.get(FrameworkEvent)),
);

export interface IDependencyObject {
    get(property: DependencyProperty): any;
    set(property: DependencyProperty, value: any): void;
    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;
}

export const DependencyObject = {

    getPropertyValue(target: IDependencyObject, property: DependencyProperty): any {
        assertParams({ target }, IDependencyObject);
        assertParams({ property }, DependencyProperty);

        const context = DataContexts.Utils.getNearestByConstructor(DataContext.main, target) as DependencyDataContext | null;
        if (context === null)
            throw new InvalidOperationException("Cannot get property value. No dependency data context corresponds to the provided target.");
        else
            return context.computeValue(property, target);
    },

    setPropertyValue(target: IDependencyObject, property: DependencyProperty, value: any) {
        assertParams({ target }, IDependencyObject);
        assertParams({ property }, DependencyProperty);

        const context = DataContexts.Utils.getNearestByConstructor(DataContext.main, target) as DependencyDataContext | null;
        if (context === null)
            throw new InvalidOperationException("Cannot set property value. No dependency data context corresponds to the provided target.");
        else
            context.setValue(target, target, property, value);
    }
}
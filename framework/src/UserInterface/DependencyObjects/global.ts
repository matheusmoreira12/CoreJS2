import { DependencyObject } from "./DependencyObject.js";
import { Blender } from "../../Standard/Blender/index.js";
import { DependencyProperty } from "./DependencyProperty.js";

declare global {
    interface Object extends DependencyObject { }
}

const oldCtor = Object.prototype.constructor;

// Object.prototype.constructor = function constructor(...args: any[]) {
//     oldCtor(...args);

//     Blender.blend(DependencyObject, this);
//     Blender.initialize(DependencyObject, this);
// };

Object.prototype.get = function get(property: DependencyProperty) {
    return Blender.get(DependencyObject, this).get(property);
}

Object.prototype.set = function set(property: DependencyProperty, value: any) {
    return Blender.get(DependencyObject, this).set(property, value);
}

export default null;
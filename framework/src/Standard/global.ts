import { Destructible } from "./Destructible.js";
import { Blender } from "./Blender/index.js";
import { ObjectUtils } from "../CoreBase/Utils/index.js";

declare global {
    interface Object extends Destructible {
    }
}

const oldCtor = Object.prototype.constructor;

Object.prototype.constructor = function Object(value?: any) {
    let result = oldCtor.call(this, value);

    Blender.blend(Destructible, this);
    const destructibleBlend = Blender.initialize(Destructible, this);

    ObjectUtils.copyProperty(destructibleBlend, this, "destruct");
    ObjectUtils.copyProperty(destructibleBlend, this, "isDestructed");
    ObjectUtils.copyProperty(<Destructible>this, destructibleBlend, <keyof Destructible>"destructor");

    return result;
}

export default null;
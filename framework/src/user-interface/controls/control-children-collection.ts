import { ArrayUtils } from "../../core-base/utils/array-utils.js";
import { ObservableCollection } from "../../standard/collections/index.js";
import { Control } from "./index.js";

export class ControlChildrenCollection extends ObservableCollection<Control> {
    override push(...items: Control[]): number {
        const unique = ArrayUtils.excludeMany(ArrayUtils.excludeDuplicates(items), this);
        return super.push(...unique);
    }
}
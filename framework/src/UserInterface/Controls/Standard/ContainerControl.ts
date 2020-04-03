import { Control, ControlManager } from "../index.js";
import { Grid } from "./index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";
import { PropertyChangeEventArgs, DependencyProperty, DependencyObject } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { Blender } from "../../../Standard/Blender/index.js";

export abstract class ContainerControl extends Control {
    __initialization() {
        super.__initialization();

        const PART_layoutGrid = ControlManager.instantiate(Grid);
        this.children.add(PART_layoutGrid);
        this.__PART_layoutGrid = PART_layoutGrid;

        this.__PART_child = null;
    }

    private __updateChild(child: VisualTreeElement) {
        const hasChild = !!this.__PART_child;
        if (hasChild)
            this.__PART_layoutGrid.children.remove(<VisualTreeElement>this.__PART_child);

        if (child !== null)
            this.__PART_layoutGrid.children.add(child);
    }

    private __PART_child!: VisualTreeElement | null;
    protected __PART_layoutGrid!: Grid;

    protected onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        super.onPropertyChange(sender, args);

        if (args.property === ContainerControl.childProperty)
            this.__updateChild(args.newValue);
    }

    static childProperty = DependencyProperty.register(ContainerControl, "child", { valueType: Type.of(VisualTreeElement) });
    get child(): VisualTreeElement { return Blender.execute(this, DependencyObject, o => o.get(ContainerControl.childProperty)); }
    set child(value: VisualTreeElement) { Blender.execute(this, DependencyObject, o => o.set(ContainerControl.childProperty, value)); }
}
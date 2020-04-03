import { ContainerControl } from "./index.js";
import { ControlManager, Control } from "../index.js";
import { Rectangle, Shape } from "../Shapes/index.js";
import { Blender } from "../../../Standard/Blender/index.js";
import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { PropertyBinding, BindingDirection } from "../../Bindings/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { Length } from "../../Coordinates/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";

export class Border extends ContainerControl {
    __initialization() {
        super.__initialization();

        const PART_background = ControlManager.instantiate(Rectangle);
        this.__PART_layoutGrid.children.add(PART_background);
        this.__PART_background = PART_background;

        //Bind properties from Border to the rectangle part
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Control.backgroundProperty, <DependencyObject>Blender.get(DependencyObject, this.__PART_background), Shape.fillProperty, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Border.borderProperty, <DependencyObject>Blender.get(DependencyObject, this.__PART_background), Shape.strokeProperty, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Border.borderThicknessProperty, <DependencyObject>Blender.get(DependencyObject, this.__PART_background), Shape.strokeThicknessProperty, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Border.borderRadiusXProperty, <DependencyObject>Blender.get(DependencyObject, this.__PART_background), Rectangle.rxProperty, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Border.borderRadiusYProperty, <DependencyObject>Blender.get(DependencyObject, this.__PART_background), Rectangle.ryProperty, { direction: BindingDirection.ToTarget }));
    }

    static borderProperty = DependencyProperty.register(Border, "border", { valueType: Type.get(String), defaultValue: "transparent" });
    get border(): string { return Blender.execute(this, DependencyObject, o => o.get(Border.borderProperty)); }
    set border(value: string) { Blender.execute(this, DependencyObject, o => o.set(Border.borderProperty, value)); }

    static borderThicknessProperty = DependencyProperty.register(Border, "borderThickness", { valueType: Type.get(Length), defaultValue: Length.zero });
    get borderThickness(): Length { return Blender.execute(this, DependencyObject, o => o.get(Border.borderThicknessProperty)); }
    set borderThickness(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Border.borderThicknessProperty, value)); }

    static borderRadiusXProperty = DependencyProperty.register(Border, "borderRadiusX", { defaultValue: Length.zero, valueType: Type.of(Length) });
    get borderRadiusX(): Length { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusXProperty)); }
    set borderRadiusX(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusXProperty, value)); }

    static borderRadiusYProperty = DependencyProperty.register(Border, "borderRadiusY", { defaultValue: Length.zero, valueType: Type.of(Length) });
    get borderRadiusY(): Length { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusYProperty)); }
    set borderRadiusY(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusYProperty, value)); }

    private __PART_background: VisualTreeElement | undefined;
}
ControlManager.register(Border, "core:Border", "core");
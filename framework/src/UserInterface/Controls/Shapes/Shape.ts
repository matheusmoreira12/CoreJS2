import { Blender } from "../../../Standard/Blender/index";
import { Type } from "../../../Standard/Types/Type";
import { DependencyProperty, DependencyObject } from "../../DependencyObjects/index";
import { VisualTreeElement } from "../../VisualTrees/index";
import { Control } from "../index";
import { GraphicValue } from "../../GraphicValues/index";

const SVG_NS = "http://www.w3.org/2000/svg";

export abstract class Shape extends Control {
    initialization() {
        super.initialization();

        const PART_canvas = VisualTreeElement.create("svg", SVG_NS);
        PART_canvas.attributes.setMany({
            width: "100%",
            height: "100%",
            style: "flex: 1; align-self: center"
        });
        this.children.add(PART_canvas);
        this.__PART_canvas = PART_canvas;
    }

    static fillProperty = DependencyProperty.register(<any>Shape, "fill", { valueType: Type.get(String), defaultValue: "transparent" });
    get fill(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.fillProperty)); }
    set fill(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.fillProperty, value)); }

    static strokeProperty = DependencyProperty.register(<any>Shape, "stroke", { valueType: Type.get(String), defaultValue: "transparent" });
    get stroke(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.strokeProperty)); }
    set stroke(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.strokeProperty, value)); }

    static strokeThicknessProperty = DependencyProperty.register(<any>Shape, "strokeThickness", { valueType: Type.get(GraphicValue), defaultValue: GraphicValue.Zero });
    get strokeThickness(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.strokeThicknessProperty)); }
    set strokeThickness(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.strokeThicknessProperty, value)); }

    protected __PART_canvas!: VisualTreeElement;
}
import { Blender } from "../../../Standard/Blender/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { DependencyProperty, DependencyObject } from "../../DependencyObjects/index.js";
import { MarkupElement } from "../../Markup/index.js";
import { Control } from "../index.js";
import { Length } from "../../Coordinates/index.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export abstract class Shape extends Control {
    __initialization() {
        super.__initialization();

        const PART_canvas = MarkupElement.fromDomElement(document.createElementNS(SVG_NS, "rect"));
        PART_canvas.attributes.set("style", `
        flex: 1;
        max-width: 100%;
        max-height: 100%;
        `);
        this.children.add(PART_canvas);
        this.__PART_canvas = PART_canvas;
    }

    static fillProperty = DependencyProperty.register(Shape, "fill", { valueType: Type.get(String), defaultValue: "transparent" });
    get fill(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.fillProperty)); }
    set fill(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.fillProperty, value)); }

    static strokeProperty = DependencyProperty.register(Shape, "stroke", { valueType: Type.get(String), defaultValue: "transparent" });
    get stroke(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.strokeProperty)); }
    set stroke(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.strokeProperty, value)); }

    static strokeThicknessProperty = DependencyProperty.register(Shape, "strokeThickness", { valueType: Type.get(Length), defaultValue: Length.zero });
    get strokeThickness(): string { return Blender.execute(this, DependencyObject, o => o.get(Shape.strokeThicknessProperty)); }
    set strokeThickness(value: string) { Blender.execute(this, DependencyObject, o => o.set(Shape.strokeThicknessProperty, value)); }

    protected __PART_canvas!: VisualTreeElement;
}
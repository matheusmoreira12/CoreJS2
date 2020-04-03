import { Blender } from "../../../Standard/Blender/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index.js";
import { GraphicValueSVGAttributeValueConverter } from "../../Coordinates/ValueConverters/index.js";
import { Length } from "../../Coordinates/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";
import { Shape } from "./index.js";
import { ControlManager } from "../index.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Rectangle extends Shape {
    __initialization() {
        super.__initialization();

        //Add an SVG Rect to the visual tree
        const PART_rect = VisualTreeElement.create("rect", SVG_NS);
        PART_rect.attributes.setMany({
            x: "0",
            y: "0",
            width: "100%",
            height: "100%"
        });
        this.__PART_canvas.children.add(PART_rect);
        this.__PART_rect = PART_rect;

        //Bind properties from Shape to SVG Rect attributes
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Shape.fillProperty, <Element>this.__PART_rect.domElement, "fill", null, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Shape.strokeProperty, <Element>this.__PART_rect.domElement, "stroke", null, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Shape.strokeThicknessProperty, <Element>this.__PART_rect.domElement, "strokeThickness", null, { direction: BindingDirection.ToTarget, valueConverter: new GraphicValueSVGAttributeValueConverter() }));

        //Bind properties from Rectangle to SVG Rect attributes
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Rectangle.rxProperty, <Element>this.__PART_rect.domElement, "rx", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Rectangle.ryProperty, <Element>this.__PART_rect.domElement, "ry", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget }));
    }

    protected __PART_rect!: VisualTreeElement;

    static rxProperty = DependencyProperty.register(Rectangle, "rx", { defaultValue: Length.zero, valueType: Type.of(Length) });
    get rx(): Length { return Blender.execute(this, DependencyObject, o => o.get(Rectangle.rxProperty)); }
    set rx(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Rectangle.rxProperty, value)); }

    static ryProperty = DependencyProperty.register(Rectangle, "ry", { defaultValue: Length.zero, valueType: Type.of(Length) });
    get ry(): Length { return Blender.execute(this, DependencyObject, o => o.get(Rectangle.ryProperty)); }
    set ry(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Rectangle.ryProperty, value)); }
}
ControlManager.register(Rectangle, "core:Rectangle", "core");
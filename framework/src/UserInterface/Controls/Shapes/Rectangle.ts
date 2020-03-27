import { Blender } from "../../../Standard/Blender/index";
import { Type } from "../../../Standard/Types/index";
import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index";
import { GraphicValueSVGAttributeValueConverter } from "../../GraphicValues/ValueConverters/index";
import { UnitValue } from "../../GraphicValues/index";
import { VisualTreeElement } from "../../VisualTrees/index";
import { Shape } from "./index";
import { ControlManager } from "../index";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Rectangle extends Shape {
    initialization() {
        super.initialization();

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

    static rxProperty = DependencyProperty.register(<any>Rectangle, "rx", { defaultValue: UnitValue.zero, valueType: Type.of(UnitValue) });
    get rx(): UnitValue { return Blender.execute(this, DependencyObject, o => o.get(Rectangle.rxProperty)); }
    set rx(value: UnitValue) { Blender.execute(this, DependencyObject, o => o.set(Rectangle.rxProperty, value)); }

    static ryProperty = DependencyProperty.register(<any>Rectangle, "ry", { defaultValue: UnitValue.zero, valueType: Type.of(UnitValue) });
    get ry(): UnitValue { return Blender.execute(this, DependencyObject, o => o.get(Rectangle.ryProperty)); }
    set ry(value: UnitValue) { Blender.execute(this, DependencyObject, o => o.set(Rectangle.ryProperty, value)); }
}
ControlManager.register(<any>Rectangle, "core:Rectangle", "core");
import { Blender } from "../../../Standard/Blender/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { DependencyObject, PropertyChangeEventArgs, DependencyProperty } from "../../DependencyObjects/index.js";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index.js";
import { FontSVGFontFamilyAttributeConverter, FontSVGFontSizeAttributeConverter, FontSVGFontWeightAttributeConverter, FontSVGFontStyleAttributeConverter, FontSVGTextDecorationAttributeConverter } from "../../Fonts/ValueConverters/index.js";
import { Font } from "../../Fonts/index.js";
import { DOMControl } from "../index.js";
import { Shape } from "./index.js";
import { Length } from "../../Coordinates/index.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Text extends Shape {
    __initialization() {
        super.__initialization();

        const PART_text = new DOMControl("text", SVG_NS);
        this.__PART_text = PART_text;
        this.__PART_canvas.children.add(PART_text);

        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fillProperty, <Element>PART_text.domElement, "fill", null, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-family", null, { valueConverter: new FontSVGFontFamilyAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-size", null, { valueConverter: new FontSVGFontSizeAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-weight", null, { valueConverter: new FontSVGFontWeightAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-style", null, { valueConverter: new FontSVGFontStyleAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "text-decoration", null, { valueConverter: new FontSVGTextDecorationAttributeConverter(), direction: BindingDirection.ToTarget }));
    }

    protected __updateVisual() {
        (<SVGTextElement>this.__PART_text.domElement).textContent = this.text;
        const bbox = (<SVGTextElement>this.__PART_text.domElement).getBBox();
        this.__PART_canvas.attributes.setMany({
            "viewBox": `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
        });
        this.textWidth = Length.pixels(bbox.width);
        this.textHeight = Length.pixels(bbox.height);
    }

    //DependencyObject
    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        super.__onPropertyChange(sender, args);

        if (args.property === Text.fontProperty || args.property === Text.textProperty)
            this.__updateVisual();
    }

    protected __PART_text!: DOMControl;

    static fontProperty = DependencyProperty.register(Text, "font", { valueType: Type.get(Font), defaultValue: Font.default });
    get font(): Font { return Blender.execute(this, DependencyObject, o => o.get(Text.fontProperty)); }
    set font(value: Font) { Blender.execute(this, DependencyObject, o => o.set(Text.fontProperty, value)); }

    static textProperty = DependencyProperty.register(Text, "text", { valueType: Type.get(String), defaultValue: "" });
    get text(): string { return Blender.execute(this, DependencyObject, o => o.get(Text.textProperty)); }
    set text(value: string) { Blender.execute(this, DependencyObject, o => o.set(Text.textProperty, value)); }

    static textWidthProperty = DependencyProperty.register(Text, "textWidth", { valueType: Type.get(Length) });
    get textWidth(): Length { return this.get(Text.textWidthProperty); }
    set textWidth(value: Length) { this.set(Text.textWidthProperty, value); }

    static textHeightProperty = DependencyProperty.register(Text, "textHeight", { valueType: Type.get(Length) });
    get textHeight(): Length { return this.get(Text.textHeightProperty); }
    set textHeight(value: Length) { this.set(Text.textHeightProperty, value); }
}
import { Blender } from "../../../Standard/Blender/index";
import { Type } from "../../../Standard/Types/index";
import { DependencyObject, PropertyChangeEventArgs, DependencyProperty } from "../../DependencyObjects/index";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index";
import { FontSVGFontFamilyAttributeConverter, FontSVGFontSizeAttributeConverter, FontSVGFontWeightAttributeConverter, FontSVGFontStyleAttributeConverter, FontSVGTextDecorationAttributeConverter } from "../../Fonts/ValueConverters/index";
import { Font } from "../../Fonts/index";
import { VisualTreeElement } from "../../VisualTrees/index";
import { ControlManager } from "../index";
import { Shape } from "./index";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Text extends Shape {
    initialization() {
        super.initialization();

        const PART_text = VisualTreeElement.create("text", SVG_NS);
        this.__PART_text = PART_text;
        this.__PART_canvas.children.add(PART_text);

        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fillProperty, <Element>PART_text.domElement, "fill", null, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-family", null, { valueConverter: new FontSVGFontFamilyAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-size", null, { valueConverter: new FontSVGFontSizeAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-weight", null, { valueConverter: new FontSVGFontWeightAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "font-style", null, { valueConverter: new FontSVGFontStyleAttributeConverter(), direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Text.fontProperty, <Element>PART_text.domElement, "text-decoration", null, { valueConverter: new FontSVGTextDecorationAttributeConverter(), direction: BindingDirection.ToTarget }));

        this.invalidateAll();
    }

    protected __updateVisual() {
        super.__updateVisual();

        (<SVGTextElement>this.__PART_text.domElement).textContent = this.text;
        const bbox = (<SVGTextElement>this.__PART_text.domElement).getBBox();
        this.__PART_canvas.attributes.setMany({
            "viewBox": `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
        }, null);
    }

    protected __computeSize(): { width: number, height: number } {
        super.__computeSize();

        const bbox = (<SVGTextElement>this.__PART_text.domElement).getBBox();
        return { width: bbox.width, height: bbox.height };
    }

    //DependencyObject
    protected onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        super.onPropertyChange(sender, args);

        if (args.property === Text.fontProperty || args.property === Text.textProperty)
            this.invalidateAll();
    }

    protected __PART_text!: VisualTreeElement;

    static fontProperty = DependencyProperty.register(<any>Text, "font", { valueType: Type.get(Font), defaultValue: Font.default });
    get font(): Font { return Blender.execute(this, DependencyObject, o => o.get(Text.fontProperty)); }
    set font(value: Font) { Blender.execute(this, DependencyObject, o => o.set(Text.fontProperty, value)); }

    static textProperty = DependencyProperty.register(<any>Text, "text", { valueType: Type.get(String), defaultValue: "" });
    get text(): string { return Blender.execute(this, DependencyObject, o => o.get(Text.textProperty)); }
    set text(value: string) { Blender.execute(this, DependencyObject, o => o.set(Text.textProperty, value)); }
}
ControlManager.register(Text, "core:Text", "core");
import { Control, ControlManager } from "../index.js";
import { Grid } from "./index.js";
import { Rectangle, Text, Shape } from "../Shapes/index.js";
import { Blender } from "../../../Standard/Blender/index.js";
import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { PropertyBinding, BindingDirection } from "../../Bindings/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { Font } from "../../Fonts/index.js";
import { ControlStyle } from "../Styling/index.js";
import { LengthCSSPropertyConverter } from "../../Coordinates/ValueConverters/index.js";

export class TextBlock extends Control {
    protected __initialization() {
        super.__initialization();

        const PART_layoutGrid = ControlManager.instantiate(Grid);
        this.children.add(PART_layoutGrid);
        this.__PART_layoutGrid = PART_layoutGrid;

        const PART_background = ControlManager.instantiate(Rectangle);
        this.__PART_layoutGrid.children.add(PART_background);
        this.__PART_background = PART_background;

        const PART_text = ControlManager.instantiate(Text);
        this.__PART_layoutGrid.children.add(PART_text);
        this.__PART_text = PART_text;

        //Bind properties to PART_background
        //Bind "background" to "fill"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, TextBlock.backgroundProperty, Blender.get(DependencyObject, PART_background), Shape.fillProperty, { direction: BindingDirection.ToTarget }));
        //Bind properties to PART_text
        //Bind "foreground" to "fill"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, TextBlock.foregroundProperty, Blender.get(DependencyObject, PART_text), Shape.fillProperty, { direction: BindingDirection.ToTarget }));
        //Bind "font"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, TextBlock.fontProperty, Blender.get(DependencyObject, PART_text), Text.fontProperty, { direction: BindingDirection.ToTarget }));
        //Bind "text"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, TextBlock.textProperty, Blender.get(DependencyObject, PART_text), Text.textProperty, { direction: BindingDirection.ToTarget }));

        this.style.flex = "auto";

        new PropertyBinding(Blender.get(DependencyObject, PART_text), Text.textWidthProperty, Blender.get(DependencyObject, this.style), ControlStyle.widthProperty, { direction: BindingDirection.ToTarget, valueConverter: new LengthCSSPropertyConverter() });

        new PropertyBinding(Blender.get(DependencyObject, PART_text), Text.textHeightProperty, Blender.get(DependencyObject, this.style), ControlStyle.heightProperty, { direction: BindingDirection.ToTarget, valueConverter: new LengthCSSPropertyConverter() });

        this.__updateVisual();
    }

    protected __PART_layoutGrid!: Grid;
    protected __PART_background!: Rectangle;
    protected __PART_text!: Text;

    static fontProperty = DependencyProperty.register(Text, "font", { valueType: Type.get(Font), defaultValue: Font.default });
    get font(): Font { return Blender.execute(this, DependencyObject, o => o.get(TextBlock.fontProperty)); }
    set font(value: Font) { Blender.execute(this, DependencyObject, o => o.set(TextBlock.fontProperty, value)); }

    static textProperty = DependencyProperty.register(Text, "text", { valueType: Type.get(String), defaultValue: "" });
    get text(): string { return Blender.execute(this, DependencyObject, o => o.get(TextBlock.textProperty)); }
    set text(value: string) { Blender.execute(this, DependencyObject, o => o.set(TextBlock.textProperty, value)); }
}
ControlManager.register(TextBlock, "core:TextBlock", "core");
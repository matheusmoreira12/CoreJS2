import { Control, ControlManager } from "../index";
import { Border, Grid, TextBlock } from "./index";
import { Length, LengthUnit } from "../../Coordinates/index";
import { Blender } from "../../../Standard/Blender/index";
import { DependencyObject } from "../../DependencyObjects/index";
import { PropertyBinding, BindingDirection } from "../../Bindings/index";

export class Button extends Control {
    constructor(qualifiedName: string, namespaceURI: string | null) {
        super(qualifiedName, namespaceURI)
    }

    __initialization() {
        super.__initialization();

        const PART_border = ControlManager.instantiate(Border);
        PART_border.borderRadiusX = new Length(4, LengthUnit.Pixels);
        PART_border.borderRadiusY = new Length(4, LengthUnit.Pixels);
        this.children.add(PART_border);
        this.__PART_border = PART_border;

        const PART_layoutGrid = ControlManager.instantiate(Grid);
        PART_border.child = PART_layoutGrid;
        this.__PART_layoutGrid = PART_layoutGrid;

        const PART_text = ControlManager.instantiate(TextBlock);
        PART_layoutGrid.children.add(PART_text);
        this.__PART_text = PART_text;

        //Bind properties to PART_Border
        //Bind "background"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Control.backgroundProperty, <DependencyObject>Blender.get(DependencyObject, PART_border), Control.backgroundProperty, { direction: BindingDirection.ToTarget }));
        //Bind properties to PART_Border
        //Bind "foreground"
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Control.foregroundProperty, <DependencyObject>Blender.get(DependencyObject, PART_text), Control.foregroundProperty, { direction: BindingDirection.ToTarget }));

        this.foreground = "dimgray";
        this.background = "white";
        this.__PART_text.text = "Click here!";
    }

    protected __PART_border!: Border;
    protected __PART_text!: TextBlock;
    protected __PART_layoutGrid!: Grid;
}
ControlManager.register(Button, "core:Button", "core");
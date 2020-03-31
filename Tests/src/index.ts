import * as Core from "../../framework/src/index";
//Dependency Objects
import DependencyProperty = Core.UserInterface.DependencyObjects.DependencyProperty;
//Events
import PropertyChangeEventArgs = Core.UserInterface.DependencyObjects.PropertyChangeEventArgs;
//Types
import Type = Core.Standard.Types.Type;
//Visual Trees
import VisualTreeElement = Core.UserInterface.VisualTrees.VisualTreeElement;
//Bindings
import DependencyObject = Core.UserInterface.DependencyObjects.DependencyObject;
import Blender = Core.Standard.Blender.Blender;
import PropertyBinding = Core.UserInterface.Bindings.PropertyBinding;
import BindingDirection = Core.UserInterface.Bindings.BindingDirection;
//Controls
import Control = Core.UserInterface.Controls.Control;
import ControlManager = Core.UserInterface.Controls.ControlManager;
//Scalars
import UnitValue = Core.UserInterface.GraphicValues.UnitValue;
import GraphicUnit = Core.UserInterface.GraphicValues.Unit;
//Fonts
import Font = Core.UserInterface.Fonts.Font;


import Shape = Core.UserInterface.Controls.Shapes.Shape;
import Rectangle = Core.UserInterface.Controls.Shapes.Rectangle;
import Text = Core.UserInterface.Controls.Shapes.Text;

const HTML_NS = "http://www.w3.org/1999/xhtml";

const controlStyle = `
@namespace core "core";
body {
    display: flex;
}

core|* {
    display: flex;
    flex: 1;
    margin: 0;
}

core|Grid {
    position: relative;
    left: 0;
    right: 0;
}

core|Grid>* {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    whitespace: nowrap;
}
`;

const stylesheetBlob = new Blob([controlStyle], { type: "text/css" });
const stylesheetPath = URL.createObjectURL(stylesheetBlob);

export class Grid extends Control {
    initialization() {
        super.initialization();

        const style = VisualTreeElement.create("link", HTML_NS);
        style.attributes.setMany({
            rel: "stylesheet",
            type: "text/css",
            href: stylesheetPath
        }, null);
        this.children.add(style);
    }
}
ControlManager.register(Grid, "core:Grid", "core");

export abstract class ContainerControl extends Control {
    initialization() {
        super.initialization();

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

export class Border extends ContainerControl {
    initialization() {
        super.initialization();

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

    static borderThicknessProperty = DependencyProperty.register(Border, "borderThickness", { valueType: Type.get(UnitValue), defaultValue: UnitValue.zero });
    get borderThickness(): UnitValue { return Blender.execute(this, DependencyObject, o => o.get(Border.borderThicknessProperty)); }
    set borderThickness(value: UnitValue) { Blender.execute(this, DependencyObject, o => o.set(Border.borderThicknessProperty, value)); }

    static borderRadiusXProperty = DependencyProperty.register(Border, "borderRadiusX", { defaultValue: UnitValue.zero, valueType: Type.of(UnitValue) });
    get borderRadiusX(): UnitValue { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusXProperty)); }
    set borderRadiusX(value: UnitValue) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusXProperty, value)); }

    static borderRadiusYProperty = DependencyProperty.register(Border, "borderRadiusY", { defaultValue: UnitValue.zero, valueType: Type.of(UnitValue) });
    get borderRadiusY(): UnitValue { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusYProperty)); }
    set borderRadiusY(value: UnitValue) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusYProperty, value)); }

    private __PART_background: VisualTreeElement | undefined;
}
ControlManager.register(Border, "core:Border", "core");

export class TextBlock extends Control {
    protected initialization() {
        super.initialization();

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

export class Button extends Control {
    constructor(qualifiedName: string, namespaceURI: string | null) {
        super(qualifiedName, namespaceURI)
    }

    initialization() {
        super.initialization();

        const PART_border = <Border>ControlManager.instantiate(Border);
        PART_border.borderRadiusX = new UnitValue(4, GraphicUnit.Pixels);
        PART_border.borderRadiusY = new UnitValue(4, GraphicUnit.Pixels);
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
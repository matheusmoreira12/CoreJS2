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
import GraphicValue = Core.UserInterface.GraphicValues.GraphicValue;
import GraphicUnit = Core.UserInterface.GraphicValues.GraphicUnit;


import Shape  = Core.UserInterface.Controls.Shapes.Shape;
import Rectangle  = Core.UserInterface.Controls.Shapes.Rectangle;
import Text  = Core.UserInterface.Controls.Shapes.Text;

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
ControlManager.register(<any>Grid, "core:Grid", "core");

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

    static childProperty = DependencyProperty.register(<any>ContainerControl, "child", { valueType: Type.of(VisualTreeElement) });
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

    static borderProperty = DependencyProperty.register(<any>Border, "border", { valueType: Type.get(String), defaultValue: "transparent" });
    get border(): string { return Blender.execute(this, DependencyObject, o => o.get(Border.borderProperty)); }
    set border(value: string) { Blender.execute(this, DependencyObject, o => o.set(Border.borderProperty, value)); }

    static borderThicknessProperty = DependencyProperty.register(<any>Border, "borderThickness", { valueType: Type.get(GraphicValue), defaultValue: GraphicValue.Zero });
    get borderThickness(): string { return Blender.execute(this, DependencyObject, o => o.get(Border.borderThicknessProperty)); }
    set borderThickness(value: string) { Blender.execute(this, DependencyObject, o => o.set(Border.borderThicknessProperty, value)); }

    static borderRadiusXProperty = DependencyProperty.register(<any>Border, "borderRadiusX", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get borderRadiusX(): GraphicValue { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusXProperty)); }
    set borderRadiusX(value: GraphicValue) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusXProperty, value)); }

    static borderRadiusYProperty = DependencyProperty.register(<any>Border, "borderRadiusY", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get borderRadiusY(): GraphicValue { return Blender.execute(this, DependencyObject, o => o.get(Border.borderRadiusYProperty)); }
    set borderRadiusY(value: GraphicValue) { Blender.execute(this, DependencyObject, o => o.set(Border.borderRadiusYProperty, value)); }

    private __PART_background: VisualTreeElement | undefined;
}
ControlManager.register(<any>Border, "core:Border", "core");

export class Button extends Control {
    constructor(qualifiedName: string, namespaceURI: string | null) {
        super(qualifiedName, namespaceURI)
    }

    initialization() {
        super.initialization();

        const PART_border = <Border>ControlManager.instantiate(Border);
        PART_border.borderRadiusX = new GraphicValue(4, GraphicUnit.Pixels);
        PART_border.borderRadiusY = new GraphicValue(4, GraphicUnit.Pixels);
        this.children.add(PART_border);
        this.__PART_border = PART_border;

        const PART_layoutGrid = ControlManager.instantiate(Grid);
        PART_border.child = PART_layoutGrid;
        this.__PART_layoutGrid = PART_layoutGrid;

        const PART_text = ControlManager.instantiate(Text);
        PART_layoutGrid.children.add(PART_text);
        this.__PART_text = PART_text;

        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Control.backgroundProperty, <DependencyObject>Blender.get(DependencyObject, PART_border), Control.backgroundProperty, { direction: BindingDirection.ToTarget }));
        Blender.execute(this, DependencyObject, o => new PropertyBinding(o, Control.foregroundProperty, <DependencyObject>Blender.get(DependencyObject, PART_text), Shape.fillProperty, { direction: BindingDirection.ToTarget }));

        this.foreground = "dimgray";
        this.background = "white";
        (<Text>this.__PART_text).text = "Click here!";
    }

    protected __PART_border!: Border;
    protected __PART_text!: VisualTreeElement;
    protected __PART_layoutGrid!: VisualTreeElement;
}
ControlManager.register(<any>Button, "core:Button", "core");

/*
import Type = Core.Standard.Types.Type;
import MemberType = Core.Standard.Types.MemberType;
import MemberSelectionType = Core.Standard.Types.MemberSelectionType;
import MemberInfo = Core.Standard.Types.MemberInfo;
import Enumeration = Core.Standard.Enumeration;

export const Consolify = new (function () {
    const TAB_SPACING = 5;

    let text = "";

    let tabulationCount = 0;

    function resetTabulation() {
        tabulationCount = 0;
    }

    this.tab = function (count = 1) {
        const column = getColumn();
        const nextTab = Math.trunc((column + TAB_SPACING * count) / TAB_SPACING);

        tabulationCount = nextTab;
    }

    let indentationCount = 0;

    function resetIndentation() {
        indentationCount = 0;
    }

    this.indent = function (count = 1) {
        indentationCount += count;
    }

    this.indentBk = function (count = 1) {
        indentationCount -= count;
    }

    function insertLineBreak() {
        text += "\n";
    }

    this.brkLn = function () {
        insertLineBreak();
        resetTabulation();
    }

    function getColumn() {
        let i = text.length - 1;
        while (text[i] !== "\n" && c > 0)
            i--;

        return text.length - 1 - i;
    }

    function insertTabulation() {
        const column = getColumn();
        const tabulation = TAB_SPACING * (indentationCount + tabulationCount);

        if (tabulation > column)
            text += " ".repeat(tabulation - column);
    }

    this.clr = function () {
        text = "";
        resetIndentation();
    }

    this.write = function (value) {
        insertTabulation();
        text += value;
    }

    this.writeLn = function (value) {
        this.brkLn();
        this.write(value);
    }

    this.dump = function (element, propertyName) {
        element[propertyName] = text;
    }
});

let itemsCount = 0;

function listMemberInfo(member: MemberInfo) {
    Consolify.indent();

    const memberKey = String(member.key);
    Consolify.writeLn(`Member "${memberKey}":`);

    Consolify.writeLn(`- Type: ${MemberType.getLabel(member.memberType)}`);

    const memberIsProperty = Enumeration.contains(MemberType.Property, member.memberType),
        memberIsField = Enumeration.contains(MemberType.Field, member.memberType);
    if (memberIsProperty || memberIsField) {
        Consolify.writeLn(`- Value type: "${member.type.getName()}"`);
    }

    Consolify.writeLn(`(End of member "${memberKey}")`)

    Consolify.indentBk();

    itemsCount++;
}

function listTypeInfo(type) {
    Consolify.indent();

    Consolify.writeLn(`Type "${type.name}":`);

    let parentTypes = [...type.getParentTypes()];
    Consolify.writeLn(`- ${parentTypes.length} parent type(s):`);

    for (let parentType of parentTypes)
        listTypeInfo(parentType);

    let staticMembers = [...type.getMembers(MemberSelectionType.Static | MemberSelectionType.Function | MemberSelectionType.Property | MemberSelectionType.Field)];
    Consolify.writeLn(`- ${staticMembers.length} static member(s):`);

    for (let staticMember of staticMembers) {
        listMemberInfo(staticMember);
    }

    let members = [...type.getMembers(MemberSelectionType.Any)]
    Consolify.writeLn(`- ${members.length} member(s):`);

    for (let member of members)
        listMemberInfo(member);

    Consolify.writeLn(`(End of type "${type.name}")`)

    Consolify.indentBk();

    itemsCount++;
}

export function doListTypeInfo(method) {
    Consolify.clr();

    itemsCount = 0;

    const startTime = Date.now();

    Consolify.indentBk();

    let classOrInstanceName = typeNameText.value;
    let classOrInstance = eval(classOrInstanceName);

    if (classOrInstance === undefined)
        Consolify.writeLn(`The specified class "${classOrInstanceName}" does not exist or has not been exported to the root context.`);

    let type = null;

    try {
        switch (method) {
            case "of":
                type = Type.of(classOrInstance);
                break;

            case "get":
                type = Type.get(classOrInstance);
                break;
        }
    }
    catch (e) {
        Consolify.writeLn(`Test failed with error:`);

        Consolify.indent();

        Consolify.writeLn(e.toString());

        Consolify.indentBk();
    }

    if (type !== null)
        listTypeInfo(type);

    let secs = (Date.now() - startTime) / 1000,
        speed = Math.round(itemsCount / secs);

    Consolify.writeLn("-".repeat(20));
    Consolify.writeLn(`Total items: ${itemsCount}; total time: ${secs}s; ${speed}item(s)/s.`)

    Consolify.dump(typeDataOutputText, "value");
}

window.Tests = Object.assign({}, window.Tests, { doListTypeInfo });
*/
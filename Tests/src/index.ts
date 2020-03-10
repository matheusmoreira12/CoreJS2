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
import PropertyAttributeBinding = Core.UserInterface.Bindings.PropertyAttributeBinding;
import BindingDirection = Core.UserInterface.Bindings.BindingDirection;
//Controls
import Control = Core.UserInterface.Controls.Control;
import WidgetManager = Core.UserInterface.Controls.WidgetManager;
//Fonts
import Font = Core.UserInterface.Fonts.Font;
//Scalars
import GraphicValue = Core.UserInterface.GraphicValues.GraphicValue;
import GraphicUnit = Core.UserInterface.GraphicValues.GraphicUnit;
//Value Converters
import FontSVGFontFamilyAttributeConverter = Core.UserInterface.Fonts.ValueConverters.FontSVGFontFamilyAttributeConverter;
import FontSVGFontSizeAttributeConverter = Core.UserInterface.Fonts.ValueConverters.FontSVGFontSizeAttributeConverter;
import FontSVGFontWeightAttributeConverter = Core.UserInterface.Fonts.ValueConverters.FontSVGFontWeightAttributeConverter;
import FontSVGFontStyleAttributeConverter = Core.UserInterface.Fonts.ValueConverters.FontSVGFontStyleAttributeConverter;
import FontSVGTextDecorationAttributeConverter = Core.UserInterface.Fonts.ValueConverters.FontSVGTextDecorationAttributeConverter;
import GraphicValueSVGAttributeValueConverter = Core.UserInterface.GraphicValues.ValueConverters.GraphicValueSVGAttributeValueConverter;

const SVG_NS = "http://www.w3.org/2000/svg";

export class TextBlock extends Control {
    constructor(element: Element) {
        super(element);

        const PART_canvas = Core.UserInterface.VisualTrees.VisualTreeElement.create("svg", SVG_NS);
        this.__PART_canvas = PART_canvas;
        this.children.add(PART_canvas);

        const PART_text = Core.UserInterface.VisualTrees.VisualTreeElement.create("text", SVG_NS);
        this.__PART_text = PART_text;
        PART_canvas.children.add(PART_text);

        new PropertyAttributeBinding(this.DependencyObject, TextBlock.fontProperty, <Element>PART_text.domNode, "font-family", null, { valueConverter: new FontSVGFontFamilyAttributeConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, TextBlock.fontProperty, <Element>PART_text.domNode, "font-size", null, { valueConverter: new FontSVGFontSizeAttributeConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, TextBlock.fontProperty, <Element>PART_text.domNode, "font-weight", null, { valueConverter: new FontSVGFontWeightAttributeConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, TextBlock.fontProperty, <Element>PART_text.domNode, "font-style", null, { valueConverter: new FontSVGFontStyleAttributeConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, TextBlock.fontProperty, <Element>PART_text.domNode, "text-decoration", null, { valueConverter: new FontSVGTextDecorationAttributeConverter(), direction: BindingDirection.ToTarget });

        this.__updateFont();
        this.__updateText();
    }

    __updateSize() {
        const bbox = (<SVGTextElement>this.__PART_text.domNode).getBBox();
        const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
        this.__PART_canvas.attributes.setMultiple({
            "viewBox": viewBox,
            "width": `${bbox.width}px`,
            "height": `${bbox.height}px`
        });
    }

    __updateFont() {
        this.__updateSize();
    }

    __updateText() {
        this.__PART_text.domNode.textContent = this.text;
        this.__updateSize();
    }

    //DependencyObject
    __DependencyObject_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.property === TextBlock.fontProperty)
            this.__updateFont();
        else if (args.property === TextBlock.textProperty)
            this.__updateText();
    }

    private __PART_canvas: VisualTreeElement;
    private __PART_text: VisualTreeElement;

    static fontProperty = DependencyProperty.register(<any>TextBlock, "font", { valueType: Type.get(Font), defaultValue: Font.default });
    get font(): Font { return this.DependencyObject.get(TextBlock.fontProperty); }
    set font(value: Font) { this.DependencyObject.set(TextBlock.fontProperty, value); }

    static textProperty = DependencyProperty.register(<any>TextBlock, "text", { valueType: Type.get(String), defaultValue: "" });
    get text(): string { return this.DependencyObject.get(TextBlock.textProperty); }
    set text(value: string) { this.DependencyObject.set(TextBlock.textProperty, value); }
}

WidgetManager.register(TextBlock, "core:TextBlock", "core");

export abstract class Shape extends Control {
    constructor(element: Element) {
        super(element);

        const PART_canvas = VisualTreeElement.create("svg", SVG_NS);
        this.children.add(PART_canvas);
        this.__PART_canvas = PART_canvas;
    }

    protected abstract __calculateBoundingBox(): DOMRect;

    public invalidateSize() {
        const bbox = this.__calculateBoundingBox();
        const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
        this.__PART_canvas.attributes.setMultiple({
            "viewBox": viewBox,
            "width": `${bbox.width}px`,
            "height": `${bbox.height}px`
        });
    }

    protected __PART_canvas: VisualTreeElement;
}

export class Rectangle extends Shape {
    constructor(element: Element) {
        super(element);

        const PART_rect = VisualTreeElement.create("rect", SVG_NS);
        this.__PART_canvas.children.add(PART_rect);
        this.__PART_rect = PART_rect;

        new PropertyAttributeBinding(this.DependencyObject, Rectangle.xProperty, <Element>this.__PART_rect.domNode, "x", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, Rectangle.yProperty, <Element>this.__PART_rect.domNode, "y", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, Rectangle.widthProperty, <Element>this.__PART_rect.domNode, "width", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, Rectangle.heightProperty, <Element>this.__PART_rect.domNode, "height", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, Rectangle.rxProperty, <Element>this.__PART_rect.domNode, "rx", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });
        new PropertyAttributeBinding(this.DependencyObject, Rectangle.ryProperty, <Element>this.__PART_rect.domNode, "ry", null, { valueConverter: new GraphicValueSVGAttributeValueConverter(), direction: BindingDirection.ToTarget });

        this.invalidateSize();
    }

    protected __PART_rect: VisualTreeElement;

    static xProperty = DependencyProperty.register(<any>Rectangle, "x", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get x(): GraphicValue { return this.DependencyObject.get(Rectangle.xProperty); }
    set x(value: GraphicValue) { this.DependencyObject.set(Rectangle.xProperty, value); }

    static yProperty = DependencyProperty.register(<any>Rectangle, "y", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get y(): GraphicValue { return this.DependencyObject.get(Rectangle.yProperty); }
    set y(value: GraphicValue) { this.DependencyObject.set(Rectangle.yProperty, value); }

    static widthProperty = DependencyProperty.register(<any>Rectangle, "width", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get width(): GraphicValue { return this.DependencyObject.get(Rectangle.widthProperty); }
    set width(value: GraphicValue) { this.DependencyObject.set(Rectangle.widthProperty, value); }

    static heightProperty = DependencyProperty.register(<any>Rectangle, "height", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get height(): GraphicValue { return this.DependencyObject.get(Rectangle.heightProperty); }
    set height(value: GraphicValue) { this.DependencyObject.set(Rectangle.heightProperty, value); }

    static rxProperty = DependencyProperty.register(<any>Rectangle, "rx", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get rx(): GraphicValue { return this.DependencyObject.get(Rectangle.rxProperty); }
    set rx(value: GraphicValue) { this.DependencyObject.set(Rectangle.rxProperty, value); }

    static ryProperty = DependencyProperty.register(<any>Rectangle, "ry", { defaultValue: GraphicValue.Zero, valueType: Type.of(GraphicValue) });
    get ry(): GraphicValue { return this.DependencyObject.get(Rectangle.ryProperty); }
    set ry(value: GraphicValue) { this.DependencyObject.set(Rectangle.ryProperty, value); }

    protected __DependencyObject_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.property === Rectangle.xProperty ||
            args.property === Rectangle.yProperty ||
            args.property === Rectangle.widthProperty ||
            args.property === Rectangle.heightProperty)
            this.invalidateSize();
    }

    protected __calculateBoundingBox() {
        const bbox = (<SVGRectElement>this.__PART_rect.domNode).getBBox();
        return bbox;
    }
}

WidgetManager.register(<any>Rectangle, "core:Rectangle", "core");

export class Button extends Control {
    constructor(element: Element) {
        super(element);

        const PART_background = <Rectangle>WidgetManager.instantiate(Rectangle);
        PART_background.x = new GraphicValue(0);
        PART_background.y = new GraphicValue(0);
        PART_background.width = new GraphicValue(100, GraphicUnit.Percent);
        PART_background.height = new GraphicValue(100, GraphicUnit.Percent);
        this.children.add(PART_background);
        this.__PART_background = PART_background;
    }

    private __PART_background: VisualTreeElement;
}

WidgetManager.register(<any>Button, "core:Button", "core");

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
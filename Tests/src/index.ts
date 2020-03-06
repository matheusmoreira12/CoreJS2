import * as Core from "../../framework/src/index";
import DataContexts = Core.UserInterface.DataContexts;
import DependencyProperty = Core.UserInterface.DependencyObjects.DependencyProperty;
import PropertyChangeEventArgs = Core.UserInterface.DependencyObjects.PropertyChangeEventArgs;
import Font = Core.UserInterface.Fonts.Font;
import Type = Core.Standard.Types.Type;
import { VisualTreeElement } from "./UserInterface/VisualTrees/index";

const SVG_NS = "http://www.w3.org/2000/svg";

const fontWeightSVGAttributeConverter = new Core.UserInterface.Fonts.ValueConverters.FontWeightSVGAttributeConverter();
const fontStyleSVGAttributeConverter = new Core.UserInterface.Fonts.ValueConverters.FontStyleSVGAttributeConverter();
const textDecorationSVGAttributeConverter = new Core.UserInterface.Fonts.ValueConverters.TextDecorationSVGAttributeConverter();

class TextBlock extends Core.UserInterface.Controls.Control {
    constructor(element: Element) {
        super(element);

        const PART_canvas = Core.UserInterface.VisualTrees.VisualTreeElement.create("svg", SVG_NS);
        this.__PART_canvas = PART_canvas;
        this.children.add(PART_canvas);

        const PART_text = Core.UserInterface.VisualTrees.VisualTreeElement.create("text", SVG_NS);
        this.__PART_text = PART_text;
        PART_canvas.children.add(PART_text);
    }

    __updateSize() {
        const bbox = (<SVGTextElement>this.__PART_text.domNode).getBBox();
        const viewBox = `${bbox.x} ${bbox.y} ${bbox.right} ${bbox.bottom}`;
        this.__PART_canvas.attributes.set("viewBox", viewBox);
    }

    __updateFont() {
        const font = this.font;
        const fontWeightSVG = fontWeightSVGAttributeConverter.convert(font.weight),
            fontStyleSVG = fontStyleSVGAttributeConverter.convert(font.style),
            textDecoration = textDecorationSVGAttributeConverter.convert(font.textDecoration);

        this.__updateAttribute("font-size", this.font.size);
        this.__updateAttribute("font-style", this.font.size);
        this.__updateAttribute("text-decoration", this.font.size);
        this.__updateSize();
    }

    __updateAttribute(qualifiedName: string, value: string | null) {
        if (value === null) {
            if (this.__PART_text.attributes.has(qualifiedName))
                this.__PART_text.attributes.delete(qualifiedName);
        }
        else
            this.__PART_text.attributes.set(qualifiedName, value);
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
    get text(): string { return this.DependencyObject.get(TextBlock.fontProperty); }
    set text(value: string) { this.DependencyObject.set(TextBlock.fontProperty, value); }
}

Core.UserInterface.Controls.WidgetManager.register(TextBlock, "core:TextBlock", "core");


console.log(DataContexts.DataContext.root);
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
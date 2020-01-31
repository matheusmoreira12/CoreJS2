import * as Core from "../../framework/src/index";
import Type = Core.Standard.Types.Type;
import MemberType = Core.Standard.Types.MemberType;
import MemberSelectionType = Core.Standard.Types.MemberSelectionType;
import MemberInfo = Core.Standard.Types.MemberInfo;

import VisualTreeElement = Core.UserInterface.VisualTreeElement;
import WidgetManager = Core.UserInterface.Widgets.WidgetManager;
import Widget = Core.UserInterface.Widgets.Widget;
import Colors = Core.UserInterface.Colors;
import Bindings = Core.UserInterface.Bindings;
import DependencyObjects = Core.UserInterface.DependencyObjects;
import PropertyChangeEventArgs = Core.UserInterface.DependencyObjects.PropertyChangeEventArgs;

export class ProgressBar extends Widget {
    constructor(domElement: Element) {
        super(domElement);

        const styleElem = <HTMLStyleElement>document.createElementNS(document.lookupNamespaceURI(null), "style");
        const style = new VisualTreeElement(styleElem);
        this.children.add(style);
        styleElem.type = "text/css";
        styleElem.innerHTML = `
            @namespace core url(core); 
        
            core|ProgressBar { 
                display: inline-block; 
                width: 200px; 
                height: 20px; 
            }

            core|ProgressBar>svg {
                display: inline-block;
                width: 100%;
                height: 100%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .4);
            }
        `;

        const SVGNS = "http://www.w3.org/2000/svg";

        const svgCanvas = VisualTreeElement.create("svg", SVGNS);
        this.children.add(svgCanvas);
        svgCanvas.attributes.createMultiple({
            "viewBox": "0 0 100 100",
            "preserveAspectRatio": "none"
        });

        const backgroundRectangle = VisualTreeElement.create("rect", SVGNS)
        svgCanvas.children.add(backgroundRectangle);
        this.__backgroundRectangle = backgroundRectangle;

        backgroundRectangle.attributes.createMultiple({
            "x": "0",
            "y": "0",
            "width": "100",
            "height": "100",
            "fill": Colors.WebColors.Gainsboro.toString()
        });

        const fillRectangle = VisualTreeElement.create("rect", SVGNS)
        svgCanvas.children.add(fillRectangle);
        this.__fillRectangle = fillRectangle;

        fillRectangle.attributes.createMultiple({ 
            "x": "0",
            "y": "0",
            "width": "0",
            "height": "100",
            "fill": Colors.WebColors.OrangeRed.toString()
        });

        const strokeRectangle = VisualTreeElement.create("rect", SVGNS)
        svgCanvas.children.add(strokeRectangle);

        strokeRectangle.attributes.createMultiple({
            "x": "0",
            "y": "0",
            "width": "100",
            "height": "100",
            "fill": "transparent",
            "stroke": Colors.WebColors.Black.toString(), 
            "stroke-width": "2",
            "vector-effect": "non-scaling-stroke"
        }, null);

        new Bindings.PropertyAttributeBinding(this, ProgressBar.ValueProperty, <Element>this.domNode, "value");
        new Bindings.PropertyAttributeBinding(this, ProgressBar.MinProperty, <Element>this.domNode, "min");
        new Bindings.PropertyAttributeBinding(this, ProgressBar.MaxProperty, <Element>this.domNode, "max");

        ProgressBar.ValueProperty.ChangeEvent.attach(this.__ValueProperty_onChange, this);
        ProgressBar.MinProperty.ChangeEvent.attach(this.__MinProperty_onChange, this);
        ProgressBar.MaxProperty.ChangeEvent.attach(this.__MaxProperty_onChange, this);

        this.__update();
    }

    private __update() {
        const percentProgress = (this.value - this.min) / (this.max - this.min) * 100;
        const fillWidthAttribute = this.__fillRectangle.attributes.get("width");
        if (!fillWidthAttribute)
            return;
        fillWidthAttribute.value = String(percentProgress);
    }

    static ValueProperty = new DependencyObjects.FrameworkProperty("value", new DependencyObjects.FrameworkPropertyOptions(Type.get(Number), 0));
    get value(): number { return ProgressBar.ValueProperty.get(this); };
    set value(value: number) { ProgressBar.ValueProperty.set(this, value); }

    private __ValueProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this)
            return;

        this.__update();
    }

    static MinProperty = new DependencyObjects.FrameworkProperty("min", new DependencyObjects.FrameworkPropertyOptions(Type.get(Number), 0));
    get min(): number { return ProgressBar.MinProperty.get(this); };
    set min(min: number) { ProgressBar.MinProperty.set(this, min); }

    private __MinProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this)
            return;

        this.__update();
    }

    static MaxProperty = new DependencyObjects.FrameworkProperty("max", new DependencyObjects.FrameworkPropertyOptions(Type.get(Number), 100));
    get max(): number { return ProgressBar.MaxProperty.get(this); };
    set max(max: number) { ProgressBar.MaxProperty.set(this, max); }

    private __MaxProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this)
            return;

        this.__update();
    }

    private __fillRectangle: VisualTreeElement;
    private __backgroundRectangle: VisualTreeElement;

    destructor(): void {
        super.destructor();
    }
}

WidgetManager.register(ProgressBar, "core:ProgressBar", "core")

window.dg = WidgetManager.instantiate(ProgressBar);

document.body.appendChild(dg.domNode);

/*export const Consolify = new (function () {
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

    const memberIsProperty = MemberType.contains(MemberType.Property, member.memberType),
        memberIsField = MemberType.contains(MemberType.Field, member.memberType);
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

    let staticMembers = [...type.getMembers(MemberSelectionType.AnyStatic)];
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

window.Tests = Object.assign({}, window.Tests, { doListTypeInfo });*/
import { Control } from "../src/UserInterface/Controls/index";
import { DependencyProperty, PropertyMetadata, PropertyChangeEventArgs, DependencyObject } from "../src/Standard/DependencyObjects/index";
import { Type } from "../src/Standard/Types/Type";
import { Font } from "../src/UserInterface/Fonts/index";

export abstract class ContentControl extends Control {
    constructor(domElement: Element) {
        super(domElement);
    }

    static contentProperty = DependencyProperty.register(<any>ContentControl, "content", new PropertyMetadata(null, null));
    public get content(): any { return this.get(ContentControl.contentProperty); }
    public set content(value: any) { this.set(ContentControl.contentProperty, value); }

    static fontProperty = DependencyProperty.register(<any>ContentControl, "font", new PropertyMetadata(Type.get(Font), Font.default));
    public get font(): Font { return this.get(ContentControl.fontProperty); }
    public set font(value: Font) { this.set(ContentControl.fontProperty, value); }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.property === ContentControl.fontProperty)
            this.__updateFont(args.newValue);
        else if (args.property === ContentControl.contentProperty)
            this.__updateContent(args.oldValue, args.newValue);
    }

    private __updateFont(newValue: any) {
        throw new Error("Method not implemented.");
    }

    private __updateContent(oldValue: any, newValue: any) {
        throw new Error("Method not implemented.");
    }

    destructor() {

        super.destructor();
    }
}
import { Control } from "../src/UserInterface/Controls/index";
import { DependencyProperty, PropertyMetadata, PropertyChangeEventArgs, DependencyObject } from "../src/Standard/DependencyObjects/index";
import { Type } from "../src/Standard/Types/Type";
import { Font } from "../src/UserInterface/Fonts/index";

export abstract class ContentControl extends Control {
    constructor(domElement: Element) {
        super(domElement);
    }

    static contentProperty = new DependencyProperty("content", new PropertyMetadata(null, null));
    public get content(): any { return ContentControl.contentProperty.get(this); }
    public set content(value: any) { ContentControl.contentProperty.set(this, value); }
    
    static fontProperty = new DependencyProperty("font", new PropertyMetadata(Type.get(Font), Font.default));
    public get font(): Font { return ContentControl.fontProperty.get(this); }
    public set font(value: Font) { ContentControl.fontProperty.set(this, value); }

    destructor() {


        super.destructor();
    }
}
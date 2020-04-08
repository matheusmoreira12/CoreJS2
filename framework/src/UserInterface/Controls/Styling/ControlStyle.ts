import { DependencyObject, DependencyProperty, PropertyChangeEventArgs } from "../../DependencyObjects/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";
import { IdentifierGenerator } from "../../../CoreBase/index.js";
import { Destructible } from "../../../Standard/index.js";
import { IDependencyObject } from "../../DependencyObjects/IDependencyObject.js";
import { Blender } from "../../../Standard/Blender/index.js";
import { FrameworkEvent } from "../../../Standard/Events/index.js";
import { StringUtils } from "../../../CoreBase/Utils/index.js";
import { DOMUtils } from "../../index.js";

const gen = new IdentifierGenerator();

export class ControlStyle extends Destructible implements CSSStyleDeclaration, IDependencyObject {
    constructor(targetElement: VisualTreeElement) {
        super();

        this.__targetElement = targetElement;

        //Blend with DependencyObject
        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);

        //Assign interface IDependencyObject
        this.get = Blender.execute(this, DependencyObject, o => o.get.bind(o));
        this.set = Blender.execute(this, DependencyObject, o => o.set.bind(o));
        this.PropertyChangeEvent = Blender.get(DependencyObject, this).PropertyChangeEvent;
        this.PropertyChangeEvent.attach(this.__onPropertyChange, this);

        //Generate ID
        const id = gen.generate();
        this.__id = id;

        //Create Style Element
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `@namespace core "core"; core|*[core|styleId=style${id}] {}`;
        document.head.appendChild(styleElement);
        this.__styleElement = styleElement;
        this.__styleDeclaration = styleElement.sheet!.rules[1].style;

        this.__targetElement.domElement.setAttributeNS("core", "core:styleId", `style${id}`);

        //Assign Interface CSSStyleDeclaration
        this.getPropertyPriority = this.__styleDeclaration.getPropertyPriority.bind(this.__styleDeclaration);
        this.getPropertyValue = this.__styleDeclaration.getPropertyValue.bind(this.__styleDeclaration);
        this.item = this.__styleDeclaration.item.bind(this.__styleDeclaration);
        this.removeProperty = this.__styleDeclaration.removeProperty.bind(this.__styleDeclaration);
        this.setProperty = this.__styleDeclaration.setProperty.bind(this.__styleDeclaration);
        this[Symbol.iterator] = this.__styleDeclaration[Symbol.iterator].bind(this.__styleDeclaration);
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        const propName = StringUtils.toHyphenCase(args.property.name);
        this.__styleDeclaration.setProperty(propName, args.newValue);

        //Temporary fix for rendenring issues in Safary/Webkit browsers
        DOMUtils.forceRepaint();
    }

    protected __targetElement: VisualTreeElement;
    protected __id: number;
    protected __styleElement: HTMLStyleElement;
    protected __styleDeclaration: CSSStyleDeclaration;

    //IDependencyObject Properties
    get!: (property: DependencyProperty) => any;
    set!: (property: DependencyProperty, value: any) => void;
    PropertyChangeEvent!: FrameworkEvent<PropertyChangeEventArgs>;

    //StyleSheetDeclaration Properties
    [index: number]: string;

    static alignContentProperty = DependencyProperty.register(ControlStyle, "alignContent");
    get alignContent(): string { return this.get(ControlStyle.alignContentProperty); }
    set alignContent(value: string) { this.set(ControlStyle.alignContentProperty, value); }

    static alignItemsProperty = DependencyProperty.register(ControlStyle, "alignItems");
    get alignItems(): string { return this.get(ControlStyle.alignItemsProperty); }
    set alignItems(value: string) { this.set(ControlStyle.alignItemsProperty, value); }

    static alignSelfProperty = DependencyProperty.register(ControlStyle, "alignSelf");
    get alignSelf(): string { return this.get(ControlStyle.alignSelfProperty); }
    set alignSelf(value: string) { this.set(ControlStyle.alignSelfProperty, value); }

    static alignmentBaselineProperty = DependencyProperty.register(ControlStyle, "alignmentBaseline");
    get alignmentBaseline(): string { return this.get(ControlStyle.alignmentBaselineProperty); }
    set alignmentBaseline(value: string) { this.set(ControlStyle.alignmentBaselineProperty, value); }

    static animationProperty = DependencyProperty.register(ControlStyle, "animation");
    get animation(): string { return this.get(ControlStyle.animationProperty); }
    set animation(value: string) { this.set(ControlStyle.animationProperty, value); }

    static animationDelayProperty = DependencyProperty.register(ControlStyle, "animationDelay");
    get animationDelay(): string { return this.get(ControlStyle.animationDelayProperty); }
    set animationDelay(value: string) { this.set(ControlStyle.animationDelayProperty, value); }

    static animationDirectionProperty = DependencyProperty.register(ControlStyle, "animationDirection");
    get animationDirection(): string { return this.get(ControlStyle.animationDirectionProperty); }
    set animationDirection(value: string) { this.set(ControlStyle.animationDirectionProperty, value); }

    static animationDurationProperty = DependencyProperty.register(ControlStyle, "animationDuration");
    get animationDuration(): string { return this.get(ControlStyle.animationDurationProperty); }
    set animationDuration(value: string) { this.set(ControlStyle.animationDurationProperty, value); }

    static animationFillModeProperty = DependencyProperty.register(ControlStyle, "animationFillMode");
    get animationFillMode(): string { return this.get(ControlStyle.animationFillModeProperty); }
    set animationFillMode(value: string) { this.set(ControlStyle.animationFillModeProperty, value); }

    static animationIterationCountProperty = DependencyProperty.register(ControlStyle, "animationIterationCount");
    get animationIterationCount(): string { return this.get(ControlStyle.animationIterationCountProperty); }
    set animationIterationCount(value: string) { this.set(ControlStyle.animationIterationCountProperty, value); }

    static animationNameProperty = DependencyProperty.register(ControlStyle, "animationName");
    get animationName(): string { return this.get(ControlStyle.animationNameProperty); }
    set animationName(value: string) { this.set(ControlStyle.animationNameProperty, value); }

    static animationPlayStateProperty = DependencyProperty.register(ControlStyle, "animationPlayState");
    get animationPlayState(): string { return this.get(ControlStyle.animationPlayStateProperty); }
    set animationPlayState(value: string) { this.set(ControlStyle.animationPlayStateProperty, value); }

    static animationTimingFunctionProperty = DependencyProperty.register(ControlStyle, "animationTimingFunction");
    get animationTimingFunction(): string { return this.get(ControlStyle.animationTimingFunctionProperty); }
    set animationTimingFunction(value: string) { this.set(ControlStyle.animationTimingFunctionProperty, value); }

    static backfaceVisibilityProperty = DependencyProperty.register(ControlStyle, "backfaceVisibility");
    get backfaceVisibility(): string { return this.get(ControlStyle.backfaceVisibilityProperty); }
    set backfaceVisibility(value: string) { this.set(ControlStyle.backfaceVisibilityProperty, value); }

    static backgroundProperty = DependencyProperty.register(ControlStyle, "background");
    get background(): string { return this.get(ControlStyle.backgroundProperty); }
    set background(value: string) { this.set(ControlStyle.backgroundProperty, value); }

    static backgroundAttachmentProperty = DependencyProperty.register(ControlStyle, "backgroundAttachment");
    get backgroundAttachment(): string { return this.get(ControlStyle.backgroundAttachmentProperty); }
    set backgroundAttachment(value: string) { this.set(ControlStyle.backgroundAttachmentProperty, value); }

    static backgroundClipProperty = DependencyProperty.register(ControlStyle, "backgroundClip");
    get backgroundClip(): string { return this.get(ControlStyle.backgroundClipProperty); }
    set backgroundClip(value: string) { this.set(ControlStyle.backgroundClipProperty, value); }

    static backgroundColorProperty = DependencyProperty.register(ControlStyle, "backgroundColor");
    get backgroundColor(): string { return this.get(ControlStyle.backgroundColorProperty); }
    set backgroundColor(value: string) { this.set(ControlStyle.backgroundColorProperty, value); }

    static backgroundImageProperty = DependencyProperty.register(ControlStyle, "backgroundImage");
    get backgroundImage(): string { return this.get(ControlStyle.backgroundImageProperty); }
    set backgroundImage(value: string) { this.set(ControlStyle.backgroundImageProperty, value); }

    static backgroundOriginProperty = DependencyProperty.register(ControlStyle, "backgroundOrigin");
    get backgroundOrigin(): string { return this.get(ControlStyle.backgroundOriginProperty); }
    set backgroundOrigin(value: string) { this.set(ControlStyle.backgroundOriginProperty, value); }

    static backgroundPositionProperty = DependencyProperty.register(ControlStyle, "backgroundPosition");
    get backgroundPosition(): string { return this.get(ControlStyle.backgroundPositionProperty); }
    set backgroundPosition(value: string) { this.set(ControlStyle.backgroundPositionProperty, value); }

    static backgroundPositionXProperty = DependencyProperty.register(ControlStyle, "backgroundPositionX");
    get backgroundPositionX(): string { return this.get(ControlStyle.backgroundPositionXProperty); }
    set backgroundPositionX(value: string) { this.set(ControlStyle.backgroundPositionXProperty, value); }

    static backgroundPositionYProperty = DependencyProperty.register(ControlStyle, "backgroundPositionY");
    get backgroundPositionY(): string { return this.get(ControlStyle.backgroundPositionYProperty); }
    set backgroundPositionY(value: string) { this.set(ControlStyle.backgroundPositionYProperty, value); }

    static backgroundRepeatProperty = DependencyProperty.register(ControlStyle, "backgroundRepeat");
    get backgroundRepeat(): string { return this.get(ControlStyle.backgroundRepeatProperty); }
    set backgroundRepeat(value: string) { this.set(ControlStyle.backgroundRepeatProperty, value); }

    static backgroundSizeProperty = DependencyProperty.register(ControlStyle, "backgroundSize");
    get backgroundSize(): string { return this.get(ControlStyle.backgroundSizeProperty); }
    set backgroundSize(value: string) { this.set(ControlStyle.backgroundSizeProperty, value); }

    static baselineShiftProperty = DependencyProperty.register(ControlStyle, "baselineShift");
    get baselineShift(): string { return this.get(ControlStyle.baselineShiftProperty); }
    set baselineShift(value: string) { this.set(ControlStyle.baselineShiftProperty, value); }

    static blockSizeProperty = DependencyProperty.register(ControlStyle, "blockSize");
    get blockSize(): string { return this.get(ControlStyle.blockSizeProperty); }
    set blockSize(value: string) { this.set(ControlStyle.blockSizeProperty, value); }

    static borderProperty = DependencyProperty.register(ControlStyle, "border");
    get border(): string { return this.get(ControlStyle.borderProperty); }
    set border(value: string) { this.set(ControlStyle.borderProperty, value); }

    static borderBlockEndProperty = DependencyProperty.register(ControlStyle, "borderBlockEnd");
    get borderBlockEnd(): string { return this.get(ControlStyle.borderBlockEndProperty); }
    set borderBlockEnd(value: string) { this.set(ControlStyle.borderBlockEndProperty, value); }

    static borderBlockEndColorProperty = DependencyProperty.register(ControlStyle, "borderBlockEndColor");
    get borderBlockEndColor(): string { return this.get(ControlStyle.borderBlockEndColorProperty); }
    set borderBlockEndColor(value: string) { this.set(ControlStyle.borderBlockEndColorProperty, value); }

    static borderBlockEndStyleProperty = DependencyProperty.register(ControlStyle, "borderBlockEndStyle");
    get borderBlockEndStyle(): string { return this.get(ControlStyle.borderBlockEndStyleProperty); }
    set borderBlockEndStyle(value: string) { this.set(ControlStyle.borderBlockEndStyleProperty, value); }

    static borderBlockEndWidthProperty = DependencyProperty.register(ControlStyle, "borderBlockEndWidth");
    get borderBlockEndWidth(): string { return this.get(ControlStyle.borderBlockEndWidthProperty); }
    set borderBlockEndWidth(value: string) { this.set(ControlStyle.borderBlockEndWidthProperty, value); }

    static borderBlockStartProperty = DependencyProperty.register(ControlStyle, "borderBlockStart");
    get borderBlockStart(): string { return this.get(ControlStyle.borderBlockStartProperty); }
    set borderBlockStart(value: string) { this.set(ControlStyle.borderBlockStartProperty, value); }

    static borderBlockStartColorProperty = DependencyProperty.register(ControlStyle, "borderBlockStartColor");
    get borderBlockStartColor(): string { return this.get(ControlStyle.borderBlockStartColorProperty); }
    set borderBlockStartColor(value: string) { this.set(ControlStyle.borderBlockStartColorProperty, value); }

    static borderBlockStartStyleProperty = DependencyProperty.register(ControlStyle, "borderBlockStartStyle");
    get borderBlockStartStyle(): string { return this.get(ControlStyle.borderBlockStartStyleProperty); }
    set borderBlockStartStyle(value: string) { this.set(ControlStyle.borderBlockStartStyleProperty, value); }

    static borderBlockStartWidthProperty = DependencyProperty.register(ControlStyle, "borderBlockStartWidth");
    get borderBlockStartWidth(): string { return this.get(ControlStyle.borderBlockStartWidthProperty); }
    set borderBlockStartWidth(value: string) { this.set(ControlStyle.borderBlockStartWidthProperty, value); }

    static borderBottomProperty = DependencyProperty.register(ControlStyle, "borderBottom");
    get borderBottom(): string { return this.get(ControlStyle.borderBottomProperty); }
    set borderBottom(value: string) { this.set(ControlStyle.borderBottomProperty, value); }

    static borderBottomColorProperty = DependencyProperty.register(ControlStyle, "borderBottomColor");
    get borderBottomColor(): string { return this.get(ControlStyle.borderBottomColorProperty); }
    set borderBottomColor(value: string) { this.set(ControlStyle.borderBottomColorProperty, value); }

    static borderBottomLeftRadiusProperty = DependencyProperty.register(ControlStyle, "borderBottomLeftRadius");
    get borderBottomLeftRadius(): string { return this.get(ControlStyle.borderBottomLeftRadiusProperty); }
    set borderBottomLeftRadius(value: string) { this.set(ControlStyle.borderBottomLeftRadiusProperty, value); }

    static borderBottomRightRadiusProperty = DependencyProperty.register(ControlStyle, "borderBottomRightRadius");
    get borderBottomRightRadius(): string { return this.get(ControlStyle.borderBottomRightRadiusProperty); }
    set borderBottomRightRadius(value: string) { this.set(ControlStyle.borderBottomRightRadiusProperty, value); }

    static borderBottomStyleProperty = DependencyProperty.register(ControlStyle, "borderBottomStyle");
    get borderBottomStyle(): string { return this.get(ControlStyle.borderBottomStyleProperty); }
    set borderBottomStyle(value: string) { this.set(ControlStyle.borderBottomStyleProperty, value); }

    static borderBottomWidthProperty = DependencyProperty.register(ControlStyle, "borderBottomWidth");
    get borderBottomWidth(): string { return this.get(ControlStyle.borderBottomWidthProperty); }
    set borderBottomWidth(value: string) { this.set(ControlStyle.borderBottomWidthProperty, value); }

    static borderCollapseProperty = DependencyProperty.register(ControlStyle, "borderCollapse");
    get borderCollapse(): string { return this.get(ControlStyle.borderCollapseProperty); }
    set borderCollapse(value: string) { this.set(ControlStyle.borderCollapseProperty, value); }

    static borderColorProperty = DependencyProperty.register(ControlStyle, "borderColor");
    get borderColor(): string { return this.get(ControlStyle.borderColorProperty); }
    set borderColor(value: string) { this.set(ControlStyle.borderColorProperty, value); }

    static borderImageProperty = DependencyProperty.register(ControlStyle, "borderImage");
    get borderImage(): string { return this.get(ControlStyle.borderImageProperty); }
    set borderImage(value: string) { this.set(ControlStyle.borderImageProperty, value); }

    static borderImageOutsetProperty = DependencyProperty.register(ControlStyle, "borderImageOutset");
    get borderImageOutset(): string { return this.get(ControlStyle.borderImageOutsetProperty); }
    set borderImageOutset(value: string) { this.set(ControlStyle.borderImageOutsetProperty, value); }

    static borderImageRepeatProperty = DependencyProperty.register(ControlStyle, "borderImageRepeat");
    get borderImageRepeat(): string { return this.get(ControlStyle.borderImageRepeatProperty); }
    set borderImageRepeat(value: string) { this.set(ControlStyle.borderImageRepeatProperty, value); }

    static borderImageSliceProperty = DependencyProperty.register(ControlStyle, "borderImageSlice");
    get borderImageSlice(): string { return this.get(ControlStyle.borderImageSliceProperty); }
    set borderImageSlice(value: string) { this.set(ControlStyle.borderImageSliceProperty, value); }

    static borderImageSourceProperty = DependencyProperty.register(ControlStyle, "borderImageSource");
    get borderImageSource(): string { return this.get(ControlStyle.borderImageSourceProperty); }
    set borderImageSource(value: string) { this.set(ControlStyle.borderImageSourceProperty, value); }

    static borderImageWidthProperty = DependencyProperty.register(ControlStyle, "borderImageWidth");
    get borderImageWidth(): string { return this.get(ControlStyle.borderImageWidthProperty); }
    set borderImageWidth(value: string) { this.set(ControlStyle.borderImageWidthProperty, value); }

    static borderInlineEndProperty = DependencyProperty.register(ControlStyle, "borderInlineEnd");
    get borderInlineEnd(): string { return this.get(ControlStyle.borderInlineEndProperty); }
    set borderInlineEnd(value: string) { this.set(ControlStyle.borderInlineEndProperty, value); }

    static borderInlineEndColorProperty = DependencyProperty.register(ControlStyle, "borderInlineEndColor");
    get borderInlineEndColor(): string { return this.get(ControlStyle.borderInlineEndColorProperty); }
    set borderInlineEndColor(value: string) { this.set(ControlStyle.borderInlineEndColorProperty, value); }

    static borderInlineEndStyleProperty = DependencyProperty.register(ControlStyle, "borderInlineEndStyle");
    get borderInlineEndStyle(): string { return this.get(ControlStyle.borderInlineEndStyleProperty); }
    set borderInlineEndStyle(value: string) { this.set(ControlStyle.borderInlineEndStyleProperty, value); }

    static borderInlineEndWidthProperty = DependencyProperty.register(ControlStyle, "borderInlineEndWidth");
    get borderInlineEndWidth(): string { return this.get(ControlStyle.borderInlineEndWidthProperty); }
    set borderInlineEndWidth(value: string) { this.set(ControlStyle.borderInlineEndWidthProperty, value); }

    static borderInlineStartProperty = DependencyProperty.register(ControlStyle, "borderInlineStart");
    get borderInlineStart(): string { return this.get(ControlStyle.borderInlineStartProperty); }
    set borderInlineStart(value: string) { this.set(ControlStyle.borderInlineStartProperty, value); }

    static borderInlineStartColorProperty = DependencyProperty.register(ControlStyle, "borderInlineStartColor");
    get borderInlineStartColor(): string { return this.get(ControlStyle.borderInlineStartColorProperty); }
    set borderInlineStartColor(value: string) { this.set(ControlStyle.borderInlineStartColorProperty, value); }

    static borderInlineStartStyleProperty = DependencyProperty.register(ControlStyle, "borderInlineStartStyle");
    get borderInlineStartStyle(): string { return this.get(ControlStyle.borderInlineStartStyleProperty); }
    set borderInlineStartStyle(value: string) { this.set(ControlStyle.borderInlineStartStyleProperty, value); }

    static borderInlineStartWidthProperty = DependencyProperty.register(ControlStyle, "borderInlineStartWidth");
    get borderInlineStartWidth(): string { return this.get(ControlStyle.borderInlineStartWidthProperty); }
    set borderInlineStartWidth(value: string) { this.set(ControlStyle.borderInlineStartWidthProperty, value); }

    static borderLeftProperty = DependencyProperty.register(ControlStyle, "borderLeft");
    get borderLeft(): string { return this.get(ControlStyle.borderLeftProperty); }
    set borderLeft(value: string) { this.set(ControlStyle.borderLeftProperty, value); }

    static borderLeftColorProperty = DependencyProperty.register(ControlStyle, "borderLeftColor");
    get borderLeftColor(): string { return this.get(ControlStyle.borderLeftColorProperty); }
    set borderLeftColor(value: string) { this.set(ControlStyle.borderLeftColorProperty, value); }

    static borderLeftStyleProperty = DependencyProperty.register(ControlStyle, "borderLeftStyle");
    get borderLeftStyle(): string { return this.get(ControlStyle.borderLeftStyleProperty); }
    set borderLeftStyle(value: string) { this.set(ControlStyle.borderLeftStyleProperty, value); }

    static borderLeftWidthProperty = DependencyProperty.register(ControlStyle, "borderLeftWidth");
    get borderLeftWidth(): string { return this.get(ControlStyle.borderLeftWidthProperty); }
    set borderLeftWidth(value: string) { this.set(ControlStyle.borderLeftWidthProperty, value); }

    static borderRadiusProperty = DependencyProperty.register(ControlStyle, "borderRadius");
    get borderRadius(): string { return this.get(ControlStyle.borderRadiusProperty); }
    set borderRadius(value: string) { this.set(ControlStyle.borderRadiusProperty, value); }

    static borderRightProperty = DependencyProperty.register(ControlStyle, "borderRight");
    get borderRight(): string { return this.get(ControlStyle.borderRightProperty); }
    set borderRight(value: string) { this.set(ControlStyle.borderRightProperty, value); }

    static borderRightColorProperty = DependencyProperty.register(ControlStyle, "borderRightColor");
    get borderRightColor(): string { return this.get(ControlStyle.borderRightColorProperty); }
    set borderRightColor(value: string) { this.set(ControlStyle.borderRightColorProperty, value); }

    static borderRightStyleProperty = DependencyProperty.register(ControlStyle, "borderRightStyle");
    get borderRightStyle(): string { return this.get(ControlStyle.borderRightStyleProperty); }
    set borderRightStyle(value: string) { this.set(ControlStyle.borderRightStyleProperty, value); }

    static borderRightWidthProperty = DependencyProperty.register(ControlStyle, "borderRightWidth");
    get borderRightWidth(): string { return this.get(ControlStyle.borderRightWidthProperty); }
    set borderRightWidth(value: string) { this.set(ControlStyle.borderRightWidthProperty, value); }

    static borderSpacingProperty = DependencyProperty.register(ControlStyle, "borderSpacing");
    get borderSpacing(): string { return this.get(ControlStyle.borderSpacingProperty); }
    set borderSpacing(value: string) { this.set(ControlStyle.borderSpacingProperty, value); }

    static borderStyleProperty = DependencyProperty.register(ControlStyle, "borderStyle");
    get borderStyle(): string { return this.get(ControlStyle.borderStyleProperty); }
    set borderStyle(value: string) { this.set(ControlStyle.borderStyleProperty, value); }

    static borderTopProperty = DependencyProperty.register(ControlStyle, "borderTop");
    get borderTop(): string { return this.get(ControlStyle.borderTopProperty); }
    set borderTop(value: string) { this.set(ControlStyle.borderTopProperty, value); }

    static borderTopColorProperty = DependencyProperty.register(ControlStyle, "borderTopColor");
    get borderTopColor(): string { return this.get(ControlStyle.borderTopColorProperty); }
    set borderTopColor(value: string) { this.set(ControlStyle.borderTopColorProperty, value); }

    static borderTopLeftRadiusProperty = DependencyProperty.register(ControlStyle, "borderTopLeftRadius");
    get borderTopLeftRadius(): string { return this.get(ControlStyle.borderTopLeftRadiusProperty); }
    set borderTopLeftRadius(value: string) { this.set(ControlStyle.borderTopLeftRadiusProperty, value); }

    static borderTopRightRadiusProperty = DependencyProperty.register(ControlStyle, "borderTopRightRadius");
    get borderTopRightRadius(): string { return this.get(ControlStyle.borderTopRightRadiusProperty); }
    set borderTopRightRadius(value: string) { this.set(ControlStyle.borderTopRightRadiusProperty, value); }

    static borderTopStyleProperty = DependencyProperty.register(ControlStyle, "borderTopStyle");
    get borderTopStyle(): string { return this.get(ControlStyle.borderTopStyleProperty); }
    set borderTopStyle(value: string) { this.set(ControlStyle.borderTopStyleProperty, value); }

    static borderTopWidthProperty = DependencyProperty.register(ControlStyle, "borderTopWidth");
    get borderTopWidth(): string { return this.get(ControlStyle.borderTopWidthProperty); }
    set borderTopWidth(value: string) { this.set(ControlStyle.borderTopWidthProperty, value); }

    static borderWidthProperty = DependencyProperty.register(ControlStyle, "borderWidth");
    get borderWidth(): string { return this.get(ControlStyle.borderWidthProperty); }
    set borderWidth(value: string) { this.set(ControlStyle.borderWidthProperty, value); }

    static bottomProperty = DependencyProperty.register(ControlStyle, "bottom");
    get bottom(): string { return this.get(ControlStyle.bottomProperty); }
    set bottom(value: string) { this.set(ControlStyle.bottomProperty, value); }

    static boxShadowProperty = DependencyProperty.register(ControlStyle, "boxShadow");
    get boxShadow(): string { return this.get(ControlStyle.boxShadowProperty); }
    set boxShadow(value: string) { this.set(ControlStyle.boxShadowProperty, value); }

    static boxSizingProperty = DependencyProperty.register(ControlStyle, "boxSizing");
    get boxSizing(): string { return this.get(ControlStyle.boxSizingProperty); }
    set boxSizing(value: string) { this.set(ControlStyle.boxSizingProperty, value); }

    static breakAfterProperty = DependencyProperty.register(ControlStyle, "breakAfter");
    get breakAfter(): string { return this.get(ControlStyle.breakAfterProperty); }
    set breakAfter(value: string) { this.set(ControlStyle.breakAfterProperty, value); }

    static breakBeforeProperty = DependencyProperty.register(ControlStyle, "breakBefore");
    get breakBefore(): string { return this.get(ControlStyle.breakBeforeProperty); }
    set breakBefore(value: string) { this.set(ControlStyle.breakBeforeProperty, value); }

    static breakInsideProperty = DependencyProperty.register(ControlStyle, "breakInside");
    get breakInside(): string { return this.get(ControlStyle.breakInsideProperty); }
    set breakInside(value: string) { this.set(ControlStyle.breakInsideProperty, value); }

    static captionSideProperty = DependencyProperty.register(ControlStyle, "captionSide");
    get captionSide(): string { return this.get(ControlStyle.captionSideProperty); }
    set captionSide(value: string) { this.set(ControlStyle.captionSideProperty, value); }

    static caretColorProperty = DependencyProperty.register(ControlStyle, "caretColor");
    get caretColor(): string { return this.get(ControlStyle.caretColorProperty); }
    set caretColor(value: string) { this.set(ControlStyle.caretColorProperty, value); }

    static clearProperty = DependencyProperty.register(ControlStyle, "clear");
    get clear(): string { return this.get(ControlStyle.clearProperty); }
    set clear(value: string) { this.set(ControlStyle.clearProperty, value); }

    static clipProperty = DependencyProperty.register(ControlStyle, "clip");
    get clip(): string { return this.get(ControlStyle.clipProperty); }
    set clip(value: string) { this.set(ControlStyle.clipProperty, value); }

    static clipPathProperty = DependencyProperty.register(ControlStyle, "clipPath");
    get clipPath(): string { return this.get(ControlStyle.clipPathProperty); }
    set clipPath(value: string) { this.set(ControlStyle.clipPathProperty, value); }

    static clipRuleProperty = DependencyProperty.register(ControlStyle, "clipRule");
    get clipRule(): string { return this.get(ControlStyle.clipRuleProperty); }
    set clipRule(value: string) { this.set(ControlStyle.clipRuleProperty, value); }

    static colorProperty = DependencyProperty.register(ControlStyle, "color");
    get color(): string { return this.get(ControlStyle.colorProperty); }
    set color(value: string) { this.set(ControlStyle.colorProperty, value); }

    static colorInterpolationProperty = DependencyProperty.register(ControlStyle, "colorInterpolation");
    get colorInterpolation(): string { return this.get(ControlStyle.colorInterpolationProperty); }
    set colorInterpolation(value: string) { this.set(ControlStyle.colorInterpolationProperty, value); }

    static colorInterpolationFiltersProperty = DependencyProperty.register(ControlStyle, "colorInterpolationFilters");
    get colorInterpolationFilters(): string { return this.get(ControlStyle.colorInterpolationFiltersProperty); }
    set colorInterpolationFilters(value: string) { this.set(ControlStyle.colorInterpolationFiltersProperty, value); }

    static columnCountProperty = DependencyProperty.register(ControlStyle, "columnCount");
    get columnCount(): string { return this.get(ControlStyle.columnCountProperty); }
    set columnCount(value: string) { this.set(ControlStyle.columnCountProperty, value); }

    static columnFillProperty = DependencyProperty.register(ControlStyle, "columnFill");
    get columnFill(): string { return this.get(ControlStyle.columnFillProperty); }
    set columnFill(value: string) { this.set(ControlStyle.columnFillProperty, value); }

    static columnGapProperty = DependencyProperty.register(ControlStyle, "columnGap");
    get columnGap(): string { return this.get(ControlStyle.columnGapProperty); }
    set columnGap(value: string) { this.set(ControlStyle.columnGapProperty, value); }

    static columnRuleProperty = DependencyProperty.register(ControlStyle, "columnRule");
    get columnRule(): string { return this.get(ControlStyle.columnRuleProperty); }
    set columnRule(value: string) { this.set(ControlStyle.columnRuleProperty, value); }

    static columnRuleColorProperty = DependencyProperty.register(ControlStyle, "columnRuleColor");
    get columnRuleColor(): string { return this.get(ControlStyle.columnRuleColorProperty); }
    set columnRuleColor(value: string) { this.set(ControlStyle.columnRuleColorProperty, value); }

    static columnRuleStyleProperty = DependencyProperty.register(ControlStyle, "columnRuleStyle");
    get columnRuleStyle(): string { return this.get(ControlStyle.columnRuleStyleProperty); }
    set columnRuleStyle(value: string) { this.set(ControlStyle.columnRuleStyleProperty, value); }

    static columnRuleWidthProperty = DependencyProperty.register(ControlStyle, "columnRuleWidth");
    get columnRuleWidth(): string { return this.get(ControlStyle.columnRuleWidthProperty); }
    set columnRuleWidth(value: string) { this.set(ControlStyle.columnRuleWidthProperty, value); }

    static columnSpanProperty = DependencyProperty.register(ControlStyle, "columnSpan");
    get columnSpan(): string { return this.get(ControlStyle.columnSpanProperty); }
    set columnSpan(value: string) { this.set(ControlStyle.columnSpanProperty, value); }

    static columnWidthProperty = DependencyProperty.register(ControlStyle, "columnWidth");
    get columnWidth(): string { return this.get(ControlStyle.columnWidthProperty); }
    set columnWidth(value: string) { this.set(ControlStyle.columnWidthProperty, value); }

    static columnsProperty = DependencyProperty.register(ControlStyle, "columns");
    get columns(): string { return this.get(ControlStyle.columnsProperty); }
    set columns(value: string) { this.set(ControlStyle.columnsProperty, value); }

    static contentProperty = DependencyProperty.register(ControlStyle, "content");
    get content(): string { return this.get(ControlStyle.contentProperty); }
    set content(value: string) { this.set(ControlStyle.contentProperty, value); }

    static counterIncrementProperty = DependencyProperty.register(ControlStyle, "counterIncrement");
    get counterIncrement(): string { return this.get(ControlStyle.counterIncrementProperty); }
    set counterIncrement(value: string) { this.set(ControlStyle.counterIncrementProperty, value); }

    static counterResetProperty = DependencyProperty.register(ControlStyle, "counterReset");
    get counterReset(): string { return this.get(ControlStyle.counterResetProperty); }
    set counterReset(value: string) { this.set(ControlStyle.counterResetProperty, value); }

    static cssFloatProperty = DependencyProperty.register(ControlStyle, "cssFloat");
    get cssFloat(): string | null { return this.get(ControlStyle.cssFloatProperty); }
    set cssFloat(value: string | null) { this.set(ControlStyle.cssFloatProperty, value); }

    static cssTextProperty = DependencyProperty.register(ControlStyle, "cssText");
    get cssText(): string { return this.get(ControlStyle.cssTextProperty); }
    set cssText(value: string) { this.set(ControlStyle.cssTextProperty, value); }

    static cursorProperty = DependencyProperty.register(ControlStyle, "cursor");
    get cursor(): string { return this.get(ControlStyle.cursorProperty); }
    set cursor(value: string) { this.set(ControlStyle.cursorProperty, value); }

    static directionProperty = DependencyProperty.register(ControlStyle, "direction");
    get direction(): string { return this.get(ControlStyle.directionProperty); }
    set direction(value: string) { this.set(ControlStyle.directionProperty, value); }

    static displayProperty = DependencyProperty.register(ControlStyle, "display");
    get display(): string { return this.get(ControlStyle.displayProperty); }
    set display(value: string) { this.set(ControlStyle.displayProperty, value); }

    static dominantBaselineProperty = DependencyProperty.register(ControlStyle, "dominantBaseline");
    get dominantBaseline(): string { return this.get(ControlStyle.dominantBaselineProperty); }
    set dominantBaseline(value: string) { this.set(ControlStyle.dominantBaselineProperty, value); }

    static emptyCellsProperty = DependencyProperty.register(ControlStyle, "emptyCells");
    get emptyCells(): string { return this.get(ControlStyle.emptyCellsProperty); }
    set emptyCells(value: string) { this.set(ControlStyle.emptyCellsProperty, value); }

    static enableBackgroundProperty = DependencyProperty.register(ControlStyle, "enableBackground");
    get enableBackground(): string | null { return this.get(ControlStyle.enableBackgroundProperty); }
    set enableBackground(value: string | null) { this.set(ControlStyle.enableBackgroundProperty, value); }

    static fillProperty = DependencyProperty.register(ControlStyle, "fill");
    get fill(): string { return this.get(ControlStyle.fillProperty); }
    set fill(value: string) { this.set(ControlStyle.fillProperty, value); }

    static fillOpacityProperty = DependencyProperty.register(ControlStyle, "fillOpacity");
    get fillOpacity(): string { return this.get(ControlStyle.fillOpacityProperty); }
    set fillOpacity(value: string) { this.set(ControlStyle.fillOpacityProperty, value); }

    static fillRuleProperty = DependencyProperty.register(ControlStyle, "fillRule");
    get fillRule(): string { return this.get(ControlStyle.fillRuleProperty); }
    set fillRule(value: string) { this.set(ControlStyle.fillRuleProperty, value); }

    static filterProperty = DependencyProperty.register(ControlStyle, "filter");
    get filter(): string { return this.get(ControlStyle.filterProperty); }
    set filter(value: string) { this.set(ControlStyle.filterProperty, value); }

    static flexProperty = DependencyProperty.register(ControlStyle, "flex");
    get flex(): string { return this.get(ControlStyle.flexProperty); }
    set flex(value: string) { this.set(ControlStyle.flexProperty, value); }

    static flexBasisProperty = DependencyProperty.register(ControlStyle, "flexBasis");
    get flexBasis(): string { return this.get(ControlStyle.flexBasisProperty); }
    set flexBasis(value: string) { this.set(ControlStyle.flexBasisProperty, value); }

    static flexDirectionProperty = DependencyProperty.register(ControlStyle, "flexDirection");
    get flexDirection(): string { return this.get(ControlStyle.flexDirectionProperty); }
    set flexDirection(value: string) { this.set(ControlStyle.flexDirectionProperty, value); }

    static flexFlowProperty = DependencyProperty.register(ControlStyle, "flexFlow");
    get flexFlow(): string { return this.get(ControlStyle.flexFlowProperty); }
    set flexFlow(value: string) { this.set(ControlStyle.flexFlowProperty, value); }

    static flexGrowProperty = DependencyProperty.register(ControlStyle, "flexGrow");
    get flexGrow(): string { return this.get(ControlStyle.flexGrowProperty); }
    set flexGrow(value: string) { this.set(ControlStyle.flexGrowProperty, value); }

    static flexShrinkProperty = DependencyProperty.register(ControlStyle, "flexShrink");
    get flexShrink(): string { return this.get(ControlStyle.flexShrinkProperty); }
    set flexShrink(value: string) { this.set(ControlStyle.flexShrinkProperty, value); }

    static flexWrapProperty = DependencyProperty.register(ControlStyle, "flexWrap");
    get flexWrap(): string { return this.get(ControlStyle.flexWrapProperty); }
    set flexWrap(value: string) { this.set(ControlStyle.flexWrapProperty, value); }

    static floatProperty = DependencyProperty.register(ControlStyle, "float");
    get float(): string { return this.get(ControlStyle.floatProperty); }
    set float(value: string) { this.set(ControlStyle.floatProperty, value); }

    static floodColorProperty = DependencyProperty.register(ControlStyle, "floodColor");
    get floodColor(): string { return this.get(ControlStyle.floodColorProperty); }
    set floodColor(value: string) { this.set(ControlStyle.floodColorProperty, value); }

    static floodOpacityProperty = DependencyProperty.register(ControlStyle, "floodOpacity");
    get floodOpacity(): string { return this.get(ControlStyle.floodOpacityProperty); }
    set floodOpacity(value: string) { this.set(ControlStyle.floodOpacityProperty, value); }

    static fontProperty = DependencyProperty.register(ControlStyle, "font");
    get font(): string { return this.get(ControlStyle.fontProperty); }
    set font(value: string) { this.set(ControlStyle.fontProperty, value); }

    static fontFamilyProperty = DependencyProperty.register(ControlStyle, "fontFamily");
    get fontFamily(): string { return this.get(ControlStyle.fontFamilyProperty); }
    set fontFamily(value: string) { this.set(ControlStyle.fontFamilyProperty, value); }

    static fontFeatureSettingsProperty = DependencyProperty.register(ControlStyle, "fontFeatureSettings");
    get fontFeatureSettings(): string { return this.get(ControlStyle.fontFeatureSettingsProperty); }
    set fontFeatureSettings(value: string) { this.set(ControlStyle.fontFeatureSettingsProperty, value); }

    static fontKerningProperty = DependencyProperty.register(ControlStyle, "fontKerning");
    get fontKerning(): string { return this.get(ControlStyle.fontKerningProperty); }
    set fontKerning(value: string) { this.set(ControlStyle.fontKerningProperty, value); }

    static fontSizeProperty = DependencyProperty.register(ControlStyle, "fontSize");
    get fontSize(): string { return this.get(ControlStyle.fontSizeProperty); }
    set fontSize(value: string) { this.set(ControlStyle.fontSizeProperty, value); }

    static fontSizeAdjustProperty = DependencyProperty.register(ControlStyle, "fontSizeAdjust");
    get fontSizeAdjust(): string { return this.get(ControlStyle.fontSizeAdjustProperty); }
    set fontSizeAdjust(value: string) { this.set(ControlStyle.fontSizeAdjustProperty, value); }

    static fontStretchProperty = DependencyProperty.register(ControlStyle, "fontStretch");
    get fontStretch(): string { return this.get(ControlStyle.fontStretchProperty); }
    set fontStretch(value: string) { this.set(ControlStyle.fontStretchProperty, value); }

    static fontStyleProperty = DependencyProperty.register(ControlStyle, "fontStyle");
    get fontStyle(): string { return this.get(ControlStyle.fontStyleProperty); }
    set fontStyle(value: string) { this.set(ControlStyle.fontStyleProperty, value); }

    static fontSynthesisProperty = DependencyProperty.register(ControlStyle, "fontSynthesis");
    get fontSynthesis(): string { return this.get(ControlStyle.fontSynthesisProperty); }
    set fontSynthesis(value: string) { this.set(ControlStyle.fontSynthesisProperty, value); }

    static fontVariantProperty = DependencyProperty.register(ControlStyle, "fontVariant");
    get fontVariant(): string { return this.get(ControlStyle.fontVariantProperty); }
    set fontVariant(value: string) { this.set(ControlStyle.fontVariantProperty, value); }

    static fontVariantCapsProperty = DependencyProperty.register(ControlStyle, "fontVariantCaps");
    get fontVariantCaps(): string { return this.get(ControlStyle.fontVariantCapsProperty); }
    set fontVariantCaps(value: string) { this.set(ControlStyle.fontVariantCapsProperty, value); }

    static fontVariantEastAsianProperty = DependencyProperty.register(ControlStyle, "fontVariantEastAsian");
    get fontVariantEastAsian(): string { return this.get(ControlStyle.fontVariantEastAsianProperty); }
    set fontVariantEastAsian(value: string) { this.set(ControlStyle.fontVariantEastAsianProperty, value); }

    static fontVariantLigaturesProperty = DependencyProperty.register(ControlStyle, "fontVariantLigatures");
    get fontVariantLigatures(): string { return this.get(ControlStyle.fontVariantLigaturesProperty); }
    set fontVariantLigatures(value: string) { this.set(ControlStyle.fontVariantLigaturesProperty, value); }

    static fontVariantNumericProperty = DependencyProperty.register(ControlStyle, "fontVariantNumeric");
    get fontVariantNumeric(): string { return this.get(ControlStyle.fontVariantNumericProperty); }
    set fontVariantNumeric(value: string) { this.set(ControlStyle.fontVariantNumericProperty, value); }

    static fontVariantPositionProperty = DependencyProperty.register(ControlStyle, "fontVariantPosition");
    get fontVariantPosition(): string { return this.get(ControlStyle.fontVariantPositionProperty); }
    set fontVariantPosition(value: string) { this.set(ControlStyle.fontVariantPositionProperty, value); }

    static fontWeightProperty = DependencyProperty.register(ControlStyle, "fontWeight");
    get fontWeight(): string { return this.get(ControlStyle.fontWeightProperty); }
    set fontWeight(value: string) { this.set(ControlStyle.fontWeightProperty, value); }

    static gapProperty = DependencyProperty.register(ControlStyle, "gap");
    get gap(): string { return this.get(ControlStyle.gapProperty); }
    set gap(value: string) { this.set(ControlStyle.gapProperty, value); }

    static glyphOrientationHorizontalProperty = DependencyProperty.register(ControlStyle, "glyphOrientationHorizontal");
    get glyphOrientationHorizontal(): string | null { return this.get(ControlStyle.glyphOrientationHorizontalProperty); }
    set glyphOrientationHorizontal(value: string | null) { this.set(ControlStyle.glyphOrientationHorizontalProperty, value); }

    static glyphOrientationVerticalProperty = DependencyProperty.register(ControlStyle, "glyphOrientationVertical");
    get glyphOrientationVertical(): string { return this.get(ControlStyle.glyphOrientationVerticalProperty); }
    set glyphOrientationVertical(value: string) { this.set(ControlStyle.glyphOrientationVerticalProperty, value); }

    static gridProperty = DependencyProperty.register(ControlStyle, "grid");
    get grid(): string { return this.get(ControlStyle.gridProperty); }
    set grid(value: string) { this.set(ControlStyle.gridProperty, value); }

    static gridAreaProperty = DependencyProperty.register(ControlStyle, "gridArea");
    get gridArea(): string { return this.get(ControlStyle.gridAreaProperty); }
    set gridArea(value: string) { this.set(ControlStyle.gridAreaProperty, value); }

    static gridAutoColumnsProperty = DependencyProperty.register(ControlStyle, "gridAutoColumns");
    get gridAutoColumns(): string { return this.get(ControlStyle.gridAutoColumnsProperty); }
    set gridAutoColumns(value: string) { this.set(ControlStyle.gridAutoColumnsProperty, value); }

    static gridAutoFlowProperty = DependencyProperty.register(ControlStyle, "gridAutoFlow");
    get gridAutoFlow(): string { return this.get(ControlStyle.gridAutoFlowProperty); }
    set gridAutoFlow(value: string) { this.set(ControlStyle.gridAutoFlowProperty, value); }

    static gridAutoRowsProperty = DependencyProperty.register(ControlStyle, "gridAutoRows");
    get gridAutoRows(): string { return this.get(ControlStyle.gridAutoRowsProperty); }
    set gridAutoRows(value: string) { this.set(ControlStyle.gridAutoRowsProperty, value); }

    static gridColumnProperty = DependencyProperty.register(ControlStyle, "gridColumn");
    get gridColumn(): string { return this.get(ControlStyle.gridColumnProperty); }
    set gridColumn(value: string) { this.set(ControlStyle.gridColumnProperty, value); }

    static gridColumnEndProperty = DependencyProperty.register(ControlStyle, "gridColumnEnd");
    get gridColumnEnd(): string { return this.get(ControlStyle.gridColumnEndProperty); }
    set gridColumnEnd(value: string) { this.set(ControlStyle.gridColumnEndProperty, value); }

    static gridColumnGapProperty = DependencyProperty.register(ControlStyle, "gridColumnGap");
    get gridColumnGap(): string { return this.get(ControlStyle.gridColumnGapProperty); }
    set gridColumnGap(value: string) { this.set(ControlStyle.gridColumnGapProperty, value); }

    static gridColumnStartProperty = DependencyProperty.register(ControlStyle, "gridColumnStart");
    get gridColumnStart(): string { return this.get(ControlStyle.gridColumnStartProperty); }
    set gridColumnStart(value: string) { this.set(ControlStyle.gridColumnStartProperty, value); }

    static gridGapProperty = DependencyProperty.register(ControlStyle, "gridGap");
    get gridGap(): string { return this.get(ControlStyle.gridGapProperty); }
    set gridGap(value: string) { this.set(ControlStyle.gridGapProperty, value); }

    static gridRowProperty = DependencyProperty.register(ControlStyle, "gridRow");
    get gridRow(): string { return this.get(ControlStyle.gridRowProperty); }
    set gridRow(value: string) { this.set(ControlStyle.gridRowProperty, value); }

    static gridRowEndProperty = DependencyProperty.register(ControlStyle, "gridRowEnd");
    get gridRowEnd(): string { return this.get(ControlStyle.gridRowEndProperty); }
    set gridRowEnd(value: string) { this.set(ControlStyle.gridRowEndProperty, value); }

    static gridRowGapProperty = DependencyProperty.register(ControlStyle, "gridRowGap");
    get gridRowGap(): string { return this.get(ControlStyle.gridRowGapProperty); }
    set gridRowGap(value: string) { this.set(ControlStyle.gridRowGapProperty, value); }

    static gridRowStartProperty = DependencyProperty.register(ControlStyle, "gridRowStart");
    get gridRowStart(): string { return this.get(ControlStyle.gridRowStartProperty); }
    set gridRowStart(value: string) { this.set(ControlStyle.gridRowStartProperty, value); }

    static gridTemplateProperty = DependencyProperty.register(ControlStyle, "gridTemplate");
    get gridTemplate(): string { return this.get(ControlStyle.gridTemplateProperty); }
    set gridTemplate(value: string) { this.set(ControlStyle.gridTemplateProperty, value); }

    static gridTemplateAreasProperty = DependencyProperty.register(ControlStyle, "gridTemplateAreas");
    get gridTemplateAreas(): string { return this.get(ControlStyle.gridTemplateAreasProperty); }
    set gridTemplateAreas(value: string) { this.set(ControlStyle.gridTemplateAreasProperty, value); }

    static gridTemplateColumnsProperty = DependencyProperty.register(ControlStyle, "gridTemplateColumns");
    get gridTemplateColumns(): string { return this.get(ControlStyle.gridTemplateColumnsProperty); }
    set gridTemplateColumns(value: string) { this.set(ControlStyle.gridTemplateColumnsProperty, value); }

    static gridTemplateRowsProperty = DependencyProperty.register(ControlStyle, "gridTemplateRows");
    get gridTemplateRows(): string { return this.get(ControlStyle.gridTemplateRowsProperty); }
    set gridTemplateRows(value: string) { this.set(ControlStyle.gridTemplateRowsProperty, value); }

    static heightProperty = DependencyProperty.register(ControlStyle, "height");
    get height(): string { return this.get(ControlStyle.heightProperty); }
    set height(value: string) { this.set(ControlStyle.heightProperty, value); }

    static hyphensProperty = DependencyProperty.register(ControlStyle, "hyphens");
    get hyphens(): string { return this.get(ControlStyle.hyphensProperty); }
    set hyphens(value: string) { this.set(ControlStyle.hyphensProperty, value); }

    static imageOrientationProperty = DependencyProperty.register(ControlStyle, "imageOrientation");
    get imageOrientation(): string { return this.get(ControlStyle.imageOrientationProperty); }
    set imageOrientation(value: string) { this.set(ControlStyle.imageOrientationProperty, value); }

    static imageRenderingProperty = DependencyProperty.register(ControlStyle, "imageRendering");
    get imageRendering(): string { return this.get(ControlStyle.imageRenderingProperty); }
    set imageRendering(value: string) { this.set(ControlStyle.imageRenderingProperty, value); }

    static imeModeProperty = DependencyProperty.register(ControlStyle, "imeMode");
    get imeMode(): string | null { return this.get(ControlStyle.imeModeProperty); }
    set imeMode(value: string | null) { this.set(ControlStyle.imeModeProperty, value); }

    static inlineSizeProperty = DependencyProperty.register(ControlStyle, "inlineSize");
    get inlineSize(): string { return this.get(ControlStyle.inlineSizeProperty); }
    set inlineSize(value: string) { this.set(ControlStyle.inlineSizeProperty, value); }

    static justifyContentProperty = DependencyProperty.register(ControlStyle, "justifyContent");
    get justifyContent(): string { return this.get(ControlStyle.justifyContentProperty); }
    set justifyContent(value: string) { this.set(ControlStyle.justifyContentProperty, value); }

    static justifyItemsProperty = DependencyProperty.register(ControlStyle, "justifyItems");
    get justifyItems(): string { return this.get(ControlStyle.justifyItemsProperty); }
    set justifyItems(value: string) { this.set(ControlStyle.justifyItemsProperty, value); }

    static justifySelfProperty = DependencyProperty.register(ControlStyle, "justifySelf");
    get justifySelf(): string { return this.get(ControlStyle.justifySelfProperty); }
    set justifySelf(value: string) { this.set(ControlStyle.justifySelfProperty, value); }

    static kerningProperty = DependencyProperty.register(ControlStyle, "kerning");
    get kerning(): string | null { return this.get(ControlStyle.kerningProperty); }
    set kerning(value: string | null) { this.set(ControlStyle.kerningProperty, value); }

    static layoutGridProperty = DependencyProperty.register(ControlStyle, "layoutGrid");
    get layoutGrid(): string | null { return this.get(ControlStyle.layoutGridProperty); }
    set layoutGrid(value: string | null) { this.set(ControlStyle.layoutGridProperty, value); }

    static layoutGridCharProperty = DependencyProperty.register(ControlStyle, "layoutGridChar");
    get layoutGridChar(): string | null { return this.get(ControlStyle.layoutGridCharProperty); }
    set layoutGridChar(value: string | null) { this.set(ControlStyle.layoutGridCharProperty, value); }

    static layoutGridLineProperty = DependencyProperty.register(ControlStyle, "layoutGridLine");
    get layoutGridLine(): string | null { return this.get(ControlStyle.layoutGridLineProperty); }
    set layoutGridLine(value: string | null) { this.set(ControlStyle.layoutGridLineProperty, value); }

    static layoutGridModeProperty = DependencyProperty.register(ControlStyle, "layoutGridMode");
    get layoutGridMode(): string | null { return this.get(ControlStyle.layoutGridModeProperty); }
    set layoutGridMode(value: string | null) { this.set(ControlStyle.layoutGridModeProperty, value); }

    static layoutGridTypeProperty = DependencyProperty.register(ControlStyle, "layoutGridType");
    get layoutGridType(): string | null { return this.get(ControlStyle.layoutGridTypeProperty); }
    set layoutGridType(value: string | null) { this.set(ControlStyle.layoutGridTypeProperty, value); }

    static leftProperty = DependencyProperty.register(ControlStyle, "left");
    get left(): string { return this.get(ControlStyle.leftProperty); }
    set left(value: string) { this.set(ControlStyle.leftProperty, value); }

    static lengthProperty = DependencyProperty.register(ControlStyle, "length");
    get length(): number { return this.get(ControlStyle.lengthProperty); }
    set length(value: number) { this.set(ControlStyle.lengthProperty, value); }

    static letterSpacingProperty = DependencyProperty.register(ControlStyle, "letterSpacing");
    get letterSpacing(): string { return this.get(ControlStyle.letterSpacingProperty); }
    set letterSpacing(value: string) { this.set(ControlStyle.letterSpacingProperty, value); }

    static lightingColorProperty = DependencyProperty.register(ControlStyle, "lightingColor");
    get lightingColor(): string { return this.get(ControlStyle.lightingColorProperty); }
    set lightingColor(value: string) { this.set(ControlStyle.lightingColorProperty, value); }

    static lineBreakProperty = DependencyProperty.register(ControlStyle, "lineBreak");
    get lineBreak(): string { return this.get(ControlStyle.lineBreakProperty); }
    set lineBreak(value: string) { this.set(ControlStyle.lineBreakProperty, value); }

    static lineHeightProperty = DependencyProperty.register(ControlStyle, "lineHeight");
    get lineHeight(): string { return this.get(ControlStyle.lineHeightProperty); }
    set lineHeight(value: string) { this.set(ControlStyle.lineHeightProperty, value); }

    static listStyleProperty = DependencyProperty.register(ControlStyle, "listStyle");
    get listStyle(): string { return this.get(ControlStyle.listStyleProperty); }
    set listStyle(value: string) { this.set(ControlStyle.listStyleProperty, value); }

    static listStyleImageProperty = DependencyProperty.register(ControlStyle, "listStyleImage");
    get listStyleImage(): string { return this.get(ControlStyle.listStyleImageProperty); }
    set listStyleImage(value: string) { this.set(ControlStyle.listStyleImageProperty, value); }

    static listStylePositionProperty = DependencyProperty.register(ControlStyle, "listStylePosition");
    get listStylePosition(): string { return this.get(ControlStyle.listStylePositionProperty); }
    set listStylePosition(value: string) { this.set(ControlStyle.listStylePositionProperty, value); }

    static listStyleTypeProperty = DependencyProperty.register(ControlStyle, "listStyleType");
    get listStyleType(): string { return this.get(ControlStyle.listStyleTypeProperty); }
    set listStyleType(value: string) { this.set(ControlStyle.listStyleTypeProperty, value); }

    static marginProperty = DependencyProperty.register(ControlStyle, "margin");
    get margin(): string { return this.get(ControlStyle.marginProperty); }
    set margin(value: string) { this.set(ControlStyle.marginProperty, value); }

    static marginBlockEndProperty = DependencyProperty.register(ControlStyle, "marginBlockEnd");
    get marginBlockEnd(): string { return this.get(ControlStyle.marginBlockEndProperty); }
    set marginBlockEnd(value: string) { this.set(ControlStyle.marginBlockEndProperty, value); }

    static marginBlockStartProperty = DependencyProperty.register(ControlStyle, "marginBlockStart");
    get marginBlockStart(): string { return this.get(ControlStyle.marginBlockStartProperty); }
    set marginBlockStart(value: string) { this.set(ControlStyle.marginBlockStartProperty, value); }

    static marginBottomProperty = DependencyProperty.register(ControlStyle, "marginBottom");
    get marginBottom(): string { return this.get(ControlStyle.marginBottomProperty); }
    set marginBottom(value: string) { this.set(ControlStyle.marginBottomProperty, value); }

    static marginInlineEndProperty = DependencyProperty.register(ControlStyle, "marginInlineEnd");
    get marginInlineEnd(): string { return this.get(ControlStyle.marginInlineEndProperty); }
    set marginInlineEnd(value: string) { this.set(ControlStyle.marginInlineEndProperty, value); }

    static marginInlineStartProperty = DependencyProperty.register(ControlStyle, "marginInlineStart");
    get marginInlineStart(): string { return this.get(ControlStyle.marginInlineStartProperty); }
    set marginInlineStart(value: string) { this.set(ControlStyle.marginInlineStartProperty, value); }

    static marginLeftProperty = DependencyProperty.register(ControlStyle, "marginLeft");
    get marginLeft(): string { return this.get(ControlStyle.marginLeftProperty); }
    set marginLeft(value: string) { this.set(ControlStyle.marginLeftProperty, value); }

    static marginRightProperty = DependencyProperty.register(ControlStyle, "marginRight");
    get marginRight(): string { return this.get(ControlStyle.marginRightProperty); }
    set marginRight(value: string) { this.set(ControlStyle.marginRightProperty, value); }

    static marginTopProperty = DependencyProperty.register(ControlStyle, "marginTop");
    get marginTop(): string { return this.get(ControlStyle.marginTopProperty); }
    set marginTop(value: string) { this.set(ControlStyle.marginTopProperty, value); }

    static markerProperty = DependencyProperty.register(ControlStyle, "marker");
    get marker(): string { return this.get(ControlStyle.markerProperty); }
    set marker(value: string) { this.set(ControlStyle.markerProperty, value); }

    static markerEndProperty = DependencyProperty.register(ControlStyle, "markerEnd");
    get markerEnd(): string { return this.get(ControlStyle.markerEndProperty); }
    set markerEnd(value: string) { this.set(ControlStyle.markerEndProperty, value); }

    static markerMidProperty = DependencyProperty.register(ControlStyle, "markerMid");
    get markerMid(): string { return this.get(ControlStyle.markerMidProperty); }
    set markerMid(value: string) { this.set(ControlStyle.markerMidProperty, value); }

    static markerStartProperty = DependencyProperty.register(ControlStyle, "markerStart");
    get markerStart(): string { return this.get(ControlStyle.markerStartProperty); }
    set markerStart(value: string) { this.set(ControlStyle.markerStartProperty, value); }

    static maskProperty = DependencyProperty.register(ControlStyle, "mask");
    get mask(): string { return this.get(ControlStyle.maskProperty); }
    set mask(value: string) { this.set(ControlStyle.maskProperty, value); }

    static maskCompositeProperty = DependencyProperty.register(ControlStyle, "maskComposite");
    get maskComposite(): string { return this.get(ControlStyle.maskCompositeProperty); }
    set maskComposite(value: string) { this.set(ControlStyle.maskCompositeProperty, value); }

    static maskImageProperty = DependencyProperty.register(ControlStyle, "maskImage");
    get maskImage(): string { return this.get(ControlStyle.maskImageProperty); }
    set maskImage(value: string) { this.set(ControlStyle.maskImageProperty, value); }

    static maskPositionProperty = DependencyProperty.register(ControlStyle, "maskPosition");
    get maskPosition(): string { return this.get(ControlStyle.maskPositionProperty); }
    set maskPosition(value: string) { this.set(ControlStyle.maskPositionProperty, value); }

    static maskRepeatProperty = DependencyProperty.register(ControlStyle, "maskRepeat");
    get maskRepeat(): string { return this.get(ControlStyle.maskRepeatProperty); }
    set maskRepeat(value: string) { this.set(ControlStyle.maskRepeatProperty, value); }

    static maskSizeProperty = DependencyProperty.register(ControlStyle, "maskSize");
    get maskSize(): string { return this.get(ControlStyle.maskSizeProperty); }
    set maskSize(value: string) { this.set(ControlStyle.maskSizeProperty, value); }

    static maskTypeProperty = DependencyProperty.register(ControlStyle, "maskType");
    get maskType(): string { return this.get(ControlStyle.maskTypeProperty); }
    set maskType(value: string) { this.set(ControlStyle.maskTypeProperty, value); }

    static maxBlockSizeProperty = DependencyProperty.register(ControlStyle, "maxBlockSize");
    get maxBlockSize(): string { return this.get(ControlStyle.maxBlockSizeProperty); }
    set maxBlockSize(value: string) { this.set(ControlStyle.maxBlockSizeProperty, value); }

    static maxHeightProperty = DependencyProperty.register(ControlStyle, "maxHeight");
    get maxHeight(): string { return this.get(ControlStyle.maxHeightProperty); }
    set maxHeight(value: string) { this.set(ControlStyle.maxHeightProperty, value); }

    static maxInlineSizeProperty = DependencyProperty.register(ControlStyle, "maxInlineSize");
    get maxInlineSize(): string { return this.get(ControlStyle.maxInlineSizeProperty); }
    set maxInlineSize(value: string) { this.set(ControlStyle.maxInlineSizeProperty, value); }

    static maxWidthProperty = DependencyProperty.register(ControlStyle, "maxWidth");
    get maxWidth(): string { return this.get(ControlStyle.maxWidthProperty); }
    set maxWidth(value: string) { this.set(ControlStyle.maxWidthProperty, value); }

    static minBlockSizeProperty = DependencyProperty.register(ControlStyle, "minBlockSize");
    get minBlockSize(): string { return this.get(ControlStyle.minBlockSizeProperty); }
    set minBlockSize(value: string) { this.set(ControlStyle.minBlockSizeProperty, value); }

    static minHeightProperty = DependencyProperty.register(ControlStyle, "minHeight");
    get minHeight(): string { return this.get(ControlStyle.minHeightProperty); }
    set minHeight(value: string) { this.set(ControlStyle.minHeightProperty, value); }

    static minInlineSizeProperty = DependencyProperty.register(ControlStyle, "minInlineSize");
    get minInlineSize(): string { return this.get(ControlStyle.minInlineSizeProperty); }
    set minInlineSize(value: string) { this.set(ControlStyle.minInlineSizeProperty, value); }

    static minWidthProperty = DependencyProperty.register(ControlStyle, "minWidth");
    get minWidth(): string { return this.get(ControlStyle.minWidthProperty); }
    set minWidth(value: string) { this.set(ControlStyle.minWidthProperty, value); }

    static msContentZoomChainingProperty = DependencyProperty.register(ControlStyle, "msContentZoomChaining");
    get msContentZoomChaining(): string | null { return this.get(ControlStyle.msContentZoomChainingProperty); }
    set msContentZoomChaining(value: string | null) { this.set(ControlStyle.msContentZoomChainingProperty, value); }

    static msContentZoomLimitProperty = DependencyProperty.register(ControlStyle, "msContentZoomLimit");
    get msContentZoomLimit(): string | null { return this.get(ControlStyle.msContentZoomLimitProperty); }
    set msContentZoomLimit(value: string | null) { this.set(ControlStyle.msContentZoomLimitProperty, value); }

    static msContentZoomLimitMaxProperty = DependencyProperty.register(ControlStyle, "msContentZoomLimitMax");
    get msContentZoomLimitMax(): any { return this.get(ControlStyle.msContentZoomLimitMaxProperty); }
    set msContentZoomLimitMax(value: any) { this.set(ControlStyle.msContentZoomLimitMaxProperty, value); }

    static msContentZoomLimitMinProperty = DependencyProperty.register(ControlStyle, "msContentZoomLimitMin");
    get msContentZoomLimitMin(): any { return this.get(ControlStyle.msContentZoomLimitMinProperty); }
    set msContentZoomLimitMin(value: any) { this.set(ControlStyle.msContentZoomLimitMinProperty, value); }

    static msContentZoomSnapProperty = DependencyProperty.register(ControlStyle, "msContentZoomSnap");
    get msContentZoomSnap(): string | null { return this.get(ControlStyle.msContentZoomSnapProperty); }
    set msContentZoomSnap(value: string | null) { this.set(ControlStyle.msContentZoomSnapProperty, value); }

    static msContentZoomSnapPointsProperty = DependencyProperty.register(ControlStyle, "msContentZoomSnapPoints");
    get msContentZoomSnapPoints(): string | null { return this.get(ControlStyle.msContentZoomSnapPointsProperty); }
    set msContentZoomSnapPoints(value: string | null) { this.set(ControlStyle.msContentZoomSnapPointsProperty, value); }

    static msContentZoomSnapTypeProperty = DependencyProperty.register(ControlStyle, "msContentZoomSnapType");
    get msContentZoomSnapType(): string | null { return this.get(ControlStyle.msContentZoomSnapTypeProperty); }
    set msContentZoomSnapType(value: string | null) { this.set(ControlStyle.msContentZoomSnapTypeProperty, value); }

    static msContentZoomingProperty = DependencyProperty.register(ControlStyle, "msContentZooming");
    get msContentZooming(): string | null { return this.get(ControlStyle.msContentZoomingProperty); }
    set msContentZooming(value: string | null) { this.set(ControlStyle.msContentZoomingProperty, value); }

    static msFlowFromProperty = DependencyProperty.register(ControlStyle, "msFlowFrom");
    get msFlowFrom(): string | null { return this.get(ControlStyle.msFlowFromProperty); }
    set msFlowFrom(value: string | null) { this.set(ControlStyle.msFlowFromProperty, value); }

    static msFlowIntoProperty = DependencyProperty.register(ControlStyle, "msFlowInto");
    get msFlowInto(): string | null { return this.get(ControlStyle.msFlowIntoProperty); }
    set msFlowInto(value: string | null) { this.set(ControlStyle.msFlowIntoProperty, value); }

    static msFontFeatureSettingsProperty = DependencyProperty.register(ControlStyle, "msFontFeatureSettings");
    get msFontFeatureSettings(): string | null { return this.get(ControlStyle.msFontFeatureSettingsProperty); }
    set msFontFeatureSettings(value: string | null) { this.set(ControlStyle.msFontFeatureSettingsProperty, value); }

    static msGridColumnProperty = DependencyProperty.register(ControlStyle, "msGridColumn");
    get msGridColumn(): any { return this.get(ControlStyle.msGridColumnProperty); }
    set msGridColumn(value: any) { this.set(ControlStyle.msGridColumnProperty, value); }

    static msGridColumnAlignProperty = DependencyProperty.register(ControlStyle, "msGridColumnAlign");
    get msGridColumnAlign(): string | null { return this.get(ControlStyle.msGridColumnAlignProperty); }
    set msGridColumnAlign(value: string | null) { this.set(ControlStyle.msGridColumnAlignProperty, value); }

    static msGridColumnSpanProperty = DependencyProperty.register(ControlStyle, "msGridColumnSpan");
    get msGridColumnSpan(): any { return this.get(ControlStyle.msGridColumnSpanProperty); }
    set msGridColumnSpan(value: any) { this.set(ControlStyle.msGridColumnSpanProperty, value); }

    static msGridColumnsProperty = DependencyProperty.register(ControlStyle, "msGridColumns");
    get msGridColumns(): string | null { return this.get(ControlStyle.msGridColumnsProperty); }
    set msGridColumns(value: string | null) { this.set(ControlStyle.msGridColumnsProperty, value); }

    static msGridRowProperty = DependencyProperty.register(ControlStyle, "msGridRow");
    get msGridRow(): any { return this.get(ControlStyle.msGridRowProperty); }
    set msGridRow(value: any) { this.set(ControlStyle.msGridRowProperty, value); }

    static msGridRowAlignProperty = DependencyProperty.register(ControlStyle, "msGridRowAlign");
    get msGridRowAlign(): string | null { return this.get(ControlStyle.msGridRowAlignProperty); }
    set msGridRowAlign(value: string | null) { this.set(ControlStyle.msGridRowAlignProperty, value); }

    static msGridRowSpanProperty = DependencyProperty.register(ControlStyle, "msGridRowSpan");
    get msGridRowSpan(): any { return this.get(ControlStyle.msGridRowSpanProperty); }
    set msGridRowSpan(value: any) { this.set(ControlStyle.msGridRowSpanProperty, value); }

    static msGridRowsProperty = DependencyProperty.register(ControlStyle, "msGridRows");
    get msGridRows(): string | null { return this.get(ControlStyle.msGridRowsProperty); }
    set msGridRows(value: string | null) { this.set(ControlStyle.msGridRowsProperty, value); }

    static msHighContrastAdjustProperty = DependencyProperty.register(ControlStyle, "msHighContrastAdjust");
    get msHighContrastAdjust(): string | null { return this.get(ControlStyle.msHighContrastAdjustProperty); }
    set msHighContrastAdjust(value: string | null) { this.set(ControlStyle.msHighContrastAdjustProperty, value); }

    static msHyphenateLimitCharsProperty = DependencyProperty.register(ControlStyle, "msHyphenateLimitChars");
    get msHyphenateLimitChars(): string | null { return this.get(ControlStyle.msHyphenateLimitCharsProperty); }
    set msHyphenateLimitChars(value: string | null) { this.set(ControlStyle.msHyphenateLimitCharsProperty, value); }

    static msHyphenateLimitLinesProperty = DependencyProperty.register(ControlStyle, "msHyphenateLimitLines");
    get msHyphenateLimitLines(): any { return this.get(ControlStyle.msHyphenateLimitLinesProperty); }
    set msHyphenateLimitLines(value: any) { this.set(ControlStyle.msHyphenateLimitLinesProperty, value); }

    static msHyphenateLimitZoneProperty = DependencyProperty.register(ControlStyle, "msHyphenateLimitZone");
    get msHyphenateLimitZone(): any { return this.get(ControlStyle.msHyphenateLimitZoneProperty); }
    set msHyphenateLimitZone(value: any) { this.set(ControlStyle.msHyphenateLimitZoneProperty, value); }

    static msHyphensProperty = DependencyProperty.register(ControlStyle, "msHyphens");
    get msHyphens(): string | null { return this.get(ControlStyle.msHyphensProperty); }
    set msHyphens(value: string | null) { this.set(ControlStyle.msHyphensProperty, value); }

    static msImeAlignProperty = DependencyProperty.register(ControlStyle, "msImeAlign");
    get msImeAlign(): string | null { return this.get(ControlStyle.msImeAlignProperty); }
    set msImeAlign(value: string | null) { this.set(ControlStyle.msImeAlignProperty, value); }

    static msOverflowStyleProperty = DependencyProperty.register(ControlStyle, "msOverflowStyle");
    get msOverflowStyle(): string | null { return this.get(ControlStyle.msOverflowStyleProperty); }
    set msOverflowStyle(value: string | null) { this.set(ControlStyle.msOverflowStyleProperty, value); }

    static msScrollChainingProperty = DependencyProperty.register(ControlStyle, "msScrollChaining");
    get msScrollChaining(): string | null { return this.get(ControlStyle.msScrollChainingProperty); }
    set msScrollChaining(value: string | null) { this.set(ControlStyle.msScrollChainingProperty, value); }

    static msScrollLimitProperty = DependencyProperty.register(ControlStyle, "msScrollLimit");
    get msScrollLimit(): string | null { return this.get(ControlStyle.msScrollLimitProperty); }
    set msScrollLimit(value: string | null) { this.set(ControlStyle.msScrollLimitProperty, value); }

    static msScrollLimitXMaxProperty = DependencyProperty.register(ControlStyle, "msScrollLimitXMax");
    get msScrollLimitXMax(): any { return this.get(ControlStyle.msScrollLimitXMaxProperty); }
    set msScrollLimitXMax(value: any) { this.set(ControlStyle.msScrollLimitXMaxProperty, value); }

    static msScrollLimitXMinProperty = DependencyProperty.register(ControlStyle, "msScrollLimitXMin");
    get msScrollLimitXMin(): any { return this.get(ControlStyle.msScrollLimitXMinProperty); }
    set msScrollLimitXMin(value: any) { this.set(ControlStyle.msScrollLimitXMinProperty, value); }

    static msScrollLimitYMaxProperty = DependencyProperty.register(ControlStyle, "msScrollLimitYMax");
    get msScrollLimitYMax(): any { return this.get(ControlStyle.msScrollLimitYMaxProperty); }
    set msScrollLimitYMax(value: any) { this.set(ControlStyle.msScrollLimitYMaxProperty, value); }

    static msScrollLimitYMinProperty = DependencyProperty.register(ControlStyle, "msScrollLimitYMin");
    get msScrollLimitYMin(): any { return this.get(ControlStyle.msScrollLimitYMinProperty); }
    set msScrollLimitYMin(value: any) { this.set(ControlStyle.msScrollLimitYMinProperty, value); }

    static msScrollRailsProperty = DependencyProperty.register(ControlStyle, "msScrollRails");
    get msScrollRails(): string | null { return this.get(ControlStyle.msScrollRailsProperty); }
    set msScrollRails(value: string | null) { this.set(ControlStyle.msScrollRailsProperty, value); }

    static msScrollSnapPointsXProperty = DependencyProperty.register(ControlStyle, "msScrollSnapPointsX");
    get msScrollSnapPointsX(): string | null { return this.get(ControlStyle.msScrollSnapPointsXProperty); }
    set msScrollSnapPointsX(value: string | null) { this.set(ControlStyle.msScrollSnapPointsXProperty, value); }

    static msScrollSnapPointsYProperty = DependencyProperty.register(ControlStyle, "msScrollSnapPointsY");
    get msScrollSnapPointsY(): string | null { return this.get(ControlStyle.msScrollSnapPointsYProperty); }
    set msScrollSnapPointsY(value: string | null) { this.set(ControlStyle.msScrollSnapPointsYProperty, value); }

    static msScrollSnapTypeProperty = DependencyProperty.register(ControlStyle, "msScrollSnapType");
    get msScrollSnapType(): string | null { return this.get(ControlStyle.msScrollSnapTypeProperty); }
    set msScrollSnapType(value: string | null) { this.set(ControlStyle.msScrollSnapTypeProperty, value); }

    static msScrollSnapXProperty = DependencyProperty.register(ControlStyle, "msScrollSnapX");
    get msScrollSnapX(): string | null { return this.get(ControlStyle.msScrollSnapXProperty); }
    set msScrollSnapX(value: string | null) { this.set(ControlStyle.msScrollSnapXProperty, value); }

    static msScrollSnapYProperty = DependencyProperty.register(ControlStyle, "msScrollSnapY");
    get msScrollSnapY(): string | null { return this.get(ControlStyle.msScrollSnapYProperty); }
    set msScrollSnapY(value: string | null) { this.set(ControlStyle.msScrollSnapYProperty, value); }

    static msScrollTranslationProperty = DependencyProperty.register(ControlStyle, "msScrollTranslation");
    get msScrollTranslation(): string | null { return this.get(ControlStyle.msScrollTranslationProperty); }
    set msScrollTranslation(value: string | null) { this.set(ControlStyle.msScrollTranslationProperty, value); }

    static msTextCombineHorizontalProperty = DependencyProperty.register(ControlStyle, "msTextCombineHorizontal");
    get msTextCombineHorizontal(): string | null { return this.get(ControlStyle.msTextCombineHorizontalProperty); }
    set msTextCombineHorizontal(value: string | null) { this.set(ControlStyle.msTextCombineHorizontalProperty, value); }

    static msTextSizeAdjustProperty = DependencyProperty.register(ControlStyle, "msTextSizeAdjust");
    get msTextSizeAdjust(): any { return this.get(ControlStyle.msTextSizeAdjustProperty); }
    set msTextSizeAdjust(value: any) { this.set(ControlStyle.msTextSizeAdjustProperty, value); }

    static msTouchActionProperty = DependencyProperty.register(ControlStyle, "msTouchAction");
    get msTouchAction(): string | null { return this.get(ControlStyle.msTouchActionProperty); }
    set msTouchAction(value: string | null) { this.set(ControlStyle.msTouchActionProperty, value); }

    static msTouchSelectProperty = DependencyProperty.register(ControlStyle, "msTouchSelect");
    get msTouchSelect(): string | null { return this.get(ControlStyle.msTouchSelectProperty); }
    set msTouchSelect(value: string | null) { this.set(ControlStyle.msTouchSelectProperty, value); }

    static msUserSelectProperty = DependencyProperty.register(ControlStyle, "msUserSelect");
    get msUserSelect(): string | null { return this.get(ControlStyle.msUserSelectProperty); }
    set msUserSelect(value: string | null) { this.set(ControlStyle.msUserSelectProperty, value); }

    static msWrapFlowProperty = DependencyProperty.register(ControlStyle, "msWrapFlow");
    get msWrapFlow(): string { return this.get(ControlStyle.msWrapFlowProperty); }
    set msWrapFlow(value: string) { this.set(ControlStyle.msWrapFlowProperty, value); }

    static msWrapMarginProperty = DependencyProperty.register(ControlStyle, "msWrapMargin");
    get msWrapMargin(): any { return this.get(ControlStyle.msWrapMarginProperty); }
    set msWrapMargin(value: any) { this.set(ControlStyle.msWrapMarginProperty, value); }

    static msWrapThroughProperty = DependencyProperty.register(ControlStyle, "msWrapThrough");
    get msWrapThrough(): string { return this.get(ControlStyle.msWrapThroughProperty); }
    set msWrapThrough(value: string) { this.set(ControlStyle.msWrapThroughProperty, value); }

    static objectFitProperty = DependencyProperty.register(ControlStyle, "objectFit");
    get objectFit(): string { return this.get(ControlStyle.objectFitProperty); }
    set objectFit(value: string) { this.set(ControlStyle.objectFitProperty, value); }

    static objectPositionProperty = DependencyProperty.register(ControlStyle, "objectPosition");
    get objectPosition(): string { return this.get(ControlStyle.objectPositionProperty); }
    set objectPosition(value: string) { this.set(ControlStyle.objectPositionProperty, value); }

    static opacityProperty = DependencyProperty.register(ControlStyle, "opacity");
    get opacity(): string { return this.get(ControlStyle.opacityProperty); }
    set opacity(value: string) { this.set(ControlStyle.opacityProperty, value); }

    static orderProperty = DependencyProperty.register(ControlStyle, "order");
    get order(): string { return this.get(ControlStyle.orderProperty); }
    set order(value: string) { this.set(ControlStyle.orderProperty, value); }

    static orphansProperty = DependencyProperty.register(ControlStyle, "orphans");
    get orphans(): string { return this.get(ControlStyle.orphansProperty); }
    set orphans(value: string) { this.set(ControlStyle.orphansProperty, value); }

    static outlineProperty = DependencyProperty.register(ControlStyle, "outline");
    get outline(): string { return this.get(ControlStyle.outlineProperty); }
    set outline(value: string) { this.set(ControlStyle.outlineProperty, value); }

    static outlineColorProperty = DependencyProperty.register(ControlStyle, "outlineColor");
    get outlineColor(): string { return this.get(ControlStyle.outlineColorProperty); }
    set outlineColor(value: string) { this.set(ControlStyle.outlineColorProperty, value); }

    static outlineOffsetProperty = DependencyProperty.register(ControlStyle, "outlineOffset");
    get outlineOffset(): string { return this.get(ControlStyle.outlineOffsetProperty); }
    set outlineOffset(value: string) { this.set(ControlStyle.outlineOffsetProperty, value); }

    static outlineStyleProperty = DependencyProperty.register(ControlStyle, "outlineStyle");
    get outlineStyle(): string { return this.get(ControlStyle.outlineStyleProperty); }
    set outlineStyle(value: string) { this.set(ControlStyle.outlineStyleProperty, value); }

    static outlineWidthProperty = DependencyProperty.register(ControlStyle, "outlineWidth");
    get outlineWidth(): string { return this.get(ControlStyle.outlineWidthProperty); }
    set outlineWidth(value: string) { this.set(ControlStyle.outlineWidthProperty, value); }

    static overflowProperty = DependencyProperty.register(ControlStyle, "overflow");
    get overflow(): string { return this.get(ControlStyle.overflowProperty); }
    set overflow(value: string) { this.set(ControlStyle.overflowProperty, value); }

    static overflowAnchorProperty = DependencyProperty.register(ControlStyle, "overflowAnchor");
    get overflowAnchor(): string { return this.get(ControlStyle.overflowAnchorProperty); }
    set overflowAnchor(value: string) { this.set(ControlStyle.overflowAnchorProperty, value); }

    static overflowWrapProperty = DependencyProperty.register(ControlStyle, "overflowWrap");
    get overflowWrap(): string { return this.get(ControlStyle.overflowWrapProperty); }
    set overflowWrap(value: string) { this.set(ControlStyle.overflowWrapProperty, value); }

    static overflowXProperty = DependencyProperty.register(ControlStyle, "overflowX");
    get overflowX(): string { return this.get(ControlStyle.overflowXProperty); }
    set overflowX(value: string) { this.set(ControlStyle.overflowXProperty, value); }

    static overflowYProperty = DependencyProperty.register(ControlStyle, "overflowY");
    get overflowY(): string { return this.get(ControlStyle.overflowYProperty); }
    set overflowY(value: string) { this.set(ControlStyle.overflowYProperty, value); }

    static paddingProperty = DependencyProperty.register(ControlStyle, "padding");
    get padding(): string { return this.get(ControlStyle.paddingProperty); }
    set padding(value: string) { this.set(ControlStyle.paddingProperty, value); }

    static paddingBlockEndProperty = DependencyProperty.register(ControlStyle, "paddingBlockEnd");
    get paddingBlockEnd(): string { return this.get(ControlStyle.paddingBlockEndProperty); }
    set paddingBlockEnd(value: string) { this.set(ControlStyle.paddingBlockEndProperty, value); }

    static paddingBlockStartProperty = DependencyProperty.register(ControlStyle, "paddingBlockStart");
    get paddingBlockStart(): string { return this.get(ControlStyle.paddingBlockStartProperty); }
    set paddingBlockStart(value: string) { this.set(ControlStyle.paddingBlockStartProperty, value); }

    static paddingBottomProperty = DependencyProperty.register(ControlStyle, "paddingBottom");
    get paddingBottom(): string { return this.get(ControlStyle.paddingBottomProperty); }
    set paddingBottom(value: string) { this.set(ControlStyle.paddingBottomProperty, value); }

    static paddingInlineEndProperty = DependencyProperty.register(ControlStyle, "paddingInlineEnd");
    get paddingInlineEnd(): string { return this.get(ControlStyle.paddingInlineEndProperty); }
    set paddingInlineEnd(value: string) { this.set(ControlStyle.paddingInlineEndProperty, value); }

    static paddingInlineStartProperty = DependencyProperty.register(ControlStyle, "paddingInlineStart");
    get paddingInlineStart(): string { return this.get(ControlStyle.paddingInlineStartProperty); }
    set paddingInlineStart(value: string) { this.set(ControlStyle.paddingInlineStartProperty, value); }

    static paddingLeftProperty = DependencyProperty.register(ControlStyle, "paddingLeft");
    get paddingLeft(): string { return this.get(ControlStyle.paddingLeftProperty); }
    set paddingLeft(value: string) { this.set(ControlStyle.paddingLeftProperty, value); }

    static paddingRightProperty = DependencyProperty.register(ControlStyle, "paddingRight");
    get paddingRight(): string { return this.get(ControlStyle.paddingRightProperty); }
    set paddingRight(value: string) { this.set(ControlStyle.paddingRightProperty, value); }

    static paddingTopProperty = DependencyProperty.register(ControlStyle, "paddingTop");
    get paddingTop(): string { return this.get(ControlStyle.paddingTopProperty); }
    set paddingTop(value: string) { this.set(ControlStyle.paddingTopProperty, value); }

    static pageBreakAfterProperty = DependencyProperty.register(ControlStyle, "pageBreakAfter");
    get pageBreakAfter(): string { return this.get(ControlStyle.pageBreakAfterProperty); }
    set pageBreakAfter(value: string) { this.set(ControlStyle.pageBreakAfterProperty, value); }

    static pageBreakBeforeProperty = DependencyProperty.register(ControlStyle, "pageBreakBefore");
    get pageBreakBefore(): string { return this.get(ControlStyle.pageBreakBeforeProperty); }
    set pageBreakBefore(value: string) { this.set(ControlStyle.pageBreakBeforeProperty, value); }

    static pageBreakInsideProperty = DependencyProperty.register(ControlStyle, "pageBreakInside");
    get pageBreakInside(): string { return this.get(ControlStyle.pageBreakInsideProperty); }
    set pageBreakInside(value: string) { this.set(ControlStyle.pageBreakInsideProperty, value); }

    static paintOrderProperty = DependencyProperty.register(ControlStyle, "paintOrder");
    get paintOrder(): string { return this.get(ControlStyle.paintOrderProperty); }
    set paintOrder(value: string) { this.set(ControlStyle.paintOrderProperty, value); }

    static parentRuleProperty = DependencyProperty.register(ControlStyle, "parentRule");
    get parentRule(): CSSRule { return this.get(ControlStyle.parentRuleProperty); }
    set parentRule(value: CSSRule) { this.set(ControlStyle.parentRuleProperty, value); }

    static penActionProperty = DependencyProperty.register(ControlStyle, "penAction");
    get penAction(): string | null { return this.get(ControlStyle.penActionProperty); }
    set penAction(value: string | null) { this.set(ControlStyle.penActionProperty, value); }

    static perspectiveProperty = DependencyProperty.register(ControlStyle, "perspective");
    get perspective(): string { return this.get(ControlStyle.perspectiveProperty); }
    set perspective(value: string) { this.set(ControlStyle.perspectiveProperty, value); }

    static perspectiveOriginProperty = DependencyProperty.register(ControlStyle, "perspectiveOrigin");
    get perspectiveOrigin(): string { return this.get(ControlStyle.perspectiveOriginProperty); }
    set perspectiveOrigin(value: string) { this.set(ControlStyle.perspectiveOriginProperty, value); }

    static placeContentProperty = DependencyProperty.register(ControlStyle, "placeContent");
    get placeContent(): string { return this.get(ControlStyle.placeContentProperty); }
    set placeContent(value: string) { this.set(ControlStyle.placeContentProperty, value); }

    static placeItemsProperty = DependencyProperty.register(ControlStyle, "placeItems");
    get placeItems(): string { return this.get(ControlStyle.placeItemsProperty); }
    set placeItems(value: string) { this.set(ControlStyle.placeItemsProperty, value); }

    static placeSelfProperty = DependencyProperty.register(ControlStyle, "placeSelf");
    get placeSelf(): string { return this.get(ControlStyle.placeSelfProperty); }
    set placeSelf(value: string) { this.set(ControlStyle.placeSelfProperty, value); }

    static pointerEventsProperty = DependencyProperty.register(ControlStyle, "pointerEvents");
    get pointerEvents(): string | null { return this.get(ControlStyle.pointerEventsProperty); }
    set pointerEvents(value: string | null) { this.set(ControlStyle.pointerEventsProperty, value); }

    static positionProperty = DependencyProperty.register(ControlStyle, "position");
    get position(): string { return this.get(ControlStyle.positionProperty); }
    set position(value: string) { this.set(ControlStyle.positionProperty, value); }

    static quotesProperty = DependencyProperty.register(ControlStyle, "quotes");
    get quotes(): string { return this.get(ControlStyle.quotesProperty); }
    set quotes(value: string) { this.set(ControlStyle.quotesProperty, value); }

    static resizeProperty = DependencyProperty.register(ControlStyle, "resize");
    get resize(): string { return this.get(ControlStyle.resizeProperty); }
    set resize(value: string) { this.set(ControlStyle.resizeProperty, value); }

    static rightProperty = DependencyProperty.register(ControlStyle, "right");
    get right(): string { return this.get(ControlStyle.rightProperty); }
    set right(value: string) { this.set(ControlStyle.rightProperty, value); }

    static rotateProperty = DependencyProperty.register(ControlStyle, "rotate");
    get rotate(): string { return this.get(ControlStyle.rotateProperty); }
    set rotate(value: string) { this.set(ControlStyle.rotateProperty, value); }

    static rowGapProperty = DependencyProperty.register(ControlStyle, "rowGap");
    get rowGap(): string { return this.get(ControlStyle.rowGapProperty); }
    set rowGap(value: string) { this.set(ControlStyle.rowGapProperty, value); }

    static rubyAlignProperty = DependencyProperty.register(ControlStyle, "rubyAlign");
    get rubyAlign(): string { return this.get(ControlStyle.rubyAlignProperty); }
    set rubyAlign(value: string) { this.set(ControlStyle.rubyAlignProperty, value); }

    static rubyOverhangProperty = DependencyProperty.register(ControlStyle, "rubyOverhang");
    get rubyOverhang(): string | null { return this.get(ControlStyle.rubyOverhangProperty); }
    set rubyOverhang(value: string | null) { this.set(ControlStyle.rubyOverhangProperty, value); }

    static rubyPositionProperty = DependencyProperty.register(ControlStyle, "rubyPosition");
    get rubyPosition(): string { return this.get(ControlStyle.rubyPositionProperty); }
    set rubyPosition(value: string) { this.set(ControlStyle.rubyPositionProperty, value); }

    static scaleProperty = DependencyProperty.register(ControlStyle, "scale");
    get scale(): string { return this.get(ControlStyle.scaleProperty); }
    set scale(value: string) { this.set(ControlStyle.scaleProperty, value); }

    static scrollBehaviorProperty = DependencyProperty.register(ControlStyle, "scrollBehavior");
    get scrollBehavior(): string { return this.get(ControlStyle.scrollBehaviorProperty); }
    set scrollBehavior(value: string) { this.set(ControlStyle.scrollBehaviorProperty, value); }

    static shapeRenderingProperty = DependencyProperty.register(ControlStyle, "shapeRendering");
    get shapeRendering(): string { return this.get(ControlStyle.shapeRenderingProperty); }
    set shapeRendering(value: string) { this.set(ControlStyle.shapeRenderingProperty, value); }

    static stopColorProperty = DependencyProperty.register(ControlStyle, "stopColor");
    get stopColor(): string { return this.get(ControlStyle.stopColorProperty); }
    set stopColor(value: string) { this.set(ControlStyle.stopColorProperty, value); }

    static stopOpacityProperty = DependencyProperty.register(ControlStyle, "stopOpacity");
    get stopOpacity(): string { return this.get(ControlStyle.stopOpacityProperty); }
    set stopOpacity(value: string) { this.set(ControlStyle.stopOpacityProperty, value); }

    static strokeProperty = DependencyProperty.register(ControlStyle, "stroke");
    get stroke(): string { return this.get(ControlStyle.strokeProperty); }
    set stroke(value: string) { this.set(ControlStyle.strokeProperty, value); }

    static strokeDasharrayProperty = DependencyProperty.register(ControlStyle, "strokeDasharray");
    get strokeDasharray(): string { return this.get(ControlStyle.strokeDasharrayProperty); }
    set strokeDasharray(value: string) { this.set(ControlStyle.strokeDasharrayProperty, value); }

    static strokeDashoffsetProperty = DependencyProperty.register(ControlStyle, "strokeDashoffset");
    get strokeDashoffset(): string { return this.get(ControlStyle.strokeDashoffsetProperty); }
    set strokeDashoffset(value: string) { this.set(ControlStyle.strokeDashoffsetProperty, value); }

    static strokeLinecapProperty = DependencyProperty.register(ControlStyle, "strokeLinecap");
    get strokeLinecap(): string { return this.get(ControlStyle.strokeLinecapProperty); }
    set strokeLinecap(value: string) { this.set(ControlStyle.strokeLinecapProperty, value); }

    static strokeLinejoinProperty = DependencyProperty.register(ControlStyle, "strokeLinejoin");
    get strokeLinejoin(): string { return this.get(ControlStyle.strokeLinejoinProperty); }
    set strokeLinejoin(value: string) { this.set(ControlStyle.strokeLinejoinProperty, value); }

    static strokeMiterlimitProperty = DependencyProperty.register(ControlStyle, "strokeMiterlimit");
    get strokeMiterlimit(): string { return this.get(ControlStyle.strokeMiterlimitProperty); }
    set strokeMiterlimit(value: string) { this.set(ControlStyle.strokeMiterlimitProperty, value); }

    static strokeOpacityProperty = DependencyProperty.register(ControlStyle, "strokeOpacity");
    get strokeOpacity(): string { return this.get(ControlStyle.strokeOpacityProperty); }
    set strokeOpacity(value: string) { this.set(ControlStyle.strokeOpacityProperty, value); }

    static strokeWidthProperty = DependencyProperty.register(ControlStyle, "strokeWidth");
    get strokeWidth(): string { return this.get(ControlStyle.strokeWidthProperty); }
    set strokeWidth(value: string) { this.set(ControlStyle.strokeWidthProperty, value); }

    static tabSizeProperty = DependencyProperty.register(ControlStyle, "tabSize");
    get tabSize(): string { return this.get(ControlStyle.tabSizeProperty); }
    set tabSize(value: string) { this.set(ControlStyle.tabSizeProperty, value); }

    static tableLayoutProperty = DependencyProperty.register(ControlStyle, "tableLayout");
    get tableLayout(): string { return this.get(ControlStyle.tableLayoutProperty); }
    set tableLayout(value: string) { this.set(ControlStyle.tableLayoutProperty, value); }

    static textAlignProperty = DependencyProperty.register(ControlStyle, "textAlign");
    get textAlign(): string { return this.get(ControlStyle.textAlignProperty); }
    set textAlign(value: string) { this.set(ControlStyle.textAlignProperty, value); }

    static textAlignLastProperty = DependencyProperty.register(ControlStyle, "textAlignLast");
    get textAlignLast(): string { return this.get(ControlStyle.textAlignLastProperty); }
    set textAlignLast(value: string) { this.set(ControlStyle.textAlignLastProperty, value); }

    static textAnchorProperty = DependencyProperty.register(ControlStyle, "textAnchor");
    get textAnchor(): string { return this.get(ControlStyle.textAnchorProperty); }
    set textAnchor(value: string) { this.set(ControlStyle.textAnchorProperty, value); }

    static textCombineUprightProperty = DependencyProperty.register(ControlStyle, "textCombineUpright");
    get textCombineUpright(): string { return this.get(ControlStyle.textCombineUprightProperty); }
    set textCombineUpright(value: string) { this.set(ControlStyle.textCombineUprightProperty, value); }

    static textDecorationProperty = DependencyProperty.register(ControlStyle, "textDecoration");
    get textDecoration(): string { return this.get(ControlStyle.textDecorationProperty); }
    set textDecoration(value: string) { this.set(ControlStyle.textDecorationProperty, value); }

    static textDecorationColorProperty = DependencyProperty.register(ControlStyle, "textDecorationColor");
    get textDecorationColor(): string { return this.get(ControlStyle.textDecorationColorProperty); }
    set textDecorationColor(value: string) { this.set(ControlStyle.textDecorationColorProperty, value); }

    static textDecorationLineProperty = DependencyProperty.register(ControlStyle, "textDecorationLine");
    get textDecorationLine(): string { return this.get(ControlStyle.textDecorationLineProperty); }
    set textDecorationLine(value: string) { this.set(ControlStyle.textDecorationLineProperty, value); }

    static textDecorationStyleProperty = DependencyProperty.register(ControlStyle, "textDecorationStyle");
    get textDecorationStyle(): string { return this.get(ControlStyle.textDecorationStyleProperty); }
    set textDecorationStyle(value: string) { this.set(ControlStyle.textDecorationStyleProperty, value); }

    static textEmphasisProperty = DependencyProperty.register(ControlStyle, "textEmphasis");
    get textEmphasis(): string { return this.get(ControlStyle.textEmphasisProperty); }
    set textEmphasis(value: string) { this.set(ControlStyle.textEmphasisProperty, value); }

    static textEmphasisColorProperty = DependencyProperty.register(ControlStyle, "textEmphasisColor");
    get textEmphasisColor(): string { return this.get(ControlStyle.textEmphasisColorProperty); }
    set textEmphasisColor(value: string) { this.set(ControlStyle.textEmphasisColorProperty, value); }

    static textEmphasisPositionProperty = DependencyProperty.register(ControlStyle, "textEmphasisPosition");
    get textEmphasisPosition(): string { return this.get(ControlStyle.textEmphasisPositionProperty); }
    set textEmphasisPosition(value: string) { this.set(ControlStyle.textEmphasisPositionProperty, value); }

    static textEmphasisStyleProperty = DependencyProperty.register(ControlStyle, "textEmphasisStyle");
    get textEmphasisStyle(): string { return this.get(ControlStyle.textEmphasisStyleProperty); }
    set textEmphasisStyle(value: string) { this.set(ControlStyle.textEmphasisStyleProperty, value); }

    static textIndentProperty = DependencyProperty.register(ControlStyle, "textIndent");
    get textIndent(): string { return this.get(ControlStyle.textIndentProperty); }
    set textIndent(value: string) { this.set(ControlStyle.textIndentProperty, value); }

    static textJustifyProperty = DependencyProperty.register(ControlStyle, "textJustify");
    get textJustify(): string { return this.get(ControlStyle.textJustifyProperty); }
    set textJustify(value: string) { this.set(ControlStyle.textJustifyProperty, value); }

    static textKashidaProperty = DependencyProperty.register(ControlStyle, "textKashida");
    get textKashida(): string | null { return this.get(ControlStyle.textKashidaProperty); }
    set textKashida(value: string | null) { this.set(ControlStyle.textKashidaProperty, value); }

    static textKashidaSpaceProperty = DependencyProperty.register(ControlStyle, "textKashidaSpace");
    get textKashidaSpace(): string | null { return this.get(ControlStyle.textKashidaSpaceProperty); }
    set textKashidaSpace(value: string | null) { this.set(ControlStyle.textKashidaSpaceProperty, value); }

    static textOrientationProperty = DependencyProperty.register(ControlStyle, "textOrientation");
    get textOrientation(): string { return this.get(ControlStyle.textOrientationProperty); }
    set textOrientation(value: string) { this.set(ControlStyle.textOrientationProperty, value); }

    static textOverflowProperty = DependencyProperty.register(ControlStyle, "textOverflow");
    get textOverflow(): string { return this.get(ControlStyle.textOverflowProperty); }
    set textOverflow(value: string) { this.set(ControlStyle.textOverflowProperty, value); }

    static textRenderingProperty = DependencyProperty.register(ControlStyle, "textRendering");
    get textRendering(): string { return this.get(ControlStyle.textRenderingProperty); }
    set textRendering(value: string) { this.set(ControlStyle.textRenderingProperty, value); }

    static textShadowProperty = DependencyProperty.register(ControlStyle, "textShadow");
    get textShadow(): string { return this.get(ControlStyle.textShadowProperty); }
    set textShadow(value: string) { this.set(ControlStyle.textShadowProperty, value); }

    static textTransformProperty = DependencyProperty.register(ControlStyle, "textTransform");
    get textTransform(): string { return this.get(ControlStyle.textTransformProperty); }
    set textTransform(value: string) { this.set(ControlStyle.textTransformProperty, value); }

    static textUnderlinePositionProperty = DependencyProperty.register(ControlStyle, "textUnderlinePosition");
    get textUnderlinePosition(): string { return this.get(ControlStyle.textUnderlinePositionProperty); }
    set textUnderlinePosition(value: string) { this.set(ControlStyle.textUnderlinePositionProperty, value); }

    static topProperty = DependencyProperty.register(ControlStyle, "top");
    get top(): string { return this.get(ControlStyle.topProperty); }
    set top(value: string) { this.set(ControlStyle.topProperty, value); }

    static touchActionProperty = DependencyProperty.register(ControlStyle, "touchAction");
    get touchAction(): string { return this.get(ControlStyle.touchActionProperty); }
    set touchAction(value: string) { this.set(ControlStyle.touchActionProperty, value); }

    static transformProperty = DependencyProperty.register(ControlStyle, "transform");
    get transform(): string { return this.get(ControlStyle.transformProperty); }
    set transform(value: string) { this.set(ControlStyle.transformProperty, value); }

    static transformBoxProperty = DependencyProperty.register(ControlStyle, "transformBox");
    get transformBox(): string { return this.get(ControlStyle.transformBoxProperty); }
    set transformBox(value: string) { this.set(ControlStyle.transformBoxProperty, value); }

    static transformOriginProperty = DependencyProperty.register(ControlStyle, "transformOrigin");
    get transformOrigin(): string { return this.get(ControlStyle.transformOriginProperty); }
    set transformOrigin(value: string) { this.set(ControlStyle.transformOriginProperty, value); }

    static transformStyleProperty = DependencyProperty.register(ControlStyle, "transformStyle");
    get transformStyle(): string { return this.get(ControlStyle.transformStyleProperty); }
    set transformStyle(value: string) { this.set(ControlStyle.transformStyleProperty, value); }

    static transitionProperty = DependencyProperty.register(ControlStyle, "transition");
    get transition(): string { return this.get(ControlStyle.transitionProperty); }
    set transition(value: string) { this.set(ControlStyle.transitionProperty, value); }

    static transitionDelayProperty = DependencyProperty.register(ControlStyle, "transitionDelay");
    get transitionDelay(): string { return this.get(ControlStyle.transitionDelayProperty); }
    set transitionDelay(value: string) { this.set(ControlStyle.transitionDelayProperty, value); }

    static transitionDurationProperty = DependencyProperty.register(ControlStyle, "transitionDuration");
    get transitionDuration(): string { return this.get(ControlStyle.transitionDurationProperty); }
    set transitionDuration(value: string) { this.set(ControlStyle.transitionDurationProperty, value); }

    static transitionPropertyProperty = DependencyProperty.register(ControlStyle, "transitionProperty");
    get transitionProperty(): string { return this.get(ControlStyle.transitionPropertyProperty); }
    set transitionProperty(value: string) { this.set(ControlStyle.transitionPropertyProperty, value); }

    static transitionTimingFunctionProperty = DependencyProperty.register(ControlStyle, "transitionTimingFunction");
    get transitionTimingFunction(): string { return this.get(ControlStyle.transitionTimingFunctionProperty); }
    set transitionTimingFunction(value: string) { this.set(ControlStyle.transitionTimingFunctionProperty, value); }

    static translateProperty = DependencyProperty.register(ControlStyle, "translate");
    get translate(): string { return this.get(ControlStyle.translateProperty); }
    set translate(value: string) { this.set(ControlStyle.translateProperty, value); }

    static unicodeBidiProperty = DependencyProperty.register(ControlStyle, "unicodeBidi");
    get unicodeBidi(): string { return this.get(ControlStyle.unicodeBidiProperty); }
    set unicodeBidi(value: string) { this.set(ControlStyle.unicodeBidiProperty, value); }

    static userSelectProperty = DependencyProperty.register(ControlStyle, "userSelect");
    get userSelect(): string { return this.get(ControlStyle.userSelectProperty); }
    set userSelect(value: string) { this.set(ControlStyle.userSelectProperty, value); }

    static verticalAlignProperty = DependencyProperty.register(ControlStyle, "verticalAlign");
    get verticalAlign(): string { return this.get(ControlStyle.verticalAlignProperty); }
    set verticalAlign(value: string) { this.set(ControlStyle.verticalAlignProperty, value); }

    static visibilityProperty = DependencyProperty.register(ControlStyle, "visibility");
    get visibility(): string { return this.get(ControlStyle.visibilityProperty); }
    set visibility(value: string) { this.set(ControlStyle.visibilityProperty, value); }

    static webkitAlignContentProperty = DependencyProperty.register(ControlStyle, "webkitAlignContent");
    get webkitAlignContent(): string { return this.get(ControlStyle.webkitAlignContentProperty); }
    set webkitAlignContent(value: string) { this.set(ControlStyle.webkitAlignContentProperty, value); }

    static webkitAlignItemsProperty = DependencyProperty.register(ControlStyle, "webkitAlignItems");
    get webkitAlignItems(): string { return this.get(ControlStyle.webkitAlignItemsProperty); }
    set webkitAlignItems(value: string) { this.set(ControlStyle.webkitAlignItemsProperty, value); }

    static webkitAlignSelfProperty = DependencyProperty.register(ControlStyle, "webkitAlignSelf");
    get webkitAlignSelf(): string { return this.get(ControlStyle.webkitAlignSelfProperty); }
    set webkitAlignSelf(value: string) { this.set(ControlStyle.webkitAlignSelfProperty, value); }

    static webkitAnimationProperty = DependencyProperty.register(ControlStyle, "webkitAnimation");
    get webkitAnimation(): string { return this.get(ControlStyle.webkitAnimationProperty); }
    set webkitAnimation(value: string) { this.set(ControlStyle.webkitAnimationProperty, value); }

    static webkitAnimationDelayProperty = DependencyProperty.register(ControlStyle, "webkitAnimationDelay");
    get webkitAnimationDelay(): string { return this.get(ControlStyle.webkitAnimationDelayProperty); }
    set webkitAnimationDelay(value: string) { this.set(ControlStyle.webkitAnimationDelayProperty, value); }

    static webkitAnimationDirectionProperty = DependencyProperty.register(ControlStyle, "webkitAnimationDirection");
    get webkitAnimationDirection(): string { return this.get(ControlStyle.webkitAnimationDirectionProperty); }
    set webkitAnimationDirection(value: string) { this.set(ControlStyle.webkitAnimationDirectionProperty, value); }

    static webkitAnimationDurationProperty = DependencyProperty.register(ControlStyle, "webkitAnimationDuration");
    get webkitAnimationDuration(): string { return this.get(ControlStyle.webkitAnimationDurationProperty); }
    set webkitAnimationDuration(value: string) { this.set(ControlStyle.webkitAnimationDurationProperty, value); }

    static webkitAnimationFillModeProperty = DependencyProperty.register(ControlStyle, "webkitAnimationFillMode");
    get webkitAnimationFillMode(): string { return this.get(ControlStyle.webkitAnimationFillModeProperty); }
    set webkitAnimationFillMode(value: string) { this.set(ControlStyle.webkitAnimationFillModeProperty, value); }

    static webkitAnimationIterationCountProperty = DependencyProperty.register(ControlStyle, "webkitAnimationIterationCount");
    get webkitAnimationIterationCount(): string { return this.get(ControlStyle.webkitAnimationIterationCountProperty); }
    set webkitAnimationIterationCount(value: string) { this.set(ControlStyle.webkitAnimationIterationCountProperty, value); }

    static webkitAnimationNameProperty = DependencyProperty.register(ControlStyle, "webkitAnimationName");
    get webkitAnimationName(): string { return this.get(ControlStyle.webkitAnimationNameProperty); }
    set webkitAnimationName(value: string) { this.set(ControlStyle.webkitAnimationNameProperty, value); }

    static webkitAnimationPlayStateProperty = DependencyProperty.register(ControlStyle, "webkitAnimationPlayState");
    get webkitAnimationPlayState(): string { return this.get(ControlStyle.webkitAnimationPlayStateProperty); }
    set webkitAnimationPlayState(value: string) { this.set(ControlStyle.webkitAnimationPlayStateProperty, value); }

    static webkitAnimationTimingFunctionProperty = DependencyProperty.register(ControlStyle, "webkitAnimationTimingFunction");
    get webkitAnimationTimingFunction(): string { return this.get(ControlStyle.webkitAnimationTimingFunctionProperty); }
    set webkitAnimationTimingFunction(value: string) { this.set(ControlStyle.webkitAnimationTimingFunctionProperty, value); }

    static webkitAppearanceProperty = DependencyProperty.register(ControlStyle, "webkitAppearance");
    get webkitAppearance(): string { return this.get(ControlStyle.webkitAppearanceProperty); }
    set webkitAppearance(value: string) { this.set(ControlStyle.webkitAppearanceProperty, value); }

    static webkitBackfaceVisibilityProperty = DependencyProperty.register(ControlStyle, "webkitBackfaceVisibility");
    get webkitBackfaceVisibility(): string { return this.get(ControlStyle.webkitBackfaceVisibilityProperty); }
    set webkitBackfaceVisibility(value: string) { this.set(ControlStyle.webkitBackfaceVisibilityProperty, value); }

    static webkitBackgroundClipProperty = DependencyProperty.register(ControlStyle, "webkitBackgroundClip");
    get webkitBackgroundClip(): string { return this.get(ControlStyle.webkitBackgroundClipProperty); }
    set webkitBackgroundClip(value: string) { this.set(ControlStyle.webkitBackgroundClipProperty, value); }

    static webkitBackgroundOriginProperty = DependencyProperty.register(ControlStyle, "webkitBackgroundOrigin");
    get webkitBackgroundOrigin(): string { return this.get(ControlStyle.webkitBackgroundOriginProperty); }
    set webkitBackgroundOrigin(value: string) { this.set(ControlStyle.webkitBackgroundOriginProperty, value); }

    static webkitBackgroundSizeProperty = DependencyProperty.register(ControlStyle, "webkitBackgroundSize");
    get webkitBackgroundSize(): string { return this.get(ControlStyle.webkitBackgroundSizeProperty); }
    set webkitBackgroundSize(value: string) { this.set(ControlStyle.webkitBackgroundSizeProperty, value); }

    static webkitBorderBottomLeftRadiusProperty = DependencyProperty.register(ControlStyle, "webkitBorderBottomLeftRadius");
    get webkitBorderBottomLeftRadius(): string { return this.get(ControlStyle.webkitBorderBottomLeftRadiusProperty); }
    set webkitBorderBottomLeftRadius(value: string) { this.set(ControlStyle.webkitBorderBottomLeftRadiusProperty, value); }

    static webkitBorderBottomRightRadiusProperty = DependencyProperty.register(ControlStyle, "webkitBorderBottomRightRadius");
    get webkitBorderBottomRightRadius(): string { return this.get(ControlStyle.webkitBorderBottomRightRadiusProperty); }
    set webkitBorderBottomRightRadius(value: string) { this.set(ControlStyle.webkitBorderBottomRightRadiusProperty, value); }

    static webkitBorderImageProperty = DependencyProperty.register(ControlStyle, "webkitBorderImage");
    get webkitBorderImage(): string | null { return this.get(ControlStyle.webkitBorderImageProperty); }
    set webkitBorderImage(value: string | null) { this.set(ControlStyle.webkitBorderImageProperty, value); }

    static webkitBorderRadiusProperty = DependencyProperty.register(ControlStyle, "webkitBorderRadius");
    get webkitBorderRadius(): string { return this.get(ControlStyle.webkitBorderRadiusProperty); }
    set webkitBorderRadius(value: string) { this.set(ControlStyle.webkitBorderRadiusProperty, value); }

    static webkitBorderTopLeftRadiusProperty = DependencyProperty.register(ControlStyle, "webkitBorderTopLeftRadius");
    get webkitBorderTopLeftRadius(): string { return this.get(ControlStyle.webkitBorderTopLeftRadiusProperty); }
    set webkitBorderTopLeftRadius(value: string) { this.set(ControlStyle.webkitBorderTopLeftRadiusProperty, value); }

    static webkitBorderTopRightRadiusProperty = DependencyProperty.register(ControlStyle, "webkitBorderTopRightRadius");
    get webkitBorderTopRightRadius(): string { return this.get(ControlStyle.webkitBorderTopRightRadiusProperty); }
    set webkitBorderTopRightRadius(value: string) { this.set(ControlStyle.webkitBorderTopRightRadiusProperty, value); }

    static webkitBoxAlignProperty = DependencyProperty.register(ControlStyle, "webkitBoxAlign");
    get webkitBoxAlign(): string { return this.get(ControlStyle.webkitBoxAlignProperty); }
    set webkitBoxAlign(value: string) { this.set(ControlStyle.webkitBoxAlignProperty, value); }

    static webkitBoxDirectionProperty = DependencyProperty.register(ControlStyle, "webkitBoxDirection");
    get webkitBoxDirection(): string | null { return this.get(ControlStyle.webkitBoxDirectionProperty); }
    set webkitBoxDirection(value: string | null) { this.set(ControlStyle.webkitBoxDirectionProperty, value); }

    static webkitBoxFlexProperty = DependencyProperty.register(ControlStyle, "webkitBoxFlex");
    get webkitBoxFlex(): string { return this.get(ControlStyle.webkitBoxFlexProperty); }
    set webkitBoxFlex(value: string) { this.set(ControlStyle.webkitBoxFlexProperty, value); }

    static webkitBoxOrdinalGroupProperty = DependencyProperty.register(ControlStyle, "webkitBoxOrdinalGroup");
    get webkitBoxOrdinalGroup(): string { return this.get(ControlStyle.webkitBoxOrdinalGroupProperty); }
    set webkitBoxOrdinalGroup(value: string) { this.set(ControlStyle.webkitBoxOrdinalGroupProperty, value); }

    static webkitBoxOrientProperty = DependencyProperty.register(ControlStyle, "webkitBoxOrient");
    get webkitBoxOrient(): string { return this.get(ControlStyle.webkitBoxOrientProperty); }
    set webkitBoxOrient(value: string) { this.set(ControlStyle.webkitBoxOrientProperty, value); }

    static webkitBoxPackProperty = DependencyProperty.register(ControlStyle, "webkitBoxPack");
    get webkitBoxPack(): string { return this.get(ControlStyle.webkitBoxPackProperty); }
    set webkitBoxPack(value: string) { this.set(ControlStyle.webkitBoxPackProperty, value); }

    static webkitBoxShadowProperty = DependencyProperty.register(ControlStyle, "webkitBoxShadow");
    get webkitBoxShadow(): string { return this.get(ControlStyle.webkitBoxShadowProperty); }
    set webkitBoxShadow(value: string) { this.set(ControlStyle.webkitBoxShadowProperty, value); }

    static webkitBoxSizingProperty = DependencyProperty.register(ControlStyle, "webkitBoxSizing");
    get webkitBoxSizing(): string { return this.get(ControlStyle.webkitBoxSizingProperty); }
    set webkitBoxSizing(value: string) { this.set(ControlStyle.webkitBoxSizingProperty, value); }

    static webkitColumnBreakAfterProperty = DependencyProperty.register(ControlStyle, "webkitColumnBreakAfter");
    get webkitColumnBreakAfter(): string | null { return this.get(ControlStyle.webkitColumnBreakAfterProperty); }
    set webkitColumnBreakAfter(value: string | null) { this.set(ControlStyle.webkitColumnBreakAfterProperty, value); }

    static webkitColumnBreakBeforeProperty = DependencyProperty.register(ControlStyle, "webkitColumnBreakBefore");
    get webkitColumnBreakBefore(): string | null { return this.get(ControlStyle.webkitColumnBreakBeforeProperty); }
    set webkitColumnBreakBefore(value: string | null) { this.set(ControlStyle.webkitColumnBreakBeforeProperty, value); }

    static webkitColumnBreakInsideProperty = DependencyProperty.register(ControlStyle, "webkitColumnBreakInside");
    get webkitColumnBreakInside(): string | null { return this.get(ControlStyle.webkitColumnBreakInsideProperty); }
    set webkitColumnBreakInside(value: string | null) { this.set(ControlStyle.webkitColumnBreakInsideProperty, value); }

    static webkitColumnCountProperty = DependencyProperty.register(ControlStyle, "webkitColumnCount");
    get webkitColumnCount(): any { return this.get(ControlStyle.webkitColumnCountProperty); }
    set webkitColumnCount(value: any) { this.set(ControlStyle.webkitColumnCountProperty, value); }

    static webkitColumnGapProperty = DependencyProperty.register(ControlStyle, "webkitColumnGap");
    get webkitColumnGap(): any { return this.get(ControlStyle.webkitColumnGapProperty); }
    set webkitColumnGap(value: any) { this.set(ControlStyle.webkitColumnGapProperty, value); }

    static webkitColumnRuleProperty = DependencyProperty.register(ControlStyle, "webkitColumnRule");
    get webkitColumnRule(): string | null { return this.get(ControlStyle.webkitColumnRuleProperty); }
    set webkitColumnRule(value: string | null) { this.set(ControlStyle.webkitColumnRuleProperty, value); }

    static webkitColumnRuleColorProperty = DependencyProperty.register(ControlStyle, "webkitColumnRuleColor");
    get webkitColumnRuleColor(): any { return this.get(ControlStyle.webkitColumnRuleColorProperty); }
    set webkitColumnRuleColor(value: any) { this.set(ControlStyle.webkitColumnRuleColorProperty, value); }

    static webkitColumnRuleStyleProperty = DependencyProperty.register(ControlStyle, "webkitColumnRuleStyle");
    get webkitColumnRuleStyle(): string | null { return this.get(ControlStyle.webkitColumnRuleStyleProperty); }
    set webkitColumnRuleStyle(value: string | null) { this.set(ControlStyle.webkitColumnRuleStyleProperty, value); }

    static webkitColumnRuleWidthProperty = DependencyProperty.register(ControlStyle, "webkitColumnRuleWidth");
    get webkitColumnRuleWidth(): any { return this.get(ControlStyle.webkitColumnRuleWidthProperty); }
    set webkitColumnRuleWidth(value: any) { this.set(ControlStyle.webkitColumnRuleWidthProperty, value); }

    static webkitColumnSpanProperty = DependencyProperty.register(ControlStyle, "webkitColumnSpan");
    get webkitColumnSpan(): string | null { return this.get(ControlStyle.webkitColumnSpanProperty); }
    set webkitColumnSpan(value: string | null) { this.set(ControlStyle.webkitColumnSpanProperty, value); }

    static webkitColumnWidthProperty = DependencyProperty.register(ControlStyle, "webkitColumnWidth");
    get webkitColumnWidth(): any { return this.get(ControlStyle.webkitColumnWidthProperty); }
    set webkitColumnWidth(value: any) { this.set(ControlStyle.webkitColumnWidthProperty, value); }

    static webkitColumnsProperty = DependencyProperty.register(ControlStyle, "webkitColumns");
    get webkitColumns(): string | null { return this.get(ControlStyle.webkitColumnsProperty); }
    set webkitColumns(value: string | null) { this.set(ControlStyle.webkitColumnsProperty, value); }

    static webkitFilterProperty = DependencyProperty.register(ControlStyle, "webkitFilter");
    get webkitFilter(): string { return this.get(ControlStyle.webkitFilterProperty); }
    set webkitFilter(value: string) { this.set(ControlStyle.webkitFilterProperty, value); }

    static webkitFlexProperty = DependencyProperty.register(ControlStyle, "webkitFlex");
    get webkitFlex(): string { return this.get(ControlStyle.webkitFlexProperty); }
    set webkitFlex(value: string) { this.set(ControlStyle.webkitFlexProperty, value); }

    static webkitFlexBasisProperty = DependencyProperty.register(ControlStyle, "webkitFlexBasis");
    get webkitFlexBasis(): string { return this.get(ControlStyle.webkitFlexBasisProperty); }
    set webkitFlexBasis(value: string) { this.set(ControlStyle.webkitFlexBasisProperty, value); }

    static webkitFlexDirectionProperty = DependencyProperty.register(ControlStyle, "webkitFlexDirection");
    get webkitFlexDirection(): string { return this.get(ControlStyle.webkitFlexDirectionProperty); }
    set webkitFlexDirection(value: string) { this.set(ControlStyle.webkitFlexDirectionProperty, value); }

    static webkitFlexFlowProperty = DependencyProperty.register(ControlStyle, "webkitFlexFlow");
    get webkitFlexFlow(): string { return this.get(ControlStyle.webkitFlexFlowProperty); }
    set webkitFlexFlow(value: string) { this.set(ControlStyle.webkitFlexFlowProperty, value); }

    static webkitFlexGrowProperty = DependencyProperty.register(ControlStyle, "webkitFlexGrow");
    get webkitFlexGrow(): string { return this.get(ControlStyle.webkitFlexGrowProperty); }
    set webkitFlexGrow(value: string) { this.set(ControlStyle.webkitFlexGrowProperty, value); }

    static webkitFlexShrinkProperty = DependencyProperty.register(ControlStyle, "webkitFlexShrink");
    get webkitFlexShrink(): string { return this.get(ControlStyle.webkitFlexShrinkProperty); }
    set webkitFlexShrink(value: string) { this.set(ControlStyle.webkitFlexShrinkProperty, value); }

    static webkitFlexWrapProperty = DependencyProperty.register(ControlStyle, "webkitFlexWrap");
    get webkitFlexWrap(): string { return this.get(ControlStyle.webkitFlexWrapProperty); }
    set webkitFlexWrap(value: string) { this.set(ControlStyle.webkitFlexWrapProperty, value); }

    static webkitJustifyContentProperty = DependencyProperty.register(ControlStyle, "webkitJustifyContent");
    get webkitJustifyContent(): string { return this.get(ControlStyle.webkitJustifyContentProperty); }
    set webkitJustifyContent(value: string) { this.set(ControlStyle.webkitJustifyContentProperty, value); }

    static webkitLineClampProperty = DependencyProperty.register(ControlStyle, "webkitLineClamp");
    get webkitLineClamp(): string { return this.get(ControlStyle.webkitLineClampProperty); }
    set webkitLineClamp(value: string) { this.set(ControlStyle.webkitLineClampProperty, value); }

    static webkitMaskProperty = DependencyProperty.register(ControlStyle, "webkitMask");
    get webkitMask(): string { return this.get(ControlStyle.webkitMaskProperty); }
    set webkitMask(value: string) { this.set(ControlStyle.webkitMaskProperty, value); }

    static webkitMaskBoxImageProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImage");
    get webkitMaskBoxImage(): string { return this.get(ControlStyle.webkitMaskBoxImageProperty); }
    set webkitMaskBoxImage(value: string) { this.set(ControlStyle.webkitMaskBoxImageProperty, value); }

    static webkitMaskBoxImageOutsetProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImageOutset");
    get webkitMaskBoxImageOutset(): string { return this.get(ControlStyle.webkitMaskBoxImageOutsetProperty); }
    set webkitMaskBoxImageOutset(value: string) { this.set(ControlStyle.webkitMaskBoxImageOutsetProperty, value); }

    static webkitMaskBoxImageRepeatProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImageRepeat");
    get webkitMaskBoxImageRepeat(): string { return this.get(ControlStyle.webkitMaskBoxImageRepeatProperty); }
    set webkitMaskBoxImageRepeat(value: string) { this.set(ControlStyle.webkitMaskBoxImageRepeatProperty, value); }

    static webkitMaskBoxImageSliceProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImageSlice");
    get webkitMaskBoxImageSlice(): string { return this.get(ControlStyle.webkitMaskBoxImageSliceProperty); }
    set webkitMaskBoxImageSlice(value: string) { this.set(ControlStyle.webkitMaskBoxImageSliceProperty, value); }

    static webkitMaskBoxImageSourceProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImageSource");
    get webkitMaskBoxImageSource(): string { return this.get(ControlStyle.webkitMaskBoxImageSourceProperty); }
    set webkitMaskBoxImageSource(value: string) { this.set(ControlStyle.webkitMaskBoxImageSourceProperty, value); }

    static webkitMaskBoxImageWidthProperty = DependencyProperty.register(ControlStyle, "webkitMaskBoxImageWidth");
    get webkitMaskBoxImageWidth(): string { return this.get(ControlStyle.webkitMaskBoxImageWidthProperty); }
    set webkitMaskBoxImageWidth(value: string) { this.set(ControlStyle.webkitMaskBoxImageWidthProperty, value); }

    static webkitMaskClipProperty = DependencyProperty.register(ControlStyle, "webkitMaskClip");
    get webkitMaskClip(): string { return this.get(ControlStyle.webkitMaskClipProperty); }
    set webkitMaskClip(value: string) { this.set(ControlStyle.webkitMaskClipProperty, value); }

    static webkitMaskCompositeProperty = DependencyProperty.register(ControlStyle, "webkitMaskComposite");
    get webkitMaskComposite(): string { return this.get(ControlStyle.webkitMaskCompositeProperty); }
    set webkitMaskComposite(value: string) { this.set(ControlStyle.webkitMaskCompositeProperty, value); }

    static webkitMaskImageProperty = DependencyProperty.register(ControlStyle, "webkitMaskImage");
    get webkitMaskImage(): string { return this.get(ControlStyle.webkitMaskImageProperty); }
    set webkitMaskImage(value: string) { this.set(ControlStyle.webkitMaskImageProperty, value); }

    static webkitMaskOriginProperty = DependencyProperty.register(ControlStyle, "webkitMaskOrigin");
    get webkitMaskOrigin(): string { return this.get(ControlStyle.webkitMaskOriginProperty); }
    set webkitMaskOrigin(value: string) { this.set(ControlStyle.webkitMaskOriginProperty, value); }

    static webkitMaskPositionProperty = DependencyProperty.register(ControlStyle, "webkitMaskPosition");
    get webkitMaskPosition(): string { return this.get(ControlStyle.webkitMaskPositionProperty); }
    set webkitMaskPosition(value: string) { this.set(ControlStyle.webkitMaskPositionProperty, value); }

    static webkitMaskRepeatProperty = DependencyProperty.register(ControlStyle, "webkitMaskRepeat");
    get webkitMaskRepeat(): string { return this.get(ControlStyle.webkitMaskRepeatProperty); }
    set webkitMaskRepeat(value: string) { this.set(ControlStyle.webkitMaskRepeatProperty, value); }

    static webkitMaskSizeProperty = DependencyProperty.register(ControlStyle, "webkitMaskSize");
    get webkitMaskSize(): string { return this.get(ControlStyle.webkitMaskSizeProperty); }
    set webkitMaskSize(value: string) { this.set(ControlStyle.webkitMaskSizeProperty, value); }

    static webkitOrderProperty = DependencyProperty.register(ControlStyle, "webkitOrder");
    get webkitOrder(): string { return this.get(ControlStyle.webkitOrderProperty); }
    set webkitOrder(value: string) { this.set(ControlStyle.webkitOrderProperty, value); }

    static webkitPerspectiveProperty = DependencyProperty.register(ControlStyle, "webkitPerspective");
    get webkitPerspective(): string { return this.get(ControlStyle.webkitPerspectiveProperty); }
    set webkitPerspective(value: string) { this.set(ControlStyle.webkitPerspectiveProperty, value); }

    static webkitPerspectiveOriginProperty = DependencyProperty.register(ControlStyle, "webkitPerspectiveOrigin");
    get webkitPerspectiveOrigin(): string { return this.get(ControlStyle.webkitPerspectiveOriginProperty); }
    set webkitPerspectiveOrigin(value: string) { this.set(ControlStyle.webkitPerspectiveOriginProperty, value); }

    static webkitTapHighlightColorProperty = DependencyProperty.register(ControlStyle, "webkitTapHighlightColor");
    get webkitTapHighlightColor(): string | null { return this.get(ControlStyle.webkitTapHighlightColorProperty); }
    set webkitTapHighlightColor(value: string | null) { this.set(ControlStyle.webkitTapHighlightColorProperty, value); }

    static webkitTextFillColorProperty = DependencyProperty.register(ControlStyle, "webkitTextFillColor");
    get webkitTextFillColor(): string { return this.get(ControlStyle.webkitTextFillColorProperty); }
    set webkitTextFillColor(value: string) { this.set(ControlStyle.webkitTextFillColorProperty, value); }

    static webkitTextSizeAdjustProperty = DependencyProperty.register(ControlStyle, "webkitTextSizeAdjust");
    get webkitTextSizeAdjust(): string { return this.get(ControlStyle.webkitTextSizeAdjustProperty); }
    set webkitTextSizeAdjust(value: string) { this.set(ControlStyle.webkitTextSizeAdjustProperty, value); }

    static webkitTextStrokeProperty = DependencyProperty.register(ControlStyle, "webkitTextStroke");
    get webkitTextStroke(): string { return this.get(ControlStyle.webkitTextStrokeProperty); }
    set webkitTextStroke(value: string) { this.set(ControlStyle.webkitTextStrokeProperty, value); }

    static webkitTextStrokeColorProperty = DependencyProperty.register(ControlStyle, "webkitTextStrokeColor");
    get webkitTextStrokeColor(): string { return this.get(ControlStyle.webkitTextStrokeColorProperty); }
    set webkitTextStrokeColor(value: string) { this.set(ControlStyle.webkitTextStrokeColorProperty, value); }

    static webkitTextStrokeWidthProperty = DependencyProperty.register(ControlStyle, "webkitTextStrokeWidth");
    get webkitTextStrokeWidth(): string { return this.get(ControlStyle.webkitTextStrokeWidthProperty); }
    set webkitTextStrokeWidth(value: string) { this.set(ControlStyle.webkitTextStrokeWidthProperty, value); }

    static webkitTransformProperty = DependencyProperty.register(ControlStyle, "webkitTransform");
    get webkitTransform(): string { return this.get(ControlStyle.webkitTransformProperty); }
    set webkitTransform(value: string) { this.set(ControlStyle.webkitTransformProperty, value); }

    static webkitTransformOriginProperty = DependencyProperty.register(ControlStyle, "webkitTransformOrigin");
    get webkitTransformOrigin(): string { return this.get(ControlStyle.webkitTransformOriginProperty); }
    set webkitTransformOrigin(value: string) { this.set(ControlStyle.webkitTransformOriginProperty, value); }

    static webkitTransformStyleProperty = DependencyProperty.register(ControlStyle, "webkitTransformStyle");
    get webkitTransformStyle(): string { return this.get(ControlStyle.webkitTransformStyleProperty); }
    set webkitTransformStyle(value: string) { this.set(ControlStyle.webkitTransformStyleProperty, value); }

    static webkitTransitionProperty = DependencyProperty.register(ControlStyle, "webkitTransition");
    get webkitTransition(): string { return this.get(ControlStyle.webkitTransitionProperty); }
    set webkitTransition(value: string) { this.set(ControlStyle.webkitTransitionProperty, value); }

    static webkitTransitionDelayProperty = DependencyProperty.register(ControlStyle, "webkitTransitionDelay");
    get webkitTransitionDelay(): string { return this.get(ControlStyle.webkitTransitionDelayProperty); }
    set webkitTransitionDelay(value: string) { this.set(ControlStyle.webkitTransitionDelayProperty, value); }

    static webkitTransitionDurationProperty = DependencyProperty.register(ControlStyle, "webkitTransitionDuration");
    get webkitTransitionDuration(): string { return this.get(ControlStyle.webkitTransitionDurationProperty); }
    set webkitTransitionDuration(value: string) { this.set(ControlStyle.webkitTransitionDurationProperty, value); }

    static webkitTransitionPropertyProperty = DependencyProperty.register(ControlStyle, "webkitTransitionProperty");
    get webkitTransitionProperty(): string { return this.get(ControlStyle.webkitTransitionPropertyProperty); }
    set webkitTransitionProperty(value: string) { this.set(ControlStyle.webkitTransitionPropertyProperty, value); }

    static webkitTransitionTimingFunctionProperty = DependencyProperty.register(ControlStyle, "webkitTransitionTimingFunction");
    get webkitTransitionTimingFunction(): string { return this.get(ControlStyle.webkitTransitionTimingFunctionProperty); }
    set webkitTransitionTimingFunction(value: string) { this.set(ControlStyle.webkitTransitionTimingFunctionProperty, value); }

    static webkitUserModifyProperty = DependencyProperty.register(ControlStyle, "webkitUserModify");
    get webkitUserModify(): string | null { return this.get(ControlStyle.webkitUserModifyProperty); }
    set webkitUserModify(value: string | null) { this.set(ControlStyle.webkitUserModifyProperty, value); }

    static webkitUserSelectProperty = DependencyProperty.register(ControlStyle, "webkitUserSelect");
    get webkitUserSelect(): string | null { return this.get(ControlStyle.webkitUserSelectProperty); }
    set webkitUserSelect(value: string | null) { this.set(ControlStyle.webkitUserSelectProperty, value); }

    static webkitWritingModeProperty = DependencyProperty.register(ControlStyle, "webkitWritingMode");
    get webkitWritingMode(): string | null { return this.get(ControlStyle.webkitWritingModeProperty); }
    set webkitWritingMode(value: string | null) { this.set(ControlStyle.webkitWritingModeProperty, value); }

    static whiteSpaceProperty = DependencyProperty.register(ControlStyle, "whiteSpace");
    get whiteSpace(): string { return this.get(ControlStyle.whiteSpaceProperty); }
    set whiteSpace(value: string) { this.set(ControlStyle.whiteSpaceProperty, value); }

    static widowsProperty = DependencyProperty.register(ControlStyle, "widows");
    get widows(): string { return this.get(ControlStyle.widowsProperty); }
    set widows(value: string) { this.set(ControlStyle.widowsProperty, value); }

    static widthProperty = DependencyProperty.register(ControlStyle, "width");
    get width(): string { return this.get(ControlStyle.widthProperty); }
    set width(value: string) { this.set(ControlStyle.widthProperty, value); }

    static willChangeProperty = DependencyProperty.register(ControlStyle, "willChange");
    get willChange(): string { return this.get(ControlStyle.willChangeProperty); }
    set willChange(value: string) { this.set(ControlStyle.willChangeProperty, value); }

    static wordBreakProperty = DependencyProperty.register(ControlStyle, "wordBreak");
    get wordBreak(): string { return this.get(ControlStyle.wordBreakProperty); }
    set wordBreak(value: string) { this.set(ControlStyle.wordBreakProperty, value); }

    static wordSpacingProperty = DependencyProperty.register(ControlStyle, "wordSpacing");
    get wordSpacing(): string { return this.get(ControlStyle.wordSpacingProperty); }
    set wordSpacing(value: string) { this.set(ControlStyle.wordSpacingProperty, value); }

    static wordWrapProperty = DependencyProperty.register(ControlStyle, "wordWrap");
    get wordWrap(): string { return this.get(ControlStyle.wordWrapProperty); }
    set wordWrap(value: string) { this.set(ControlStyle.wordWrapProperty, value); }

    static writingModeProperty = DependencyProperty.register(ControlStyle, "writingMode");
    get writingMode(): string { return this.get(ControlStyle.writingModeProperty); }
    set writingMode(value: string) { this.set(ControlStyle.writingModeProperty, value); }

    static zIndexProperty = DependencyProperty.register(ControlStyle, "zIndex");
    get zIndex(): string { return this.get(ControlStyle.zIndexProperty); }
    set zIndex(value: string) { this.set(ControlStyle.zIndexProperty, value); }

    static zoomProperty = DependencyProperty.register(ControlStyle, "zoom");
    get zoom(): string | null { return this.get(ControlStyle.zoomProperty); }
    set zoom(value: string | null) { this.set(ControlStyle.zoomProperty, value); }

    getPropertyPriority!: (propertyName: string) => string;

    getPropertyValue!: (propertyName: string) => string;

    item!: (index: number) => string;

    removeProperty!: (propertyName: string) => string;

    setProperty!: (propertyName: string, value: string | null, priority?: string | null | undefined) => void;

    [Symbol.iterator]!: () => IterableIterator<string>;

    destructor() {
        this.__styleElement.remove();

        gen.delete(this.__id);
    }
}
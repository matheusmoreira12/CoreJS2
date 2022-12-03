import { DependencyObject, DependencyProperty, PropertyChangeEventArgs, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { Control } from "../control.js";
import { StringUtils } from "../../../core-base/utils/index.js";
import { Type } from "../../../standard/reflection/index.js";
import { AnyConstraint } from "../../../standard/reflection/type-constraints/index.js";

export class ControlStyle extends DependencyObject {
    constructor(targetControl: Control) {
        super();

        this.__targetControl = targetControl;

        this.__initializeStyle();
    }

    private __initializeStyle() {
        const styleElement = document.createElement("style");
        document.head.appendChild(styleElement);
        const styleSheet = styleElement.sheet;
        styleSheet?.insertRule(`#control-${this.__targetControl!.uniqueId}`);
        const styleRule = styleSheet?.cssRules[0];
        const styleDeclaration = (styleRule as CSSStyleRule).style;
        this.__styleElement = styleElement;        
        this.__styleDeclaration = styleDeclaration;
    }

    private __styleElement: HTMLStyleElement | null = null;
    private __styleDeclaration: CSSStyleDeclaration | null = null;

    private __getPropertyCSSName(propertyName: string) {
        return StringUtils.toHyphenCase(propertyName);
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        this.__styleDeclaration?.setProperty(this.__getPropertyCSSName(args.property.name), args.newValue);
    }

    static allProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "all", new PropertyMetadata(new AnyConstraint()));
    get all(): string { return this.get(ControlStyle.allProperty); }
    set all(value: string) { this.set(ControlStyle.allProperty, value); }

    static alignContentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "alignContent", new PropertyMetadata(new AnyConstraint()));
    get alignContent(): string { return this.get(ControlStyle.alignContentProperty); }
    set alignContent(value: string) { this.set(ControlStyle.alignContentProperty, value); }

    static alignItemsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "alignItems", new PropertyMetadata(new AnyConstraint()));
    get alignItems(): string { return this.get(ControlStyle.alignItemsProperty); }
    set alignItems(value: string) { this.set(ControlStyle.alignItemsProperty, value); }

    static alignSelfProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "alignSelf", new PropertyMetadata(new AnyConstraint()));
    get alignSelf(): string { return this.get(ControlStyle.alignSelfProperty); }
    set alignSelf(value: string) { this.set(ControlStyle.alignSelfProperty, value); }

    static alignmentBaselineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "alignmentBaseline", new PropertyMetadata(new AnyConstraint()));
    get alignmentBaseline(): string { return this.get(ControlStyle.alignmentBaselineProperty); }
    set alignmentBaseline(value: string) { this.set(ControlStyle.alignmentBaselineProperty, value); }

    static animationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animation", new PropertyMetadata(new AnyConstraint()));
    get animation(): string { return this.get(ControlStyle.animationProperty); }
    set animation(value: string) { this.set(ControlStyle.animationProperty, value); }

    static animationDelayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationDelay", new PropertyMetadata(new AnyConstraint()));
    get animationDelay(): string { return this.get(ControlStyle.animationDelayProperty); }
    set animationDelay(value: string) { this.set(ControlStyle.animationDelayProperty, value); }

    static animationDirectionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationDirection", new PropertyMetadata(new AnyConstraint()));
    get animationDirection(): string { return this.get(ControlStyle.animationDirectionProperty); }
    set animationDirection(value: string) { this.set(ControlStyle.animationDirectionProperty, value); }

    static animationDurationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationDuration", new PropertyMetadata(new AnyConstraint()));
    get animationDuration(): string { return this.get(ControlStyle.animationDurationProperty); }
    set animationDuration(value: string) { this.set(ControlStyle.animationDurationProperty, value); }

    static animationFillModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationFillMode", new PropertyMetadata(new AnyConstraint()));
    get animationFillMode(): string { return this.get(ControlStyle.animationFillModeProperty); }
    set animationFillMode(value: string) { this.set(ControlStyle.animationFillModeProperty, value); }

    static animationIterationCountProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationIterationCount", new PropertyMetadata(new AnyConstraint()));
    get animationIterationCount(): string { return this.get(ControlStyle.animationIterationCountProperty); }
    set animationIterationCount(value: string) { this.set(ControlStyle.animationIterationCountProperty, value); }

    static animationNameProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationName", new PropertyMetadata(new AnyConstraint()));
    get animationName(): string { return this.get(ControlStyle.animationNameProperty); }
    set animationName(value: string) { this.set(ControlStyle.animationNameProperty, value); }

    static animationPlayStateProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationPlayState", new PropertyMetadata(Type.get(String)));
    get animationPlayState(): string { return this.get(ControlStyle.animationPlayStateProperty); }
    set animationPlayState(value: string) { this.set(ControlStyle.animationPlayStateProperty, value); }

    static animationTimingFunctionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "animationTimingFunction", new PropertyMetadata(new AnyConstraint()));
    get animationTimingFunction(): string { return this.get(ControlStyle.animationTimingFunctionProperty); }
    set animationTimingFunction(value: string) { this.set(ControlStyle.animationTimingFunctionProperty, value); }

    static backfaceVisibilityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backfaceVisibility", new PropertyMetadata(new AnyConstraint()));
    get backfaceVisibility(): string { return this.get(ControlStyle.backfaceVisibilityProperty); }
    set backfaceVisibility(value: string) { this.set(ControlStyle.backfaceVisibilityProperty, value); }

    static backgroundProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "background", new PropertyMetadata(new AnyConstraint()));
    get background(): string { return this.get(ControlStyle.backgroundProperty); }
    set background(value: string) { this.set(ControlStyle.backgroundProperty, value); }

    static backgroundAttachmentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundAttachment", new PropertyMetadata(new AnyConstraint()));
    get backgroundAttachment(): string { return this.get(ControlStyle.backgroundAttachmentProperty); }
    set backgroundAttachment(value: string) { this.set(ControlStyle.backgroundAttachmentProperty, value); }

    static backgroundClipProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundClip", new PropertyMetadata(new AnyConstraint()));
    get backgroundClip(): string { return this.get(ControlStyle.backgroundClipProperty); }
    set backgroundClip(value: string) { this.set(ControlStyle.backgroundClipProperty, value); }

    static backgroundColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundColor", new PropertyMetadata(new AnyConstraint()));
    get backgroundColor(): string { return this.get(ControlStyle.backgroundColorProperty); }
    set backgroundColor(value: string) { this.set(ControlStyle.backgroundColorProperty, value); }

    static backgroundImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundImage", new PropertyMetadata(new AnyConstraint()));
    get backgroundImage(): string { return this.get(ControlStyle.backgroundImageProperty); }
    set backgroundImage(value: string) { this.set(ControlStyle.backgroundImageProperty, value); }

    static backgroundOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundOrigin", new PropertyMetadata(new AnyConstraint()));
    get backgroundOrigin(): string { return this.get(ControlStyle.backgroundOriginProperty); }
    set backgroundOrigin(value: string) { this.set(ControlStyle.backgroundOriginProperty, value); }

    static backgroundPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundPosition", new PropertyMetadata(new AnyConstraint()));
    get backgroundPosition(): string { return this.get(ControlStyle.backgroundPositionProperty); }
    set backgroundPosition(value: string) { this.set(ControlStyle.backgroundPositionProperty, value); }

    static backgroundPositionXProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundPositionX", new PropertyMetadata(new AnyConstraint()));
    get backgroundPositionX(): string { return this.get(ControlStyle.backgroundPositionXProperty); }
    set backgroundPositionX(value: string) { this.set(ControlStyle.backgroundPositionXProperty, value); }

    static backgroundPositionYProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundPositionY", new PropertyMetadata(new AnyConstraint()));
    get backgroundPositionY(): string { return this.get(ControlStyle.backgroundPositionYProperty); }
    set backgroundPositionY(value: string) { this.set(ControlStyle.backgroundPositionYProperty, value); }

    static backgroundRepeatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundRepeat", new PropertyMetadata(new AnyConstraint()));
    get backgroundRepeat(): string { return this.get(ControlStyle.backgroundRepeatProperty); }
    set backgroundRepeat(value: string) { this.set(ControlStyle.backgroundRepeatProperty, value); }

    static backgroundSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "backgroundSize", new PropertyMetadata(new AnyConstraint()));
    get backgroundSize(): string { return this.get(ControlStyle.backgroundSizeProperty); }
    set backgroundSize(value: string) { this.set(ControlStyle.backgroundSizeProperty, value); }

    static baselineShiftProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "baselineShift", new PropertyMetadata(new AnyConstraint()));
    get baselineShift(): string { return this.get(ControlStyle.baselineShiftProperty); }
    set baselineShift(value: string) { this.set(ControlStyle.baselineShiftProperty, value); }

    static blockSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "blockSize", new PropertyMetadata(new AnyConstraint()));
    get blockSize(): string { return this.get(ControlStyle.blockSizeProperty); }
    set blockSize(value: string) { this.set(ControlStyle.blockSizeProperty, value); }

    static borderProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "border", new PropertyMetadata(new AnyConstraint()));
    get border(): string { return this.get(ControlStyle.borderProperty); }
    set border(value: string) { this.set(ControlStyle.borderProperty, value); }

    static borderBlockEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockEnd", new PropertyMetadata(new AnyConstraint()));
    get borderBlockEnd(): string { return this.get(ControlStyle.borderBlockEndProperty); }
    set borderBlockEnd(value: string) { this.set(ControlStyle.borderBlockEndProperty, value); }

    static borderBlockEndColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockEndColor", new PropertyMetadata(new AnyConstraint()));
    get borderBlockEndColor(): string { return this.get(ControlStyle.borderBlockEndColorProperty); }
    set borderBlockEndColor(value: string) { this.set(ControlStyle.borderBlockEndColorProperty, value); }

    static borderBlockEndStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockEndStyle", new PropertyMetadata(new AnyConstraint()));
    get borderBlockEndStyle(): string { return this.get(ControlStyle.borderBlockEndStyleProperty); }
    set borderBlockEndStyle(value: string) { this.set(ControlStyle.borderBlockEndStyleProperty, value); }

    static borderBlockEndWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockEndWidth", new PropertyMetadata(new AnyConstraint()));
    get borderBlockEndWidth(): string { return this.get(ControlStyle.borderBlockEndWidthProperty); }
    set borderBlockEndWidth(value: string) { this.set(ControlStyle.borderBlockEndWidthProperty, value); }

    static borderBlockStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockStart", new PropertyMetadata(new AnyConstraint()));
    get borderBlockStart(): string { return this.get(ControlStyle.borderBlockStartProperty); }
    set borderBlockStart(value: string) { this.set(ControlStyle.borderBlockStartProperty, value); }

    static borderBlockStartColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockStartColor", new PropertyMetadata(new AnyConstraint()));
    get borderBlockStartColor(): string { return this.get(ControlStyle.borderBlockStartColorProperty); }
    set borderBlockStartColor(value: string) { this.set(ControlStyle.borderBlockStartColorProperty, value); }

    static borderBlockStartStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockStartStyle", new PropertyMetadata(new AnyConstraint()));
    get borderBlockStartStyle(): string { return this.get(ControlStyle.borderBlockStartStyleProperty); }
    set borderBlockStartStyle(value: string) { this.set(ControlStyle.borderBlockStartStyleProperty, value); }

    static borderBlockStartWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBlockStartWidth", new PropertyMetadata(new AnyConstraint()));
    get borderBlockStartWidth(): string { return this.get(ControlStyle.borderBlockStartWidthProperty); }
    set borderBlockStartWidth(value: string) { this.set(ControlStyle.borderBlockStartWidthProperty, value); }

    static borderBottomProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottom", new PropertyMetadata(new AnyConstraint()));
    get borderBottom(): string { return this.get(ControlStyle.borderBottomProperty); }
    set borderBottom(value: string) { this.set(ControlStyle.borderBottomProperty, value); }

    static borderBottomColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottomColor", new PropertyMetadata(new AnyConstraint()));
    get borderBottomColor(): string { return this.get(ControlStyle.borderBottomColorProperty); }
    set borderBottomColor(value: string) { this.set(ControlStyle.borderBottomColorProperty, value); }

    static borderBottomLeftRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottomLeftRadius", new PropertyMetadata(new AnyConstraint()));
    get borderBottomLeftRadius(): string { return this.get(ControlStyle.borderBottomLeftRadiusProperty); }
    set borderBottomLeftRadius(value: string) { this.set(ControlStyle.borderBottomLeftRadiusProperty, value); }

    static borderBottomRightRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottomRightRadius", new PropertyMetadata(new AnyConstraint()));
    get borderBottomRightRadius(): string { return this.get(ControlStyle.borderBottomRightRadiusProperty); }
    set borderBottomRightRadius(value: string) { this.set(ControlStyle.borderBottomRightRadiusProperty, value); }

    static borderBottomStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottomStyle", new PropertyMetadata(new AnyConstraint()));
    get borderBottomStyle(): string { return this.get(ControlStyle.borderBottomStyleProperty); }
    set borderBottomStyle(value: string) { this.set(ControlStyle.borderBottomStyleProperty, value); }

    static borderBottomWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderBottomWidth", new PropertyMetadata(new AnyConstraint()));
    get borderBottomWidth(): string { return this.get(ControlStyle.borderBottomWidthProperty); }
    set borderBottomWidth(value: string) { this.set(ControlStyle.borderBottomWidthProperty, value); }

    static borderCollapseProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderCollapse", new PropertyMetadata(new AnyConstraint()));
    get borderCollapse(): string { return this.get(ControlStyle.borderCollapseProperty); }
    set borderCollapse(value: string) { this.set(ControlStyle.borderCollapseProperty, value); }

    static borderColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderColor", new PropertyMetadata(new AnyConstraint()));
    get borderColor(): string { return this.get(ControlStyle.borderColorProperty); }
    set borderColor(value: string) { this.set(ControlStyle.borderColorProperty, value); }

    static borderImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImage", new PropertyMetadata(new AnyConstraint()));
    get borderImage(): string { return this.get(ControlStyle.borderImageProperty); }
    set borderImage(value: string) { this.set(ControlStyle.borderImageProperty, value); }

    static borderImageOutsetProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImageOutset", new PropertyMetadata(new AnyConstraint()));
    get borderImageOutset(): string { return this.get(ControlStyle.borderImageOutsetProperty); }
    set borderImageOutset(value: string) { this.set(ControlStyle.borderImageOutsetProperty, value); }

    static borderImageRepeatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImageRepeat", new PropertyMetadata(new AnyConstraint()));
    get borderImageRepeat(): string { return this.get(ControlStyle.borderImageRepeatProperty); }
    set borderImageRepeat(value: string) { this.set(ControlStyle.borderImageRepeatProperty, value); }

    static borderImageSliceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImageSlice", new PropertyMetadata(new AnyConstraint()));
    get borderImageSlice(): string { return this.get(ControlStyle.borderImageSliceProperty); }
    set borderImageSlice(value: string) { this.set(ControlStyle.borderImageSliceProperty, value); }

    static borderImageSourceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImageSource", new PropertyMetadata(new AnyConstraint()));
    get borderImageSource(): string { return this.get(ControlStyle.borderImageSourceProperty); }
    set borderImageSource(value: string) { this.set(ControlStyle.borderImageSourceProperty, value); }

    static borderImageWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderImageWidth", new PropertyMetadata(new AnyConstraint()));
    get borderImageWidth(): string { return this.get(ControlStyle.borderImageWidthProperty); }
    set borderImageWidth(value: string) { this.set(ControlStyle.borderImageWidthProperty, value); }

    static borderInlineEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineEnd", new PropertyMetadata(new AnyConstraint()));
    get borderInlineEnd(): string { return this.get(ControlStyle.borderInlineEndProperty); }
    set borderInlineEnd(value: string) { this.set(ControlStyle.borderInlineEndProperty, value); }

    static borderInlineEndColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineEndColor", new PropertyMetadata(new AnyConstraint()));
    get borderInlineEndColor(): string { return this.get(ControlStyle.borderInlineEndColorProperty); }
    set borderInlineEndColor(value: string) { this.set(ControlStyle.borderInlineEndColorProperty, value); }

    static borderInlineEndStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineEndStyle", new PropertyMetadata(new AnyConstraint()));
    get borderInlineEndStyle(): string { return this.get(ControlStyle.borderInlineEndStyleProperty); }
    set borderInlineEndStyle(value: string) { this.set(ControlStyle.borderInlineEndStyleProperty, value); }

    static borderInlineEndWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineEndWidth", new PropertyMetadata(new AnyConstraint()));
    get borderInlineEndWidth(): string { return this.get(ControlStyle.borderInlineEndWidthProperty); }
    set borderInlineEndWidth(value: string) { this.set(ControlStyle.borderInlineEndWidthProperty, value); }

    static borderInlineStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineStart", new PropertyMetadata(new AnyConstraint()));
    get borderInlineStart(): string { return this.get(ControlStyle.borderInlineStartProperty); }
    set borderInlineStart(value: string) { this.set(ControlStyle.borderInlineStartProperty, value); }

    static borderInlineStartColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineStartColor", new PropertyMetadata(new AnyConstraint()));
    get borderInlineStartColor(): string { return this.get(ControlStyle.borderInlineStartColorProperty); }
    set borderInlineStartColor(value: string) { this.set(ControlStyle.borderInlineStartColorProperty, value); }

    static borderInlineStartStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineStartStyle", new PropertyMetadata(new AnyConstraint()));
    get borderInlineStartStyle(): string { return this.get(ControlStyle.borderInlineStartStyleProperty); }
    set borderInlineStartStyle(value: string) { this.set(ControlStyle.borderInlineStartStyleProperty, value); }

    static borderInlineStartWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderInlineStartWidth", new PropertyMetadata(new AnyConstraint()));
    get borderInlineStartWidth(): string { return this.get(ControlStyle.borderInlineStartWidthProperty); }
    set borderInlineStartWidth(value: string) { this.set(ControlStyle.borderInlineStartWidthProperty, value); }

    static borderLeftProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderLeft", new PropertyMetadata(new AnyConstraint()));
    get borderLeft(): string { return this.get(ControlStyle.borderLeftProperty); }
    set borderLeft(value: string) { this.set(ControlStyle.borderLeftProperty, value); }

    static borderLeftColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderLeftColor", new PropertyMetadata(new AnyConstraint()));
    get borderLeftColor(): string { return this.get(ControlStyle.borderLeftColorProperty); }
    set borderLeftColor(value: string) { this.set(ControlStyle.borderLeftColorProperty, value); }

    static borderLeftStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderLeftStyle", new PropertyMetadata(new AnyConstraint()));
    get borderLeftStyle(): string { return this.get(ControlStyle.borderLeftStyleProperty); }
    set borderLeftStyle(value: string) { this.set(ControlStyle.borderLeftStyleProperty, value); }

    static borderLeftWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderLeftWidth", new PropertyMetadata(new AnyConstraint()));
    get borderLeftWidth(): string { return this.get(ControlStyle.borderLeftWidthProperty); }
    set borderLeftWidth(value: string) { this.set(ControlStyle.borderLeftWidthProperty, value); }

    static borderRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderRadius", new PropertyMetadata(new AnyConstraint()));
    get borderRadius(): string { return this.get(ControlStyle.borderRadiusProperty); }
    set borderRadius(value: string) { this.set(ControlStyle.borderRadiusProperty, value); }

    static borderRightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderRight", new PropertyMetadata(new AnyConstraint()));
    get borderRight(): string { return this.get(ControlStyle.borderRightProperty); }
    set borderRight(value: string) { this.set(ControlStyle.borderRightProperty, value); }

    static borderRightColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderRightColor", new PropertyMetadata(new AnyConstraint()));
    get borderRightColor(): string { return this.get(ControlStyle.borderRightColorProperty); }
    set borderRightColor(value: string) { this.set(ControlStyle.borderRightColorProperty, value); }

    static borderRightStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderRightStyle", new PropertyMetadata(new AnyConstraint()));
    get borderRightStyle(): string { return this.get(ControlStyle.borderRightStyleProperty); }
    set borderRightStyle(value: string) { this.set(ControlStyle.borderRightStyleProperty, value); }

    static borderRightWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderRightWidth", new PropertyMetadata(new AnyConstraint()));
    get borderRightWidth(): string { return this.get(ControlStyle.borderRightWidthProperty); }
    set borderRightWidth(value: string) { this.set(ControlStyle.borderRightWidthProperty, value); }

    static borderSpacingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderSpacing", new PropertyMetadata(new AnyConstraint()));
    get borderSpacing(): string { return this.get(ControlStyle.borderSpacingProperty); }
    set borderSpacing(value: string) { this.set(ControlStyle.borderSpacingProperty, value); }

    static borderStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderStyle", new PropertyMetadata(new AnyConstraint()));
    get borderStyle(): string { return this.get(ControlStyle.borderStyleProperty); }
    set borderStyle(value: string) { this.set(ControlStyle.borderStyleProperty, value); }

    static borderTopProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTop", new PropertyMetadata(new AnyConstraint()));
    get borderTop(): string { return this.get(ControlStyle.borderTopProperty); }
    set borderTop(value: string) { this.set(ControlStyle.borderTopProperty, value); }

    static borderTopColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTopColor", new PropertyMetadata(new AnyConstraint()));
    get borderTopColor(): string { return this.get(ControlStyle.borderTopColorProperty); }
    set borderTopColor(value: string) { this.set(ControlStyle.borderTopColorProperty, value); }

    static borderTopLeftRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTopLeftRadius", new PropertyMetadata(new AnyConstraint()));
    get borderTopLeftRadius(): string { return this.get(ControlStyle.borderTopLeftRadiusProperty); }
    set borderTopLeftRadius(value: string) { this.set(ControlStyle.borderTopLeftRadiusProperty, value); }

    static borderTopRightRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTopRightRadius", new PropertyMetadata(new AnyConstraint()));
    get borderTopRightRadius(): string { return this.get(ControlStyle.borderTopRightRadiusProperty); }
    set borderTopRightRadius(value: string) { this.set(ControlStyle.borderTopRightRadiusProperty, value); }

    static borderTopStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTopStyle", new PropertyMetadata(new AnyConstraint()));
    get borderTopStyle(): string { return this.get(ControlStyle.borderTopStyleProperty); }
    set borderTopStyle(value: string) { this.set(ControlStyle.borderTopStyleProperty, value); }

    static borderTopWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderTopWidth", new PropertyMetadata(new AnyConstraint()));
    get borderTopWidth(): string { return this.get(ControlStyle.borderTopWidthProperty); }
    set borderTopWidth(value: string) { this.set(ControlStyle.borderTopWidthProperty, value); }

    static borderWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "borderWidth", new PropertyMetadata(new AnyConstraint()));
    get borderWidth(): string { return this.get(ControlStyle.borderWidthProperty); }
    set borderWidth(value: string) { this.set(ControlStyle.borderWidthProperty, value); }

    static bottomProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "bottom", new PropertyMetadata(new AnyConstraint()));
    get bottom(): string { return this.get(ControlStyle.bottomProperty); }
    set bottom(value: string) { this.set(ControlStyle.bottomProperty, value); }

    static boxShadowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "boxShadow", new PropertyMetadata(new AnyConstraint()));
    get boxShadow(): string { return this.get(ControlStyle.boxShadowProperty); }
    set boxShadow(value: string) { this.set(ControlStyle.boxShadowProperty, value); }

    static boxSizingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "boxSizing", new PropertyMetadata(new AnyConstraint()));
    get boxSizing(): string { return this.get(ControlStyle.boxSizingProperty); }
    set boxSizing(value: string) { this.set(ControlStyle.boxSizingProperty, value); }

    static breakAfterProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "breakAfter", new PropertyMetadata(new AnyConstraint()));
    get breakAfter(): string { return this.get(ControlStyle.breakAfterProperty); }
    set breakAfter(value: string) { this.set(ControlStyle.breakAfterProperty, value); }

    static breakBeforeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "breakBefore", new PropertyMetadata(new AnyConstraint()));
    get breakBefore(): string { return this.get(ControlStyle.breakBeforeProperty); }
    set breakBefore(value: string) { this.set(ControlStyle.breakBeforeProperty, value); }

    static breakInsideProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "breakInside", new PropertyMetadata(new AnyConstraint()));
    get breakInside(): string { return this.get(ControlStyle.breakInsideProperty); }
    set breakInside(value: string) { this.set(ControlStyle.breakInsideProperty, value); }

    static captionSideProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "captionSide", new PropertyMetadata(new AnyConstraint()));
    get captionSide(): string { return this.get(ControlStyle.captionSideProperty); }
    set captionSide(value: string) { this.set(ControlStyle.captionSideProperty, value); }

    static caretColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "caretColor", new PropertyMetadata(new AnyConstraint()));
    get caretColor(): string { return this.get(ControlStyle.caretColorProperty); }
    set caretColor(value: string) { this.set(ControlStyle.caretColorProperty, value); }

    static clearProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "clear", new PropertyMetadata(new AnyConstraint()));
    get clear(): string { return this.get(ControlStyle.clearProperty); }
    set clear(value: string) { this.set(ControlStyle.clearProperty, value); }

    static clipProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "clip", new PropertyMetadata(new AnyConstraint()));
    get clip(): string { return this.get(ControlStyle.clipProperty); }
    set clip(value: string) { this.set(ControlStyle.clipProperty, value); }

    static clipPathProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "clipPath", new PropertyMetadata(new AnyConstraint()));
    get clipPath(): string { return this.get(ControlStyle.clipPathProperty); }
    set clipPath(value: string) { this.set(ControlStyle.clipPathProperty, value); }

    static clipRuleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "clipRule", new PropertyMetadata(new AnyConstraint()));
    get clipRule(): string { return this.get(ControlStyle.clipRuleProperty); }
    set clipRule(value: string) { this.set(ControlStyle.clipRuleProperty, value); }

    static colorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "color", new PropertyMetadata(new AnyConstraint()));
    get color(): string { return this.get(ControlStyle.colorProperty); }
    set color(value: string) { this.set(ControlStyle.colorProperty, value); }

    static colorInterpolationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "colorInterpolation", new PropertyMetadata(new AnyConstraint()));
    get colorInterpolation(): string { return this.get(ControlStyle.colorInterpolationProperty); }
    set colorInterpolation(value: string) { this.set(ControlStyle.colorInterpolationProperty, value); }

    static colorInterpolationFiltersProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "colorInterpolationFilters", new PropertyMetadata(new AnyConstraint()));
    get colorInterpolationFilters(): string { return this.get(ControlStyle.colorInterpolationFiltersProperty); }
    set colorInterpolationFilters(value: string) { this.set(ControlStyle.colorInterpolationFiltersProperty, value); }

    static columnCountProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnCount", new PropertyMetadata(new AnyConstraint()));
    get columnCount(): string { return this.get(ControlStyle.columnCountProperty); }
    set columnCount(value: string) { this.set(ControlStyle.columnCountProperty, value); }

    static columnFillProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnFill", new PropertyMetadata(new AnyConstraint()));
    get columnFill(): string { return this.get(ControlStyle.columnFillProperty); }
    set columnFill(value: string) { this.set(ControlStyle.columnFillProperty, value); }

    static columnGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnGap", new PropertyMetadata(new AnyConstraint()));
    get columnGap(): string { return this.get(ControlStyle.columnGapProperty); }
    set columnGap(value: string) { this.set(ControlStyle.columnGapProperty, value); }

    static columnRuleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnRule", new PropertyMetadata(new AnyConstraint()));
    get columnRule(): string { return this.get(ControlStyle.columnRuleProperty); }
    set columnRule(value: string) { this.set(ControlStyle.columnRuleProperty, value); }

    static columnRuleColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnRuleColor", new PropertyMetadata(new AnyConstraint()));
    get columnRuleColor(): string { return this.get(ControlStyle.columnRuleColorProperty); }
    set columnRuleColor(value: string) { this.set(ControlStyle.columnRuleColorProperty, value); }

    static columnRuleStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnRuleStyle", new PropertyMetadata(new AnyConstraint()));
    get columnRuleStyle(): string { return this.get(ControlStyle.columnRuleStyleProperty); }
    set columnRuleStyle(value: string) { this.set(ControlStyle.columnRuleStyleProperty, value); }

    static columnRuleWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnRuleWidth", new PropertyMetadata(new AnyConstraint()));
    get columnRuleWidth(): string { return this.get(ControlStyle.columnRuleWidthProperty); }
    set columnRuleWidth(value: string) { this.set(ControlStyle.columnRuleWidthProperty, value); }

    static columnSpanProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnSpan", new PropertyMetadata(new AnyConstraint()));
    get columnSpan(): string { return this.get(ControlStyle.columnSpanProperty); }
    set columnSpan(value: string) { this.set(ControlStyle.columnSpanProperty, value); }

    static columnWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columnWidth", new PropertyMetadata(new AnyConstraint()));
    get columnWidth(): string { return this.get(ControlStyle.columnWidthProperty); }
    set columnWidth(value: string) { this.set(ControlStyle.columnWidthProperty, value); }

    static columnsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "columns", new PropertyMetadata(new AnyConstraint()));
    get columns(): string { return this.get(ControlStyle.columnsProperty); }
    set columns(value: string) { this.set(ControlStyle.columnsProperty, value); }

    static contentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "content", new PropertyMetadata(new AnyConstraint()));
    get content(): string { return this.get(ControlStyle.contentProperty); }
    set content(value: string) { this.set(ControlStyle.contentProperty, value); }

    static counterIncrementProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "counterIncrement", new PropertyMetadata(new AnyConstraint()));
    get counterIncrement(): string { return this.get(ControlStyle.counterIncrementProperty); }
    set counterIncrement(value: string) { this.set(ControlStyle.counterIncrementProperty, value); }

    static counterResetProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "counterReset", new PropertyMetadata(new AnyConstraint()));
    get counterReset(): string { return this.get(ControlStyle.counterResetProperty); }
    set counterReset(value: string) { this.set(ControlStyle.counterResetProperty, value); }

    static cssFloatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "cssFloat", new PropertyMetadata(new AnyConstraint()));
    get cssFloat(): string | null { return this.get(ControlStyle.cssFloatProperty); }
    set cssFloat(value: string | null) { this.set(ControlStyle.cssFloatProperty, value); }

    static cssTextProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "cssText", new PropertyMetadata(new AnyConstraint()));
    get cssText(): string { return this.get(ControlStyle.cssTextProperty); }
    set cssText(value: string) { this.set(ControlStyle.cssTextProperty, value); }

    static cursorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "cursor", new PropertyMetadata(new AnyConstraint()));
    get cursor(): string { return this.get(ControlStyle.cursorProperty); }
    set cursor(value: string) { this.set(ControlStyle.cursorProperty, value); }

    static directionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "direction", new PropertyMetadata(new AnyConstraint()));
    get direction(): string { return this.get(ControlStyle.directionProperty); }
    set direction(value: string) { this.set(ControlStyle.directionProperty, value); }

    static displayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "display", new PropertyMetadata(new AnyConstraint()));
    get display(): string { return this.get(ControlStyle.displayProperty); }
    set display(value: string) { this.set(ControlStyle.displayProperty, value); }

    static dominantBaselineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "dominantBaseline", new PropertyMetadata(new AnyConstraint()));
    get dominantBaseline(): string { return this.get(ControlStyle.dominantBaselineProperty); }
    set dominantBaseline(value: string) { this.set(ControlStyle.dominantBaselineProperty, value); }

    static emptyCellsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "emptyCells", new PropertyMetadata(new AnyConstraint()));
    get emptyCells(): string { return this.get(ControlStyle.emptyCellsProperty); }
    set emptyCells(value: string) { this.set(ControlStyle.emptyCellsProperty, value); }

    static enableBackgroundProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "enableBackground", new PropertyMetadata(new AnyConstraint()));
    get enableBackground(): string | null { return this.get(ControlStyle.enableBackgroundProperty); }
    set enableBackground(value: string | null) { this.set(ControlStyle.enableBackgroundProperty, value); }

    static fillProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fill", new PropertyMetadata(new AnyConstraint()));
    get fill(): string { return this.get(ControlStyle.fillProperty); }
    set fill(value: string) { this.set(ControlStyle.fillProperty, value); }

    static fillOpacityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fillOpacity", new PropertyMetadata(new AnyConstraint()));
    get fillOpacity(): string { return this.get(ControlStyle.fillOpacityProperty); }
    set fillOpacity(value: string) { this.set(ControlStyle.fillOpacityProperty, value); }

    static fillRuleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fillRule", new PropertyMetadata(new AnyConstraint()));
    get fillRule(): string { return this.get(ControlStyle.fillRuleProperty); }
    set fillRule(value: string) { this.set(ControlStyle.fillRuleProperty, value); }

    static filterProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "filter", new PropertyMetadata(new AnyConstraint()));
    get filter(): string { return this.get(ControlStyle.filterProperty); }
    set filter(value: string) { this.set(ControlStyle.filterProperty, value); }

    static flexProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flex", new PropertyMetadata(new AnyConstraint()));
    get flex(): string { return this.get(ControlStyle.flexProperty); }
    set flex(value: string) { this.set(ControlStyle.flexProperty, value); }

    static flexBasisProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexBasis", new PropertyMetadata(new AnyConstraint()));
    get flexBasis(): string { return this.get(ControlStyle.flexBasisProperty); }
    set flexBasis(value: string) { this.set(ControlStyle.flexBasisProperty, value); }

    static flexDirectionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexDirection", new PropertyMetadata(new AnyConstraint()));
    get flexDirection(): string { return this.get(ControlStyle.flexDirectionProperty); }
    set flexDirection(value: string) { this.set(ControlStyle.flexDirectionProperty, value); }

    static flexFlowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexFlow", new PropertyMetadata(new AnyConstraint()));
    get flexFlow(): string { return this.get(ControlStyle.flexFlowProperty); }
    set flexFlow(value: string) { this.set(ControlStyle.flexFlowProperty, value); }

    static flexGrowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexGrow", new PropertyMetadata(new AnyConstraint()));
    get flexGrow(): string { return this.get(ControlStyle.flexGrowProperty); }
    set flexGrow(value: string) { this.set(ControlStyle.flexGrowProperty, value); }

    static flexShrinkProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexShrink", new PropertyMetadata(new AnyConstraint()));
    get flexShrink(): string { return this.get(ControlStyle.flexShrinkProperty); }
    set flexShrink(value: string) { this.set(ControlStyle.flexShrinkProperty, value); }

    static flexWrapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "flexWrap", new PropertyMetadata(new AnyConstraint()));
    get flexWrap(): string { return this.get(ControlStyle.flexWrapProperty); }
    set flexWrap(value: string) { this.set(ControlStyle.flexWrapProperty, value); }

    static floatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "float", new PropertyMetadata(new AnyConstraint()));
    get float(): string { return this.get(ControlStyle.floatProperty); }
    set float(value: string) { this.set(ControlStyle.floatProperty, value); }

    static floodColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "floodColor", new PropertyMetadata(new AnyConstraint()));
    get floodColor(): string { return this.get(ControlStyle.floodColorProperty); }
    set floodColor(value: string) { this.set(ControlStyle.floodColorProperty, value); }

    static floodOpacityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "floodOpacity", new PropertyMetadata(new AnyConstraint()));
    get floodOpacity(): string { return this.get(ControlStyle.floodOpacityProperty); }
    set floodOpacity(value: string) { this.set(ControlStyle.floodOpacityProperty, value); }

    static fontProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "font", new PropertyMetadata(new AnyConstraint()));
    get font(): string { return this.get(ControlStyle.fontProperty); }
    set font(value: string) { this.set(ControlStyle.fontProperty, value); }

    static fontFamilyProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontFamily", new PropertyMetadata(new AnyConstraint()));
    get fontFamily(): string { return this.get(ControlStyle.fontFamilyProperty); }
    set fontFamily(value: string) { this.set(ControlStyle.fontFamilyProperty, value); }

    static fontFeatureSettingsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontFeatureSettings", new PropertyMetadata(new AnyConstraint()));
    get fontFeatureSettings(): string { return this.get(ControlStyle.fontFeatureSettingsProperty); }
    set fontFeatureSettings(value: string) { this.set(ControlStyle.fontFeatureSettingsProperty, value); }

    static fontKerningProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontKerning", new PropertyMetadata(new AnyConstraint()));
    get fontKerning(): string { return this.get(ControlStyle.fontKerningProperty); }
    set fontKerning(value: string) { this.set(ControlStyle.fontKerningProperty, value); }

    static fontSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontSize", new PropertyMetadata(new AnyConstraint()));
    get fontSize(): string { return this.get(ControlStyle.fontSizeProperty); }
    set fontSize(value: string) { this.set(ControlStyle.fontSizeProperty, value); }

    static fontSizeAdjustProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontSizeAdjust", new PropertyMetadata(new AnyConstraint()));
    get fontSizeAdjust(): string { return this.get(ControlStyle.fontSizeAdjustProperty); }
    set fontSizeAdjust(value: string) { this.set(ControlStyle.fontSizeAdjustProperty, value); }

    static fontStretchProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontStretch", new PropertyMetadata(new AnyConstraint()));
    get fontStretch(): string { return this.get(ControlStyle.fontStretchProperty); }
    set fontStretch(value: string) { this.set(ControlStyle.fontStretchProperty, value); }

    static fontStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontStyle", new PropertyMetadata(new AnyConstraint()));
    get fontStyle(): string { return this.get(ControlStyle.fontStyleProperty); }
    set fontStyle(value: string) { this.set(ControlStyle.fontStyleProperty, value); }

    static fontSynthesisProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontSynthesis", new PropertyMetadata(new AnyConstraint()));
    get fontSynthesis(): string { return this.get(ControlStyle.fontSynthesisProperty); }
    set fontSynthesis(value: string) { this.set(ControlStyle.fontSynthesisProperty, value); }

    static fontVariantProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariant", new PropertyMetadata(new AnyConstraint()));
    get fontVariant(): string { return this.get(ControlStyle.fontVariantProperty); }
    set fontVariant(value: string) { this.set(ControlStyle.fontVariantProperty, value); }

    static fontVariantCapsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariantCaps", new PropertyMetadata(new AnyConstraint()));
    get fontVariantCaps(): string { return this.get(ControlStyle.fontVariantCapsProperty); }
    set fontVariantCaps(value: string) { this.set(ControlStyle.fontVariantCapsProperty, value); }

    static fontVariantEastAsianProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariantEastAsian", new PropertyMetadata(new AnyConstraint()));
    get fontVariantEastAsian(): string { return this.get(ControlStyle.fontVariantEastAsianProperty); }
    set fontVariantEastAsian(value: string) { this.set(ControlStyle.fontVariantEastAsianProperty, value); }

    static fontVariantLigaturesProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariantLigatures", new PropertyMetadata(new AnyConstraint()));
    get fontVariantLigatures(): string { return this.get(ControlStyle.fontVariantLigaturesProperty); }
    set fontVariantLigatures(value: string) { this.set(ControlStyle.fontVariantLigaturesProperty, value); }

    static fontVariantNumericProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariantNumeric", new PropertyMetadata(new AnyConstraint()));
    get fontVariantNumeric(): string { return this.get(ControlStyle.fontVariantNumericProperty); }
    set fontVariantNumeric(value: string) { this.set(ControlStyle.fontVariantNumericProperty, value); }

    static fontVariantPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontVariantPosition", new PropertyMetadata(new AnyConstraint()));
    get fontVariantPosition(): string { return this.get(ControlStyle.fontVariantPositionProperty); }
    set fontVariantPosition(value: string) { this.set(ControlStyle.fontVariantPositionProperty, value); }

    static fontWeightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "fontWeight", new PropertyMetadata(new AnyConstraint()));
    get fontWeight(): string { return this.get(ControlStyle.fontWeightProperty); }
    set fontWeight(value: string) { this.set(ControlStyle.fontWeightProperty, value); }

    static gapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gap", new PropertyMetadata(new AnyConstraint()));
    get gap(): string { return this.get(ControlStyle.gapProperty); }
    set gap(value: string) { this.set(ControlStyle.gapProperty, value); }

    static glyphOrientationHorizontalProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "glyphOrientationHorizontal", new PropertyMetadata(new AnyConstraint()));
    get glyphOrientationHorizontal(): string | null { return this.get(ControlStyle.glyphOrientationHorizontalProperty); }
    set glyphOrientationHorizontal(value: string | null) { this.set(ControlStyle.glyphOrientationHorizontalProperty, value); }

    static glyphOrientationVerticalProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "glyphOrientationVertical", new PropertyMetadata(new AnyConstraint()));
    get glyphOrientationVertical(): string { return this.get(ControlStyle.glyphOrientationVerticalProperty); }
    set glyphOrientationVertical(value: string) { this.set(ControlStyle.glyphOrientationVerticalProperty, value); }

    static gridProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "grid", new PropertyMetadata(new AnyConstraint()));
    get grid(): string { return this.get(ControlStyle.gridProperty); }
    set grid(value: string) { this.set(ControlStyle.gridProperty, value); }

    static gridAreaProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridArea", new PropertyMetadata(new AnyConstraint()));
    get gridArea(): string { return this.get(ControlStyle.gridAreaProperty); }
    set gridArea(value: string) { this.set(ControlStyle.gridAreaProperty, value); }

    static gridAutoColumnsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridAutoColumns", new PropertyMetadata(new AnyConstraint()));
    get gridAutoColumns(): string { return this.get(ControlStyle.gridAutoColumnsProperty); }
    set gridAutoColumns(value: string) { this.set(ControlStyle.gridAutoColumnsProperty, value); }

    static gridAutoFlowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridAutoFlow", new PropertyMetadata(new AnyConstraint()));
    get gridAutoFlow(): string { return this.get(ControlStyle.gridAutoFlowProperty); }
    set gridAutoFlow(value: string) { this.set(ControlStyle.gridAutoFlowProperty, value); }

    static gridAutoRowsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridAutoRows", new PropertyMetadata(new AnyConstraint()));
    get gridAutoRows(): string { return this.get(ControlStyle.gridAutoRowsProperty); }
    set gridAutoRows(value: string) { this.set(ControlStyle.gridAutoRowsProperty, value); }

    static gridColumnProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridColumn", new PropertyMetadata(new AnyConstraint()));
    get gridColumn(): string { return this.get(ControlStyle.gridColumnProperty); }
    set gridColumn(value: string) { this.set(ControlStyle.gridColumnProperty, value); }

    static gridColumnEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridColumnEnd", new PropertyMetadata(new AnyConstraint()));
    get gridColumnEnd(): string { return this.get(ControlStyle.gridColumnEndProperty); }
    set gridColumnEnd(value: string) { this.set(ControlStyle.gridColumnEndProperty, value); }

    static gridColumnGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridColumnGap", new PropertyMetadata(new AnyConstraint()));
    get gridColumnGap(): string { return this.get(ControlStyle.gridColumnGapProperty); }
    set gridColumnGap(value: string) { this.set(ControlStyle.gridColumnGapProperty, value); }

    static gridColumnStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridColumnStart", new PropertyMetadata(new AnyConstraint()));
    get gridColumnStart(): string { return this.get(ControlStyle.gridColumnStartProperty); }
    set gridColumnStart(value: string) { this.set(ControlStyle.gridColumnStartProperty, value); }

    static gridGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridGap", new PropertyMetadata(new AnyConstraint()));
    get gridGap(): string { return this.get(ControlStyle.gridGapProperty); }
    set gridGap(value: string) { this.set(ControlStyle.gridGapProperty, value); }

    static gridRowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridRow", new PropertyMetadata(new AnyConstraint()));
    get gridRow(): string { return this.get(ControlStyle.gridRowProperty); }
    set gridRow(value: string) { this.set(ControlStyle.gridRowProperty, value); }

    static gridRowEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridRowEnd", new PropertyMetadata(new AnyConstraint()));
    get gridRowEnd(): string { return this.get(ControlStyle.gridRowEndProperty); }
    set gridRowEnd(value: string) { this.set(ControlStyle.gridRowEndProperty, value); }

    static gridRowGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridRowGap", new PropertyMetadata(new AnyConstraint()));
    get gridRowGap(): string { return this.get(ControlStyle.gridRowGapProperty); }
    set gridRowGap(value: string) { this.set(ControlStyle.gridRowGapProperty, value); }

    static gridRowStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridRowStart", new PropertyMetadata(new AnyConstraint()));
    get gridRowStart(): string { return this.get(ControlStyle.gridRowStartProperty); }
    set gridRowStart(value: string) { this.set(ControlStyle.gridRowStartProperty, value); }

    static gridTemplateProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridTemplate", new PropertyMetadata(new AnyConstraint()));
    get gridTemplate(): string { return this.get(ControlStyle.gridTemplateProperty); }
    set gridTemplate(value: string) { this.set(ControlStyle.gridTemplateProperty, value); }

    static gridTemplateAreasProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridTemplateAreas", new PropertyMetadata(new AnyConstraint()));
    get gridTemplateAreas(): string { return this.get(ControlStyle.gridTemplateAreasProperty); }
    set gridTemplateAreas(value: string) { this.set(ControlStyle.gridTemplateAreasProperty, value); }

    static gridTemplateColumnsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridTemplateColumns", new PropertyMetadata(new AnyConstraint()));
    get gridTemplateColumns(): string { return this.get(ControlStyle.gridTemplateColumnsProperty); }
    set gridTemplateColumns(value: string) { this.set(ControlStyle.gridTemplateColumnsProperty, value); }

    static gridTemplateRowsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "gridTemplateRows", new PropertyMetadata(new AnyConstraint()));
    get gridTemplateRows(): string { return this.get(ControlStyle.gridTemplateRowsProperty); }
    set gridTemplateRows(value: string) { this.set(ControlStyle.gridTemplateRowsProperty, value); }

    static heightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "height", new PropertyMetadata(new AnyConstraint()));
    get height(): string { return this.get(ControlStyle.heightProperty); }
    set height(value: string) { this.set(ControlStyle.heightProperty, value); }

    static hyphensProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "hyphens", new PropertyMetadata(new AnyConstraint()));
    get hyphens(): string { return this.get(ControlStyle.hyphensProperty); }
    set hyphens(value: string) { this.set(ControlStyle.hyphensProperty, value); }

    static imageOrientationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "imageOrientation", new PropertyMetadata(new AnyConstraint()));
    get imageOrientation(): string { return this.get(ControlStyle.imageOrientationProperty); }
    set imageOrientation(value: string) { this.set(ControlStyle.imageOrientationProperty, value); }

    static imageRenderingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "imageRendering", new PropertyMetadata(new AnyConstraint()));
    get imageRendering(): string { return this.get(ControlStyle.imageRenderingProperty); }
    set imageRendering(value: string) { this.set(ControlStyle.imageRenderingProperty, value); }

    static imeModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "imeMode", new PropertyMetadata(new AnyConstraint()));
    get imeMode(): string | null { return this.get(ControlStyle.imeModeProperty); }
    set imeMode(value: string | null) { this.set(ControlStyle.imeModeProperty, value); }

    static inlineSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "inlineSize", new PropertyMetadata(new AnyConstraint()));
    get inlineSize(): string { return this.get(ControlStyle.inlineSizeProperty); }
    set inlineSize(value: string) { this.set(ControlStyle.inlineSizeProperty, value); }

    static justifyContentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "justifyContent", new PropertyMetadata(new AnyConstraint()));
    get justifyContent(): string { return this.get(ControlStyle.justifyContentProperty); }
    set justifyContent(value: string) { this.set(ControlStyle.justifyContentProperty, value); }

    static justifyItemsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "justifyItems", new PropertyMetadata(new AnyConstraint()));
    get justifyItems(): string { return this.get(ControlStyle.justifyItemsProperty); }
    set justifyItems(value: string) { this.set(ControlStyle.justifyItemsProperty, value); }

    static justifySelfProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "justifySelf", new PropertyMetadata(new AnyConstraint()));
    get justifySelf(): string { return this.get(ControlStyle.justifySelfProperty); }
    set justifySelf(value: string) { this.set(ControlStyle.justifySelfProperty, value); }

    static kerningProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "kerning", new PropertyMetadata(new AnyConstraint()));
    get kerning(): string | null { return this.get(ControlStyle.kerningProperty); }
    set kerning(value: string | null) { this.set(ControlStyle.kerningProperty, value); }

    static layoutGridProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "layoutGrid", new PropertyMetadata(new AnyConstraint()));
    get layoutGrid(): string | null { return this.get(ControlStyle.layoutGridProperty); }
    set layoutGrid(value: string | null) { this.set(ControlStyle.layoutGridProperty, value); }

    static layoutGridCharProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "layoutGridChar", new PropertyMetadata(new AnyConstraint()));
    get layoutGridChar(): string | null { return this.get(ControlStyle.layoutGridCharProperty); }
    set layoutGridChar(value: string | null) { this.set(ControlStyle.layoutGridCharProperty, value); }

    static layoutGridLineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "layoutGridLine", new PropertyMetadata(new AnyConstraint()));
    get layoutGridLine(): string | null { return this.get(ControlStyle.layoutGridLineProperty); }
    set layoutGridLine(value: string | null) { this.set(ControlStyle.layoutGridLineProperty, value); }

    static layoutGridModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "layoutGridMode", new PropertyMetadata(new AnyConstraint()));
    get layoutGridMode(): string | null { return this.get(ControlStyle.layoutGridModeProperty); }
    set layoutGridMode(value: string | null) { this.set(ControlStyle.layoutGridModeProperty, value); }

    static layoutGridTypeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "layoutGridType", new PropertyMetadata(new AnyConstraint()));
    get layoutGridType(): string | null { return this.get(ControlStyle.layoutGridTypeProperty); }
    set layoutGridType(value: string | null) { this.set(ControlStyle.layoutGridTypeProperty, value); }

    static leftProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "left", new PropertyMetadata(new AnyConstraint()));
    get left(): string { return this.get(ControlStyle.leftProperty); }
    set left(value: string) { this.set(ControlStyle.leftProperty, value); }

    static lengthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "length", new PropertyMetadata(new AnyConstraint()));
    get length(): number { return this.get(ControlStyle.lengthProperty); }
    set length(value: number) { this.set(ControlStyle.lengthProperty, value); }

    static letterSpacingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "letterSpacing", new PropertyMetadata(new AnyConstraint()));
    get letterSpacing(): string { return this.get(ControlStyle.letterSpacingProperty); }
    set letterSpacing(value: string) { this.set(ControlStyle.letterSpacingProperty, value); }

    static lightingColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "lightingColor", new PropertyMetadata(new AnyConstraint()));
    get lightingColor(): string { return this.get(ControlStyle.lightingColorProperty); }
    set lightingColor(value: string) { this.set(ControlStyle.lightingColorProperty, value); }

    static lineBreakProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "lineBreak", new PropertyMetadata(new AnyConstraint()));
    get lineBreak(): string { return this.get(ControlStyle.lineBreakProperty); }
    set lineBreak(value: string) { this.set(ControlStyle.lineBreakProperty, value); }

    static lineHeightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "lineHeight", new PropertyMetadata(new AnyConstraint()));
    get lineHeight(): string { return this.get(ControlStyle.lineHeightProperty); }
    set lineHeight(value: string) { this.set(ControlStyle.lineHeightProperty, value); }

    static listStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "listStyle", new PropertyMetadata(new AnyConstraint()));
    get listStyle(): string { return this.get(ControlStyle.listStyleProperty); }
    set listStyle(value: string) { this.set(ControlStyle.listStyleProperty, value); }

    static listStyleImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "listStyleImage", new PropertyMetadata(new AnyConstraint()));
    get listStyleImage(): string { return this.get(ControlStyle.listStyleImageProperty); }
    set listStyleImage(value: string) { this.set(ControlStyle.listStyleImageProperty, value); }

    static listStylePositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "listStylePosition", new PropertyMetadata(new AnyConstraint()));
    get listStylePosition(): string { return this.get(ControlStyle.listStylePositionProperty); }
    set listStylePosition(value: string) { this.set(ControlStyle.listStylePositionProperty, value); }

    static listStyleTypeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "listStyleType", new PropertyMetadata(new AnyConstraint()));
    get listStyleType(): string { return this.get(ControlStyle.listStyleTypeProperty); }
    set listStyleType(value: string) { this.set(ControlStyle.listStyleTypeProperty, value); }

    static marginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "margin", new PropertyMetadata(new AnyConstraint()));
    get margin(): string { return this.get(ControlStyle.marginProperty); }
    set margin(value: string) { this.set(ControlStyle.marginProperty, value); }

    static marginBlockEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginBlockEnd", new PropertyMetadata(new AnyConstraint()));
    get marginBlockEnd(): string { return this.get(ControlStyle.marginBlockEndProperty); }
    set marginBlockEnd(value: string) { this.set(ControlStyle.marginBlockEndProperty, value); }

    static marginBlockStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginBlockStart", new PropertyMetadata(new AnyConstraint()));
    get marginBlockStart(): string { return this.get(ControlStyle.marginBlockStartProperty); }
    set marginBlockStart(value: string) { this.set(ControlStyle.marginBlockStartProperty, value); }

    static marginBottomProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginBottom", new PropertyMetadata(new AnyConstraint()));
    get marginBottom(): string { return this.get(ControlStyle.marginBottomProperty); }
    set marginBottom(value: string) { this.set(ControlStyle.marginBottomProperty, value); }

    static marginInlineEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginInlineEnd", new PropertyMetadata(new AnyConstraint()));
    get marginInlineEnd(): string { return this.get(ControlStyle.marginInlineEndProperty); }
    set marginInlineEnd(value: string) { this.set(ControlStyle.marginInlineEndProperty, value); }

    static marginInlineStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginInlineStart", new PropertyMetadata(new AnyConstraint()));
    get marginInlineStart(): string { return this.get(ControlStyle.marginInlineStartProperty); }
    set marginInlineStart(value: string) { this.set(ControlStyle.marginInlineStartProperty, value); }

    static marginLeftProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginLeft", new PropertyMetadata(new AnyConstraint()));
    get marginLeft(): string { return this.get(ControlStyle.marginLeftProperty); }
    set marginLeft(value: string) { this.set(ControlStyle.marginLeftProperty, value); }

    static marginRightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginRight", new PropertyMetadata(new AnyConstraint()));
    get marginRight(): string { return this.get(ControlStyle.marginRightProperty); }
    set marginRight(value: string) { this.set(ControlStyle.marginRightProperty, value); }

    static marginTopProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marginTop", new PropertyMetadata(new AnyConstraint()));
    get marginTop(): string { return this.get(ControlStyle.marginTopProperty); }
    set marginTop(value: string) { this.set(ControlStyle.marginTopProperty, value); }

    static markerProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "marker", new PropertyMetadata(new AnyConstraint()));
    get marker(): string { return this.get(ControlStyle.markerProperty); }
    set marker(value: string) { this.set(ControlStyle.markerProperty, value); }

    static markerEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "markerEnd", new PropertyMetadata(new AnyConstraint()));
    get markerEnd(): string { return this.get(ControlStyle.markerEndProperty); }
    set markerEnd(value: string) { this.set(ControlStyle.markerEndProperty, value); }

    static markerMidProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "markerMid", new PropertyMetadata(new AnyConstraint()));
    get markerMid(): string { return this.get(ControlStyle.markerMidProperty); }
    set markerMid(value: string) { this.set(ControlStyle.markerMidProperty, value); }

    static markerStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "markerStart", new PropertyMetadata(new AnyConstraint()));
    get markerStart(): string { return this.get(ControlStyle.markerStartProperty); }
    set markerStart(value: string) { this.set(ControlStyle.markerStartProperty, value); }

    static maskProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "mask", new PropertyMetadata(new AnyConstraint()));
    get mask(): string { return this.get(ControlStyle.maskProperty); }
    set mask(value: string) { this.set(ControlStyle.maskProperty, value); }

    static maskCompositeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskComposite", new PropertyMetadata(new AnyConstraint()));
    get maskComposite(): string { return this.get(ControlStyle.maskCompositeProperty); }
    set maskComposite(value: string) { this.set(ControlStyle.maskCompositeProperty, value); }

    static maskImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskImage", new PropertyMetadata(new AnyConstraint()));
    get maskImage(): string { return this.get(ControlStyle.maskImageProperty); }
    set maskImage(value: string) { this.set(ControlStyle.maskImageProperty, value); }

    static maskPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskPosition", new PropertyMetadata(new AnyConstraint()));
    get maskPosition(): string { return this.get(ControlStyle.maskPositionProperty); }
    set maskPosition(value: string) { this.set(ControlStyle.maskPositionProperty, value); }

    static maskRepeatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskRepeat", new PropertyMetadata(new AnyConstraint()));
    get maskRepeat(): string { return this.get(ControlStyle.maskRepeatProperty); }
    set maskRepeat(value: string) { this.set(ControlStyle.maskRepeatProperty, value); }

    static maskSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskSize", new PropertyMetadata(new AnyConstraint()));
    get maskSize(): string { return this.get(ControlStyle.maskSizeProperty); }
    set maskSize(value: string) { this.set(ControlStyle.maskSizeProperty, value); }

    static maskTypeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maskType", new PropertyMetadata(new AnyConstraint()));
    get maskType(): string { return this.get(ControlStyle.maskTypeProperty); }
    set maskType(value: string) { this.set(ControlStyle.maskTypeProperty, value); }

    static maxBlockSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maxBlockSize", new PropertyMetadata(new AnyConstraint()));
    get maxBlockSize(): string { return this.get(ControlStyle.maxBlockSizeProperty); }
    set maxBlockSize(value: string) { this.set(ControlStyle.maxBlockSizeProperty, value); }

    static maxHeightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maxHeight", new PropertyMetadata(new AnyConstraint()));
    get maxHeight(): string { return this.get(ControlStyle.maxHeightProperty); }
    set maxHeight(value: string) { this.set(ControlStyle.maxHeightProperty, value); }

    static maxInlineSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maxInlineSize", new PropertyMetadata(new AnyConstraint()));
    get maxInlineSize(): string { return this.get(ControlStyle.maxInlineSizeProperty); }
    set maxInlineSize(value: string) { this.set(ControlStyle.maxInlineSizeProperty, value); }

    static maxWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "maxWidth", new PropertyMetadata(new AnyConstraint()));
    get maxWidth(): string { return this.get(ControlStyle.maxWidthProperty); }
    set maxWidth(value: string) { this.set(ControlStyle.maxWidthProperty, value); }

    static minBlockSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "minBlockSize", new PropertyMetadata(new AnyConstraint()));
    get minBlockSize(): string { return this.get(ControlStyle.minBlockSizeProperty); }
    set minBlockSize(value: string) { this.set(ControlStyle.minBlockSizeProperty, value); }

    static minHeightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "minHeight", new PropertyMetadata(new AnyConstraint()));
    get minHeight(): string { return this.get(ControlStyle.minHeightProperty); }
    set minHeight(value: string) { this.set(ControlStyle.minHeightProperty, value); }

    static minInlineSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "minInlineSize", new PropertyMetadata(new AnyConstraint()));
    get minInlineSize(): string { return this.get(ControlStyle.minInlineSizeProperty); }
    set minInlineSize(value: string) { this.set(ControlStyle.minInlineSizeProperty, value); }

    static minWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "minWidth", new PropertyMetadata(new AnyConstraint()));
    get minWidth(): string { return this.get(ControlStyle.minWidthProperty); }
    set minWidth(value: string) { this.set(ControlStyle.minWidthProperty, value); }

    static msContentZoomChainingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomChaining", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomChaining(): string | null { return this.get(ControlStyle.msContentZoomChainingProperty); }
    set msContentZoomChaining(value: string | null) { this.set(ControlStyle.msContentZoomChainingProperty, value); }

    static msContentZoomLimitProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomLimit", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomLimit(): string | null { return this.get(ControlStyle.msContentZoomLimitProperty); }
    set msContentZoomLimit(value: string | null) { this.set(ControlStyle.msContentZoomLimitProperty, value); }

    static msContentZoomLimitMaxProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomLimitMax", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomLimitMax(): any { return this.get(ControlStyle.msContentZoomLimitMaxProperty); }
    set msContentZoomLimitMax(value: any) { this.set(ControlStyle.msContentZoomLimitMaxProperty, value); }

    static msContentZoomLimitMinProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomLimitMin", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomLimitMin(): any { return this.get(ControlStyle.msContentZoomLimitMinProperty); }
    set msContentZoomLimitMin(value: any) { this.set(ControlStyle.msContentZoomLimitMinProperty, value); }

    static msContentZoomSnapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomSnap", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomSnap(): string | null { return this.get(ControlStyle.msContentZoomSnapProperty); }
    set msContentZoomSnap(value: string | null) { this.set(ControlStyle.msContentZoomSnapProperty, value); }

    static msContentZoomSnapPointsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomSnapPoints", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomSnapPoints(): string | null { return this.get(ControlStyle.msContentZoomSnapPointsProperty); }
    set msContentZoomSnapPoints(value: string | null) { this.set(ControlStyle.msContentZoomSnapPointsProperty, value); }

    static msContentZoomSnapTypeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZoomSnapType", new PropertyMetadata(new AnyConstraint()));
    get msContentZoomSnapType(): string | null { return this.get(ControlStyle.msContentZoomSnapTypeProperty); }
    set msContentZoomSnapType(value: string | null) { this.set(ControlStyle.msContentZoomSnapTypeProperty, value); }

    static msContentZoomingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msContentZooming", new PropertyMetadata(new AnyConstraint()));
    get msContentZooming(): string | null { return this.get(ControlStyle.msContentZoomingProperty); }
    set msContentZooming(value: string | null) { this.set(ControlStyle.msContentZoomingProperty, value); }

    static msFlowFromProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msFlowFrom", new PropertyMetadata(new AnyConstraint()));
    get msFlowFrom(): string | null { return this.get(ControlStyle.msFlowFromProperty); }
    set msFlowFrom(value: string | null) { this.set(ControlStyle.msFlowFromProperty, value); }

    static msFlowIntoProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msFlowInto", new PropertyMetadata(new AnyConstraint()));
    get msFlowInto(): string | null { return this.get(ControlStyle.msFlowIntoProperty); }
    set msFlowInto(value: string | null) { this.set(ControlStyle.msFlowIntoProperty, value); }

    static msFontFeatureSettingsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msFontFeatureSettings", new PropertyMetadata(new AnyConstraint()));
    get msFontFeatureSettings(): string | null { return this.get(ControlStyle.msFontFeatureSettingsProperty); }
    set msFontFeatureSettings(value: string | null) { this.set(ControlStyle.msFontFeatureSettingsProperty, value); }

    static msGridColumnProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridColumn", new PropertyMetadata(new AnyConstraint()));
    get msGridColumn(): any { return this.get(ControlStyle.msGridColumnProperty); }
    set msGridColumn(value: any) { this.set(ControlStyle.msGridColumnProperty, value); }

    static msGridColumnAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridColumnAlign", new PropertyMetadata(new AnyConstraint()));
    get msGridColumnAlign(): string | null { return this.get(ControlStyle.msGridColumnAlignProperty); }
    set msGridColumnAlign(value: string | null) { this.set(ControlStyle.msGridColumnAlignProperty, value); }

    static msGridColumnSpanProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridColumnSpan", new PropertyMetadata(new AnyConstraint()));
    get msGridColumnSpan(): any { return this.get(ControlStyle.msGridColumnSpanProperty); }
    set msGridColumnSpan(value: any) { this.set(ControlStyle.msGridColumnSpanProperty, value); }

    static msGridColumnsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridColumns", new PropertyMetadata(new AnyConstraint()));
    get msGridColumns(): string | null { return this.get(ControlStyle.msGridColumnsProperty); }
    set msGridColumns(value: string | null) { this.set(ControlStyle.msGridColumnsProperty, value); }

    static msGridRowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridRow", new PropertyMetadata(new AnyConstraint()));
    get msGridRow(): any { return this.get(ControlStyle.msGridRowProperty); }
    set msGridRow(value: any) { this.set(ControlStyle.msGridRowProperty, value); }

    static msGridRowAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridRowAlign", new PropertyMetadata(new AnyConstraint()));
    get msGridRowAlign(): string | null { return this.get(ControlStyle.msGridRowAlignProperty); }
    set msGridRowAlign(value: string | null) { this.set(ControlStyle.msGridRowAlignProperty, value); }

    static msGridRowSpanProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridRowSpan", new PropertyMetadata(new AnyConstraint()));
    get msGridRowSpan(): any { return this.get(ControlStyle.msGridRowSpanProperty); }
    set msGridRowSpan(value: any) { this.set(ControlStyle.msGridRowSpanProperty, value); }

    static msGridRowsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msGridRows", new PropertyMetadata(new AnyConstraint()));
    get msGridRows(): string | null { return this.get(ControlStyle.msGridRowsProperty); }
    set msGridRows(value: string | null) { this.set(ControlStyle.msGridRowsProperty, value); }

    static msHighContrastAdjustProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msHighContrastAdjust", new PropertyMetadata(new AnyConstraint()));
    get msHighContrastAdjust(): string | null { return this.get(ControlStyle.msHighContrastAdjustProperty); }
    set msHighContrastAdjust(value: string | null) { this.set(ControlStyle.msHighContrastAdjustProperty, value); }

    static msHyphenateLimitCharsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msHyphenateLimitChars", new PropertyMetadata(new AnyConstraint()));
    get msHyphenateLimitChars(): string | null { return this.get(ControlStyle.msHyphenateLimitCharsProperty); }
    set msHyphenateLimitChars(value: string | null) { this.set(ControlStyle.msHyphenateLimitCharsProperty, value); }

    static msHyphenateLimitLinesProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msHyphenateLimitLines", new PropertyMetadata(new AnyConstraint()));
    get msHyphenateLimitLines(): any { return this.get(ControlStyle.msHyphenateLimitLinesProperty); }
    set msHyphenateLimitLines(value: any) { this.set(ControlStyle.msHyphenateLimitLinesProperty, value); }

    static msHyphenateLimitZoneProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msHyphenateLimitZone", new PropertyMetadata(new AnyConstraint()));
    get msHyphenateLimitZone(): any { return this.get(ControlStyle.msHyphenateLimitZoneProperty); }
    set msHyphenateLimitZone(value: any) { this.set(ControlStyle.msHyphenateLimitZoneProperty, value); }

    static msHyphensProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msHyphens", new PropertyMetadata(new AnyConstraint()));
    get msHyphens(): string | null { return this.get(ControlStyle.msHyphensProperty); }
    set msHyphens(value: string | null) { this.set(ControlStyle.msHyphensProperty, value); }

    static msImeAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msImeAlign", new PropertyMetadata(new AnyConstraint()));
    get msImeAlign(): string | null { return this.get(ControlStyle.msImeAlignProperty); }
    set msImeAlign(value: string | null) { this.set(ControlStyle.msImeAlignProperty, value); }

    static msOverflowStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msOverflowStyle", new PropertyMetadata(new AnyConstraint()));
    get msOverflowStyle(): string | null { return this.get(ControlStyle.msOverflowStyleProperty); }
    set msOverflowStyle(value: string | null) { this.set(ControlStyle.msOverflowStyleProperty, value); }

    static msScrollChainingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollChaining", new PropertyMetadata(new AnyConstraint()));
    get msScrollChaining(): string | null { return this.get(ControlStyle.msScrollChainingProperty); }
    set msScrollChaining(value: string | null) { this.set(ControlStyle.msScrollChainingProperty, value); }

    static msScrollLimitProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollLimit", new PropertyMetadata(new AnyConstraint()));
    get msScrollLimit(): string | null { return this.get(ControlStyle.msScrollLimitProperty); }
    set msScrollLimit(value: string | null) { this.set(ControlStyle.msScrollLimitProperty, value); }

    static msScrollLimitXMaxProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollLimitXMax", new PropertyMetadata(new AnyConstraint()));
    get msScrollLimitXMax(): any { return this.get(ControlStyle.msScrollLimitXMaxProperty); }
    set msScrollLimitXMax(value: any) { this.set(ControlStyle.msScrollLimitXMaxProperty, value); }

    static msScrollLimitXMinProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollLimitXMin", new PropertyMetadata(new AnyConstraint()));
    get msScrollLimitXMin(): any { return this.get(ControlStyle.msScrollLimitXMinProperty); }
    set msScrollLimitXMin(value: any) { this.set(ControlStyle.msScrollLimitXMinProperty, value); }

    static msScrollLimitYMaxProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollLimitYMax", new PropertyMetadata(new AnyConstraint()));
    get msScrollLimitYMax(): any { return this.get(ControlStyle.msScrollLimitYMaxProperty); }
    set msScrollLimitYMax(value: any) { this.set(ControlStyle.msScrollLimitYMaxProperty, value); }

    static msScrollLimitYMinProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollLimitYMin", new PropertyMetadata(new AnyConstraint()));
    get msScrollLimitYMin(): any { return this.get(ControlStyle.msScrollLimitYMinProperty); }
    set msScrollLimitYMin(value: any) { this.set(ControlStyle.msScrollLimitYMinProperty, value); }

    static msScrollRailsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollRails", new PropertyMetadata(new AnyConstraint()));
    get msScrollRails(): string | null { return this.get(ControlStyle.msScrollRailsProperty); }
    set msScrollRails(value: string | null) { this.set(ControlStyle.msScrollRailsProperty, value); }

    static msScrollSnapPointsXProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollSnapPointsX", new PropertyMetadata(new AnyConstraint()));
    get msScrollSnapPointsX(): string | null { return this.get(ControlStyle.msScrollSnapPointsXProperty); }
    set msScrollSnapPointsX(value: string | null) { this.set(ControlStyle.msScrollSnapPointsXProperty, value); }

    static msScrollSnapPointsYProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollSnapPointsY", new PropertyMetadata(new AnyConstraint()));
    get msScrollSnapPointsY(): string | null { return this.get(ControlStyle.msScrollSnapPointsYProperty); }
    set msScrollSnapPointsY(value: string | null) { this.set(ControlStyle.msScrollSnapPointsYProperty, value); }

    static msScrollSnapTypeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollSnapType", new PropertyMetadata(new AnyConstraint()));
    get msScrollSnapType(): string | null { return this.get(ControlStyle.msScrollSnapTypeProperty); }
    set msScrollSnapType(value: string | null) { this.set(ControlStyle.msScrollSnapTypeProperty, value); }

    static msScrollSnapXProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollSnapX", new PropertyMetadata(new AnyConstraint()));
    get msScrollSnapX(): string | null { return this.get(ControlStyle.msScrollSnapXProperty); }
    set msScrollSnapX(value: string | null) { this.set(ControlStyle.msScrollSnapXProperty, value); }

    static msScrollSnapYProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollSnapY", new PropertyMetadata(new AnyConstraint()));
    get msScrollSnapY(): string | null { return this.get(ControlStyle.msScrollSnapYProperty); }
    set msScrollSnapY(value: string | null) { this.set(ControlStyle.msScrollSnapYProperty, value); }

    static msScrollTranslationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msScrollTranslation", new PropertyMetadata(new AnyConstraint()));
    get msScrollTranslation(): string | null { return this.get(ControlStyle.msScrollTranslationProperty); }
    set msScrollTranslation(value: string | null) { this.set(ControlStyle.msScrollTranslationProperty, value); }

    static msTextCombineHorizontalProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msTextCombineHorizontal", new PropertyMetadata(new AnyConstraint()));
    get msTextCombineHorizontal(): string | null { return this.get(ControlStyle.msTextCombineHorizontalProperty); }
    set msTextCombineHorizontal(value: string | null) { this.set(ControlStyle.msTextCombineHorizontalProperty, value); }

    static msTextSizeAdjustProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msTextSizeAdjust", new PropertyMetadata(new AnyConstraint()));
    get msTextSizeAdjust(): any { return this.get(ControlStyle.msTextSizeAdjustProperty); }
    set msTextSizeAdjust(value: any) { this.set(ControlStyle.msTextSizeAdjustProperty, value); }

    static msTouchActionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msTouchAction", new PropertyMetadata(new AnyConstraint()));
    get msTouchAction(): string | null { return this.get(ControlStyle.msTouchActionProperty); }
    set msTouchAction(value: string | null) { this.set(ControlStyle.msTouchActionProperty, value); }

    static msTouchSelectProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msTouchSelect", new PropertyMetadata(new AnyConstraint()));
    get msTouchSelect(): string | null { return this.get(ControlStyle.msTouchSelectProperty); }
    set msTouchSelect(value: string | null) { this.set(ControlStyle.msTouchSelectProperty, value); }

    static msUserSelectProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msUserSelect", new PropertyMetadata(new AnyConstraint()));
    get msUserSelect(): string | null { return this.get(ControlStyle.msUserSelectProperty); }
    set msUserSelect(value: string | null) { this.set(ControlStyle.msUserSelectProperty, value); }

    static msWrapFlowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msWrapFlow", new PropertyMetadata(new AnyConstraint()));
    get msWrapFlow(): string { return this.get(ControlStyle.msWrapFlowProperty); }
    set msWrapFlow(value: string) { this.set(ControlStyle.msWrapFlowProperty, value); }

    static msWrapMarginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msWrapMargin", new PropertyMetadata(new AnyConstraint()));
    get msWrapMargin(): any { return this.get(ControlStyle.msWrapMarginProperty); }
    set msWrapMargin(value: any) { this.set(ControlStyle.msWrapMarginProperty, value); }

    static msWrapThroughProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "msWrapThrough", new PropertyMetadata(new AnyConstraint()));
    get msWrapThrough(): string { return this.get(ControlStyle.msWrapThroughProperty); }
    set msWrapThrough(value: string) { this.set(ControlStyle.msWrapThroughProperty, value); }

    static objectFitProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "objectFit", new PropertyMetadata(new AnyConstraint()));
    get objectFit(): string { return this.get(ControlStyle.objectFitProperty); }
    set objectFit(value: string) { this.set(ControlStyle.objectFitProperty, value); }

    static objectPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "objectPosition", new PropertyMetadata(new AnyConstraint()));
    get objectPosition(): string { return this.get(ControlStyle.objectPositionProperty); }
    set objectPosition(value: string) { this.set(ControlStyle.objectPositionProperty, value); }

    static opacityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "opacity", new PropertyMetadata(new AnyConstraint()));
    get opacity(): string { return this.get(ControlStyle.opacityProperty); }
    set opacity(value: string) { this.set(ControlStyle.opacityProperty, value); }

    static orderProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "order", new PropertyMetadata(new AnyConstraint()));
    get order(): string { return this.get(ControlStyle.orderProperty); }
    set order(value: string) { this.set(ControlStyle.orderProperty, value); }

    static orphansProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "orphans", new PropertyMetadata(new AnyConstraint()));
    get orphans(): string { return this.get(ControlStyle.orphansProperty); }
    set orphans(value: string) { this.set(ControlStyle.orphansProperty, value); }

    static outlineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "outline", new PropertyMetadata(new AnyConstraint()));
    get outline(): string { return this.get(ControlStyle.outlineProperty); }
    set outline(value: string) { this.set(ControlStyle.outlineProperty, value); }

    static outlineColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "outlineColor", new PropertyMetadata(new AnyConstraint()));
    get outlineColor(): string { return this.get(ControlStyle.outlineColorProperty); }
    set outlineColor(value: string) { this.set(ControlStyle.outlineColorProperty, value); }

    static outlineOffsetProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "outlineOffset", new PropertyMetadata(new AnyConstraint()));
    get outlineOffset(): string { return this.get(ControlStyle.outlineOffsetProperty); }
    set outlineOffset(value: string) { this.set(ControlStyle.outlineOffsetProperty, value); }

    static outlineStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "outlineStyle", new PropertyMetadata(new AnyConstraint()));
    get outlineStyle(): string { return this.get(ControlStyle.outlineStyleProperty); }
    set outlineStyle(value: string) { this.set(ControlStyle.outlineStyleProperty, value); }

    static outlineWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "outlineWidth", new PropertyMetadata(new AnyConstraint()));
    get outlineWidth(): string { return this.get(ControlStyle.outlineWidthProperty); }
    set outlineWidth(value: string) { this.set(ControlStyle.outlineWidthProperty, value); }

    static overflowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overflow", new PropertyMetadata(new AnyConstraint()));
    get overflow(): string { return this.get(ControlStyle.overflowProperty); }
    set overflow(value: string) { this.set(ControlStyle.overflowProperty, value); }

    static overflowAnchorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overflowAnchor", new PropertyMetadata(new AnyConstraint()));
    get overflowAnchor(): string { return this.get(ControlStyle.overflowAnchorProperty); }
    set overflowAnchor(value: string) { this.set(ControlStyle.overflowAnchorProperty, value); }

    static overflowWrapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overflowWrap", new PropertyMetadata(new AnyConstraint()));
    get overflowWrap(): string { return this.get(ControlStyle.overflowWrapProperty); }
    set overflowWrap(value: string) { this.set(ControlStyle.overflowWrapProperty, value); }

    static overflowXProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overflowX", new PropertyMetadata(new AnyConstraint()));
    get overflowX(): string { return this.get(ControlStyle.overflowXProperty); }
    set overflowX(value: string) { this.set(ControlStyle.overflowXProperty, value); }

    static overflowYProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overflowY", new PropertyMetadata(new AnyConstraint()));
    get overflowY(): string { return this.get(ControlStyle.overflowYProperty); }
    set overflowY(value: string) { this.set(ControlStyle.overflowYProperty, value); }

    static overscrollBehaviorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overscrollBehavior", new PropertyMetadata(new AnyConstraint()));
    get overscrollBehavior(): string { return this.get(ControlStyle.overscrollBehaviorProperty); }
    set overscrollBehavior(value: string) { this.set(ControlStyle.overscrollBehaviorProperty, value); }

    static overscrollBehaviorBlockProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overscrollBehaviorBlock", new PropertyMetadata(new AnyConstraint()));
    get overscrollBehaviorBlock(): string { return this.get(ControlStyle.overscrollBehaviorBlockProperty); }
    set overscrollBehaviorBlock(value: string) { this.set(ControlStyle.overscrollBehaviorBlockProperty, value); }

    static overscrollBehaviorInlineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overscrollBehaviorInline", new PropertyMetadata(new AnyConstraint()));
    get overscrollBehaviorInline(): string { return this.get(ControlStyle.overscrollBehaviorInlineProperty); }
    set overscrollBehaviorInline(value: string) { this.set(ControlStyle.overscrollBehaviorInlineProperty, value); }

    static overscrollBehaviorXProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overscrollBehaviorX", new PropertyMetadata(new AnyConstraint()));
    get overscrollBehaviorX(): string { return this.get(ControlStyle.overscrollBehaviorXProperty); }
    set overscrollBehaviorX(value: string) { this.set(ControlStyle.overscrollBehaviorXProperty, value); }

    static overscrollBehaviorYProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "overscrollBehaviorY", new PropertyMetadata(new AnyConstraint()));
    get overscrollBehaviorY(): string { return this.get(ControlStyle.overscrollBehaviorYProperty); }
    set overscrollBehaviorY(value: string) { this.set(ControlStyle.overscrollBehaviorYProperty, value); }

    static paddingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "padding", new PropertyMetadata(new AnyConstraint()));
    get padding(): string { return this.get(ControlStyle.paddingProperty); }
    set padding(value: string) { this.set(ControlStyle.paddingProperty, value); }

    static paddingBlockEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingBlockEnd", new PropertyMetadata(new AnyConstraint()));
    get paddingBlockEnd(): string { return this.get(ControlStyle.paddingBlockEndProperty); }
    set paddingBlockEnd(value: string) { this.set(ControlStyle.paddingBlockEndProperty, value); }

    static paddingBlockStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingBlockStart", new PropertyMetadata(new AnyConstraint()));
    get paddingBlockStart(): string { return this.get(ControlStyle.paddingBlockStartProperty); }
    set paddingBlockStart(value: string) { this.set(ControlStyle.paddingBlockStartProperty, value); }

    static paddingBottomProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingBottom", new PropertyMetadata(new AnyConstraint()));
    get paddingBottom(): string { return this.get(ControlStyle.paddingBottomProperty); }
    set paddingBottom(value: string) { this.set(ControlStyle.paddingBottomProperty, value); }

    static paddingInlineEndProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingInlineEnd", new PropertyMetadata(new AnyConstraint()));
    get paddingInlineEnd(): string { return this.get(ControlStyle.paddingInlineEndProperty); }
    set paddingInlineEnd(value: string) { this.set(ControlStyle.paddingInlineEndProperty, value); }

    static paddingInlineStartProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingInlineStart", new PropertyMetadata(new AnyConstraint()));
    get paddingInlineStart(): string { return this.get(ControlStyle.paddingInlineStartProperty); }
    set paddingInlineStart(value: string) { this.set(ControlStyle.paddingInlineStartProperty, value); }

    static paddingLeftProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingLeft", new PropertyMetadata(new AnyConstraint()));
    get paddingLeft(): string { return this.get(ControlStyle.paddingLeftProperty); }
    set paddingLeft(value: string) { this.set(ControlStyle.paddingLeftProperty, value); }

    static paddingRightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingRight", new PropertyMetadata(new AnyConstraint()));
    get paddingRight(): string { return this.get(ControlStyle.paddingRightProperty); }
    set paddingRight(value: string) { this.set(ControlStyle.paddingRightProperty, value); }

    static paddingTopProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paddingTop", new PropertyMetadata(new AnyConstraint()));
    get paddingTop(): string { return this.get(ControlStyle.paddingTopProperty); }
    set paddingTop(value: string) { this.set(ControlStyle.paddingTopProperty, value); }

    static pageBreakAfterProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "pageBreakAfter", new PropertyMetadata(new AnyConstraint()));
    get pageBreakAfter(): string { return this.get(ControlStyle.pageBreakAfterProperty); }
    set pageBreakAfter(value: string) { this.set(ControlStyle.pageBreakAfterProperty, value); }

    static pageBreakBeforeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "pageBreakBefore", new PropertyMetadata(new AnyConstraint()));
    get pageBreakBefore(): string { return this.get(ControlStyle.pageBreakBeforeProperty); }
    set pageBreakBefore(value: string) { this.set(ControlStyle.pageBreakBeforeProperty, value); }

    static pageBreakInsideProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "pageBreakInside", new PropertyMetadata(new AnyConstraint()));
    get pageBreakInside(): string { return this.get(ControlStyle.pageBreakInsideProperty); }
    set pageBreakInside(value: string) { this.set(ControlStyle.pageBreakInsideProperty, value); }

    static paintOrderProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "paintOrder", new PropertyMetadata(new AnyConstraint()));
    get paintOrder(): string { return this.get(ControlStyle.paintOrderProperty); }
    set paintOrder(value: string) { this.set(ControlStyle.paintOrderProperty, value); }

    static parentRuleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "parentRule", new PropertyMetadata(new AnyConstraint()));
    get parentRule(): CSSRule { return this.get(ControlStyle.parentRuleProperty); }
    set parentRule(value: CSSRule) { this.set(ControlStyle.parentRuleProperty, value); }

    static penActionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "penAction", new PropertyMetadata(new AnyConstraint()));
    get penAction(): string | null { return this.get(ControlStyle.penActionProperty); }
    set penAction(value: string | null) { this.set(ControlStyle.penActionProperty, value); }

    static perspectiveProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "perspective", new PropertyMetadata(new AnyConstraint()));
    get perspective(): string { return this.get(ControlStyle.perspectiveProperty); }
    set perspective(value: string) { this.set(ControlStyle.perspectiveProperty, value); }

    static perspectiveOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "perspectiveOrigin", new PropertyMetadata(new AnyConstraint()));
    get perspectiveOrigin(): string { return this.get(ControlStyle.perspectiveOriginProperty); }
    set perspectiveOrigin(value: string) { this.set(ControlStyle.perspectiveOriginProperty, value); }

    static placeContentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "placeContent", new PropertyMetadata(new AnyConstraint()));
    get placeContent(): string { return this.get(ControlStyle.placeContentProperty); }
    set placeContent(value: string) { this.set(ControlStyle.placeContentProperty, value); }

    static placeItemsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "placeItems", new PropertyMetadata(new AnyConstraint()));
    get placeItems(): string { return this.get(ControlStyle.placeItemsProperty); }
    set placeItems(value: string) { this.set(ControlStyle.placeItemsProperty, value); }

    static placeSelfProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "placeSelf", new PropertyMetadata(new AnyConstraint()));
    get placeSelf(): string { return this.get(ControlStyle.placeSelfProperty); }
    set placeSelf(value: string) { this.set(ControlStyle.placeSelfProperty, value); }

    static pointerEventsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "pointerEvents", new PropertyMetadata(new AnyConstraint()));
    get pointerEvents(): string | null { return this.get(ControlStyle.pointerEventsProperty); }
    set pointerEvents(value: string | null) { this.set(ControlStyle.pointerEventsProperty, value); }

    static positionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "position", new PropertyMetadata(new AnyConstraint()));
    get position(): string { return this.get(ControlStyle.positionProperty); }
    set position(value: string) { this.set(ControlStyle.positionProperty, value); }

    static quotesProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "quotes", new PropertyMetadata(new AnyConstraint()));
    get quotes(): string { return this.get(ControlStyle.quotesProperty); }
    set quotes(value: string) { this.set(ControlStyle.quotesProperty, value); }

    static resizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "resize", new PropertyMetadata(new AnyConstraint()));
    get resize(): string { return this.get(ControlStyle.resizeProperty); }
    set resize(value: string) { this.set(ControlStyle.resizeProperty, value); }

    static rightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "right", new PropertyMetadata(new AnyConstraint()));
    get right(): string { return this.get(ControlStyle.rightProperty); }
    set right(value: string) { this.set(ControlStyle.rightProperty, value); }

    static rotateProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "rotate", new PropertyMetadata(new AnyConstraint()));
    get rotate(): string { return this.get(ControlStyle.rotateProperty); }
    set rotate(value: string) { this.set(ControlStyle.rotateProperty, value); }

    static rowGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "rowGap", new PropertyMetadata(new AnyConstraint()));
    get rowGap(): string { return this.get(ControlStyle.rowGapProperty); }
    set rowGap(value: string) { this.set(ControlStyle.rowGapProperty, value); }

    static rubyAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "rubyAlign", new PropertyMetadata(new AnyConstraint()));
    get rubyAlign(): string { return this.get(ControlStyle.rubyAlignProperty); }
    set rubyAlign(value: string) { this.set(ControlStyle.rubyAlignProperty, value); }

    static rubyOverhangProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "rubyOverhang", new PropertyMetadata(new AnyConstraint()));
    get rubyOverhang(): string | null { return this.get(ControlStyle.rubyOverhangProperty); }
    set rubyOverhang(value: string | null) { this.set(ControlStyle.rubyOverhangProperty, value); }

    static rubyPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "rubyPosition", new PropertyMetadata(new AnyConstraint()));
    get rubyPosition(): string { return this.get(ControlStyle.rubyPositionProperty); }
    set rubyPosition(value: string) { this.set(ControlStyle.rubyPositionProperty, value); }

    static scaleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "scale", new PropertyMetadata(new AnyConstraint()));
    get scale(): string { return this.get(ControlStyle.scaleProperty); }
    set scale(value: string) { this.set(ControlStyle.scaleProperty, value); }

    static scrollBehaviorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "scrollBehavior", new PropertyMetadata(new AnyConstraint()));
    get scrollBehavior(): string { return this.get(ControlStyle.scrollBehaviorProperty); }
    set scrollBehavior(value: string) { this.set(ControlStyle.scrollBehaviorProperty, value); }

    static shapeRenderingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "shapeRendering", new PropertyMetadata(new AnyConstraint()));
    get shapeRendering(): string { return this.get(ControlStyle.shapeRenderingProperty); }
    set shapeRendering(value: string) { this.set(ControlStyle.shapeRenderingProperty, value); }

    static stopColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "stopColor", new PropertyMetadata(new AnyConstraint()));
    get stopColor(): string { return this.get(ControlStyle.stopColorProperty); }
    set stopColor(value: string) { this.set(ControlStyle.stopColorProperty, value); }

    static stopOpacityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "stopOpacity", new PropertyMetadata(new AnyConstraint()));
    get stopOpacity(): string { return this.get(ControlStyle.stopOpacityProperty); }
    set stopOpacity(value: string) { this.set(ControlStyle.stopOpacityProperty, value); }

    static strokeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "stroke", new PropertyMetadata(new AnyConstraint()));
    get stroke(): string { return this.get(ControlStyle.strokeProperty); }
    set stroke(value: string) { this.set(ControlStyle.strokeProperty, value); }

    static strokeDasharrayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeDasharray", new PropertyMetadata(new AnyConstraint()));
    get strokeDasharray(): string { return this.get(ControlStyle.strokeDasharrayProperty); }
    set strokeDasharray(value: string) { this.set(ControlStyle.strokeDasharrayProperty, value); }

    static strokeDashoffsetProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeDashoffset", new PropertyMetadata(new AnyConstraint()));
    get strokeDashoffset(): string { return this.get(ControlStyle.strokeDashoffsetProperty); }
    set strokeDashoffset(value: string) { this.set(ControlStyle.strokeDashoffsetProperty, value); }

    static strokeLinecapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeLinecap", new PropertyMetadata(new AnyConstraint()));
    get strokeLinecap(): string { return this.get(ControlStyle.strokeLinecapProperty); }
    set strokeLinecap(value: string) { this.set(ControlStyle.strokeLinecapProperty, value); }

    static strokeLinejoinProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeLinejoin", new PropertyMetadata(new AnyConstraint()));
    get strokeLinejoin(): string { return this.get(ControlStyle.strokeLinejoinProperty); }
    set strokeLinejoin(value: string) { this.set(ControlStyle.strokeLinejoinProperty, value); }

    static strokeMiterlimitProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeMiterlimit", new PropertyMetadata(new AnyConstraint()));
    get strokeMiterlimit(): string { return this.get(ControlStyle.strokeMiterlimitProperty); }
    set strokeMiterlimit(value: string) { this.set(ControlStyle.strokeMiterlimitProperty, value); }

    static strokeOpacityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeOpacity", new PropertyMetadata(new AnyConstraint()));
    get strokeOpacity(): string { return this.get(ControlStyle.strokeOpacityProperty); }
    set strokeOpacity(value: string) { this.set(ControlStyle.strokeOpacityProperty, value); }

    static strokeWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "strokeWidth", new PropertyMetadata(new AnyConstraint()));
    get strokeWidth(): string { return this.get(ControlStyle.strokeWidthProperty); }
    set strokeWidth(value: string) { this.set(ControlStyle.strokeWidthProperty, value); }

    static tabSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "tabSize", new PropertyMetadata(new AnyConstraint()));
    get tabSize(): string { return this.get(ControlStyle.tabSizeProperty); }
    set tabSize(value: string) { this.set(ControlStyle.tabSizeProperty, value); }

    static tableLayoutProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "tableLayout", new PropertyMetadata(new AnyConstraint()));
    get tableLayout(): string { return this.get(ControlStyle.tableLayoutProperty); }
    set tableLayout(value: string) { this.set(ControlStyle.tableLayoutProperty, value); }

    static textAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textAlign", new PropertyMetadata(new AnyConstraint()));
    get textAlign(): string { return this.get(ControlStyle.textAlignProperty); }
    set textAlign(value: string) { this.set(ControlStyle.textAlignProperty, value); }

    static textAlignLastProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textAlignLast", new PropertyMetadata(new AnyConstraint()));
    get textAlignLast(): string { return this.get(ControlStyle.textAlignLastProperty); }
    set textAlignLast(value: string) { this.set(ControlStyle.textAlignLastProperty, value); }

    static textAnchorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textAnchor", new PropertyMetadata(new AnyConstraint()));
    get textAnchor(): string { return this.get(ControlStyle.textAnchorProperty); }
    set textAnchor(value: string) { this.set(ControlStyle.textAnchorProperty, value); }

    static textCombineUprightProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textCombineUpright", new PropertyMetadata(new AnyConstraint()));
    get textCombineUpright(): string { return this.get(ControlStyle.textCombineUprightProperty); }
    set textCombineUpright(value: string) { this.set(ControlStyle.textCombineUprightProperty, value); }

    static textDecorationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textDecoration", new PropertyMetadata(new AnyConstraint()));
    get textDecoration(): string { return this.get(ControlStyle.textDecorationProperty); }
    set textDecoration(value: string) { this.set(ControlStyle.textDecorationProperty, value); }

    static textDecorationColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textDecorationColor", new PropertyMetadata(new AnyConstraint()));
    get textDecorationColor(): string { return this.get(ControlStyle.textDecorationColorProperty); }
    set textDecorationColor(value: string) { this.set(ControlStyle.textDecorationColorProperty, value); }

    static textDecorationLineProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textDecorationLine", new PropertyMetadata(new AnyConstraint()));
    get textDecorationLine(): string { return this.get(ControlStyle.textDecorationLineProperty); }
    set textDecorationLine(value: string) { this.set(ControlStyle.textDecorationLineProperty, value); }

    static textDecorationStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textDecorationStyle", new PropertyMetadata(new AnyConstraint()));
    get textDecorationStyle(): string { return this.get(ControlStyle.textDecorationStyleProperty); }
    set textDecorationStyle(value: string) { this.set(ControlStyle.textDecorationStyleProperty, value); }

    static textEmphasisProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textEmphasis", new PropertyMetadata(new AnyConstraint()));
    get textEmphasis(): string { return this.get(ControlStyle.textEmphasisProperty); }
    set textEmphasis(value: string) { this.set(ControlStyle.textEmphasisProperty, value); }

    static textEmphasisColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textEmphasisColor", new PropertyMetadata(new AnyConstraint()));
    get textEmphasisColor(): string { return this.get(ControlStyle.textEmphasisColorProperty); }
    set textEmphasisColor(value: string) { this.set(ControlStyle.textEmphasisColorProperty, value); }

    static textEmphasisPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textEmphasisPosition", new PropertyMetadata(new AnyConstraint()));
    get textEmphasisPosition(): string { return this.get(ControlStyle.textEmphasisPositionProperty); }
    set textEmphasisPosition(value: string) { this.set(ControlStyle.textEmphasisPositionProperty, value); }

    static textEmphasisStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textEmphasisStyle", new PropertyMetadata(new AnyConstraint()));
    get textEmphasisStyle(): string { return this.get(ControlStyle.textEmphasisStyleProperty); }
    set textEmphasisStyle(value: string) { this.set(ControlStyle.textEmphasisStyleProperty, value); }

    static textIndentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textIndent", new PropertyMetadata(new AnyConstraint()));
    get textIndent(): string { return this.get(ControlStyle.textIndentProperty); }
    set textIndent(value: string) { this.set(ControlStyle.textIndentProperty, value); }

    static textJustifyProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textJustify", new PropertyMetadata(new AnyConstraint()));
    get textJustify(): string { return this.get(ControlStyle.textJustifyProperty); }
    set textJustify(value: string) { this.set(ControlStyle.textJustifyProperty, value); }

    static textKashidaProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textKashida", new PropertyMetadata(new AnyConstraint()));
    get textKashida(): string | null { return this.get(ControlStyle.textKashidaProperty); }
    set textKashida(value: string | null) { this.set(ControlStyle.textKashidaProperty, value); }

    static textKashidaSpaceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textKashidaSpace", new PropertyMetadata(new AnyConstraint()));
    get textKashidaSpace(): string | null { return this.get(ControlStyle.textKashidaSpaceProperty); }
    set textKashidaSpace(value: string | null) { this.set(ControlStyle.textKashidaSpaceProperty, value); }

    static textOrientationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textOrientation", new PropertyMetadata(new AnyConstraint()));
    get textOrientation(): string { return this.get(ControlStyle.textOrientationProperty); }
    set textOrientation(value: string) { this.set(ControlStyle.textOrientationProperty, value); }

    static textOverflowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textOverflow", new PropertyMetadata(new AnyConstraint()));
    get textOverflow(): string { return this.get(ControlStyle.textOverflowProperty); }
    set textOverflow(value: string) { this.set(ControlStyle.textOverflowProperty, value); }

    static textRenderingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textRendering", new PropertyMetadata(new AnyConstraint()));
    get textRendering(): string { return this.get(ControlStyle.textRenderingProperty); }
    set textRendering(value: string) { this.set(ControlStyle.textRenderingProperty, value); }

    static textShadowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textShadow", new PropertyMetadata(new AnyConstraint()));
    get textShadow(): string { return this.get(ControlStyle.textShadowProperty); }
    set textShadow(value: string) { this.set(ControlStyle.textShadowProperty, value); }

    static textTransformProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textTransform", new PropertyMetadata(new AnyConstraint()));
    get textTransform(): string { return this.get(ControlStyle.textTransformProperty); }
    set textTransform(value: string) { this.set(ControlStyle.textTransformProperty, value); }

    static textUnderlinePositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "textUnderlinePosition", new PropertyMetadata(new AnyConstraint()));
    get textUnderlinePosition(): string { return this.get(ControlStyle.textUnderlinePositionProperty); }
    set textUnderlinePosition(value: string) { this.set(ControlStyle.textUnderlinePositionProperty, value); }

    static topProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "top", new PropertyMetadata(new AnyConstraint()));
    get top(): string { return this.get(ControlStyle.topProperty); }
    set top(value: string) { this.set(ControlStyle.topProperty, value); }

    static touchActionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "touchAction", new PropertyMetadata(new AnyConstraint()));
    get touchAction(): string { return this.get(ControlStyle.touchActionProperty); }
    set touchAction(value: string) { this.set(ControlStyle.touchActionProperty, value); }

    static transformProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transform", new PropertyMetadata(new AnyConstraint()));
    get transform(): string { return this.get(ControlStyle.transformProperty); }
    set transform(value: string) { this.set(ControlStyle.transformProperty, value); }

    static transformBoxProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transformBox", new PropertyMetadata(new AnyConstraint()));
    get transformBox(): string { return this.get(ControlStyle.transformBoxProperty); }
    set transformBox(value: string) { this.set(ControlStyle.transformBoxProperty, value); }

    static transformOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transformOrigin", new PropertyMetadata(new AnyConstraint()));
    get transformOrigin(): string { return this.get(ControlStyle.transformOriginProperty); }
    set transformOrigin(value: string) { this.set(ControlStyle.transformOriginProperty, value); }

    static transformStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transformStyle", new PropertyMetadata(new AnyConstraint()));
    get transformStyle(): string { return this.get(ControlStyle.transformStyleProperty); }
    set transformStyle(value: string) { this.set(ControlStyle.transformStyleProperty, value); }

    static transitionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transition", new PropertyMetadata(new AnyConstraint()));
    get transition(): string { return this.get(ControlStyle.transitionProperty); }
    set transition(value: string) { this.set(ControlStyle.transitionProperty, value); }

    static transitionDelayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transitionDelay", new PropertyMetadata(new AnyConstraint()));
    get transitionDelay(): string { return this.get(ControlStyle.transitionDelayProperty); }
    set transitionDelay(value: string) { this.set(ControlStyle.transitionDelayProperty, value); }

    static transitionDurationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transitionDuration", new PropertyMetadata(new AnyConstraint()));
    get transitionDuration(): string { return this.get(ControlStyle.transitionDurationProperty); }
    set transitionDuration(value: string) { this.set(ControlStyle.transitionDurationProperty, value); }

    static transitionPropertyProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transitionProperty", new PropertyMetadata(new AnyConstraint()));
    get transitionProperty(): string { return this.get(ControlStyle.transitionPropertyProperty); }
    set transitionProperty(value: string) { this.set(ControlStyle.transitionPropertyProperty, value); }

    static transitionTimingFunctionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "transitionTimingFunction", new PropertyMetadata(new AnyConstraint()));
    get transitionTimingFunction(): string { return this.get(ControlStyle.transitionTimingFunctionProperty); }
    set transitionTimingFunction(value: string) { this.set(ControlStyle.transitionTimingFunctionProperty, value); }

    static translateProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "translate", new PropertyMetadata(new AnyConstraint()));
    get translate(): string { return this.get(ControlStyle.translateProperty); }
    set translate(value: string) { this.set(ControlStyle.translateProperty, value); }

    static unicodeBidiProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "unicodeBidi", new PropertyMetadata(new AnyConstraint()));
    get unicodeBidi(): string { return this.get(ControlStyle.unicodeBidiProperty); }
    set unicodeBidi(value: string) { this.set(ControlStyle.unicodeBidiProperty, value); }

    static userSelectProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "userSelect", new PropertyMetadata(new AnyConstraint()));
    get userSelect(): string { return this.get(ControlStyle.userSelectProperty); }
    set userSelect(value: string) { this.set(ControlStyle.userSelectProperty, value); }

    static verticalAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "verticalAlign", new PropertyMetadata(new AnyConstraint()));
    get verticalAlign(): string { return this.get(ControlStyle.verticalAlignProperty); }
    set verticalAlign(value: string) { this.set(ControlStyle.verticalAlignProperty, value); }

    static visibilityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "visibility", new PropertyMetadata(new AnyConstraint()));
    get visibility(): string { return this.get(ControlStyle.visibilityProperty); }
    set visibility(value: string) { this.set(ControlStyle.visibilityProperty, value); }

    static webkitAlignContentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAlignContent", new PropertyMetadata(new AnyConstraint()));
    get webkitAlignContent(): string { return this.get(ControlStyle.webkitAlignContentProperty); }
    set webkitAlignContent(value: string) { this.set(ControlStyle.webkitAlignContentProperty, value); }

    static webkitAlignItemsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAlignItems", new PropertyMetadata(new AnyConstraint()));
    get webkitAlignItems(): string { return this.get(ControlStyle.webkitAlignItemsProperty); }
    set webkitAlignItems(value: string) { this.set(ControlStyle.webkitAlignItemsProperty, value); }

    static webkitAlignSelfProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAlignSelf", new PropertyMetadata(new AnyConstraint()));
    get webkitAlignSelf(): string { return this.get(ControlStyle.webkitAlignSelfProperty); }
    set webkitAlignSelf(value: string) { this.set(ControlStyle.webkitAlignSelfProperty, value); }

    static webkitAnimationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimation", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimation(): string { return this.get(ControlStyle.webkitAnimationProperty); }
    set webkitAnimation(value: string) { this.set(ControlStyle.webkitAnimationProperty, value); }

    static webkitAnimationDelayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationDelay", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationDelay(): string { return this.get(ControlStyle.webkitAnimationDelayProperty); }
    set webkitAnimationDelay(value: string) { this.set(ControlStyle.webkitAnimationDelayProperty, value); }

    static webkitAnimationDirectionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationDirection", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationDirection(): string { return this.get(ControlStyle.webkitAnimationDirectionProperty); }
    set webkitAnimationDirection(value: string) { this.set(ControlStyle.webkitAnimationDirectionProperty, value); }

    static webkitAnimationDurationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationDuration", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationDuration(): string { return this.get(ControlStyle.webkitAnimationDurationProperty); }
    set webkitAnimationDuration(value: string) { this.set(ControlStyle.webkitAnimationDurationProperty, value); }

    static webkitAnimationFillModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationFillMode", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationFillMode(): string { return this.get(ControlStyle.webkitAnimationFillModeProperty); }
    set webkitAnimationFillMode(value: string) { this.set(ControlStyle.webkitAnimationFillModeProperty, value); }

    static webkitAnimationIterationCountProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationIterationCount", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationIterationCount(): string { return this.get(ControlStyle.webkitAnimationIterationCountProperty); }
    set webkitAnimationIterationCount(value: string) { this.set(ControlStyle.webkitAnimationIterationCountProperty, value); }

    static webkitAnimationNameProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationName", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationName(): string { return this.get(ControlStyle.webkitAnimationNameProperty); }
    set webkitAnimationName(value: string) { this.set(ControlStyle.webkitAnimationNameProperty, value); }

    static webkitAnimationPlayStateProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationPlayState", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationPlayState(): string { return this.get(ControlStyle.webkitAnimationPlayStateProperty); }
    set webkitAnimationPlayState(value: string) { this.set(ControlStyle.webkitAnimationPlayStateProperty, value); }

    static webkitAnimationTimingFunctionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAnimationTimingFunction", new PropertyMetadata(new AnyConstraint()));
    get webkitAnimationTimingFunction(): string { return this.get(ControlStyle.webkitAnimationTimingFunctionProperty); }
    set webkitAnimationTimingFunction(value: string) { this.set(ControlStyle.webkitAnimationTimingFunctionProperty, value); }

    static webkitAppearanceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitAppearance", new PropertyMetadata(new AnyConstraint()));
    get webkitAppearance(): string { return this.get(ControlStyle.webkitAppearanceProperty); }
    set webkitAppearance(value: string) { this.set(ControlStyle.webkitAppearanceProperty, value); }

    static webkitBackfaceVisibilityProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBackfaceVisibility", new PropertyMetadata(new AnyConstraint()));
    get webkitBackfaceVisibility(): string { return this.get(ControlStyle.webkitBackfaceVisibilityProperty); }
    set webkitBackfaceVisibility(value: string) { this.set(ControlStyle.webkitBackfaceVisibilityProperty, value); }

    static webkitBackgroundClipProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBackgroundClip", new PropertyMetadata(new AnyConstraint()));
    get webkitBackgroundClip(): string { return this.get(ControlStyle.webkitBackgroundClipProperty); }
    set webkitBackgroundClip(value: string) { this.set(ControlStyle.webkitBackgroundClipProperty, value); }

    static webkitBackgroundOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBackgroundOrigin", new PropertyMetadata(new AnyConstraint()));
    get webkitBackgroundOrigin(): string { return this.get(ControlStyle.webkitBackgroundOriginProperty); }
    set webkitBackgroundOrigin(value: string) { this.set(ControlStyle.webkitBackgroundOriginProperty, value); }

    static webkitBackgroundSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBackgroundSize", new PropertyMetadata(new AnyConstraint()));
    get webkitBackgroundSize(): string { return this.get(ControlStyle.webkitBackgroundSizeProperty); }
    set webkitBackgroundSize(value: string) { this.set(ControlStyle.webkitBackgroundSizeProperty, value); }

    static webkitBorderBottomLeftRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderBottomLeftRadius", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderBottomLeftRadius(): string { return this.get(ControlStyle.webkitBorderBottomLeftRadiusProperty); }
    set webkitBorderBottomLeftRadius(value: string) { this.set(ControlStyle.webkitBorderBottomLeftRadiusProperty, value); }

    static webkitBorderBottomRightRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderBottomRightRadius", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderBottomRightRadius(): string { return this.get(ControlStyle.webkitBorderBottomRightRadiusProperty); }
    set webkitBorderBottomRightRadius(value: string) { this.set(ControlStyle.webkitBorderBottomRightRadiusProperty, value); }

    static webkitBorderImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderImage", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderImage(): string | null { return this.get(ControlStyle.webkitBorderImageProperty); }
    set webkitBorderImage(value: string | null) { this.set(ControlStyle.webkitBorderImageProperty, value); }

    static webkitBorderRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderRadius", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderRadius(): string { return this.get(ControlStyle.webkitBorderRadiusProperty); }
    set webkitBorderRadius(value: string) { this.set(ControlStyle.webkitBorderRadiusProperty, value); }

    static webkitBorderTopLeftRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderTopLeftRadius", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderTopLeftRadius(): string { return this.get(ControlStyle.webkitBorderTopLeftRadiusProperty); }
    set webkitBorderTopLeftRadius(value: string) { this.set(ControlStyle.webkitBorderTopLeftRadiusProperty, value); }

    static webkitBorderTopRightRadiusProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBorderTopRightRadius", new PropertyMetadata(new AnyConstraint()));
    get webkitBorderTopRightRadius(): string { return this.get(ControlStyle.webkitBorderTopRightRadiusProperty); }
    set webkitBorderTopRightRadius(value: string) { this.set(ControlStyle.webkitBorderTopRightRadiusProperty, value); }

    static webkitBoxAlignProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxAlign", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxAlign(): string { return this.get(ControlStyle.webkitBoxAlignProperty); }
    set webkitBoxAlign(value: string) { this.set(ControlStyle.webkitBoxAlignProperty, value); }

    static webkitBoxDirectionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxDirection", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxDirection(): string | null { return this.get(ControlStyle.webkitBoxDirectionProperty); }
    set webkitBoxDirection(value: string | null) { this.set(ControlStyle.webkitBoxDirectionProperty, value); }

    static webkitBoxFlexProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxFlex", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxFlex(): string { return this.get(ControlStyle.webkitBoxFlexProperty); }
    set webkitBoxFlex(value: string) { this.set(ControlStyle.webkitBoxFlexProperty, value); }

    static webkitBoxOrdinalGroupProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxOrdinalGroup", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxOrdinalGroup(): string { return this.get(ControlStyle.webkitBoxOrdinalGroupProperty); }
    set webkitBoxOrdinalGroup(value: string) { this.set(ControlStyle.webkitBoxOrdinalGroupProperty, value); }

    static webkitBoxOrientProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxOrient", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxOrient(): string { return this.get(ControlStyle.webkitBoxOrientProperty); }
    set webkitBoxOrient(value: string) { this.set(ControlStyle.webkitBoxOrientProperty, value); }

    static webkitBoxPackProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxPack", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxPack(): string { return this.get(ControlStyle.webkitBoxPackProperty); }
    set webkitBoxPack(value: string) { this.set(ControlStyle.webkitBoxPackProperty, value); }

    static webkitBoxShadowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxShadow", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxShadow(): string { return this.get(ControlStyle.webkitBoxShadowProperty); }
    set webkitBoxShadow(value: string) { this.set(ControlStyle.webkitBoxShadowProperty, value); }

    static webkitBoxSizingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitBoxSizing", new PropertyMetadata(new AnyConstraint()));
    get webkitBoxSizing(): string { return this.get(ControlStyle.webkitBoxSizingProperty); }
    set webkitBoxSizing(value: string) { this.set(ControlStyle.webkitBoxSizingProperty, value); }

    static webkitColumnBreakAfterProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnBreakAfter", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnBreakAfter(): string | null { return this.get(ControlStyle.webkitColumnBreakAfterProperty); }
    set webkitColumnBreakAfter(value: string | null) { this.set(ControlStyle.webkitColumnBreakAfterProperty, value); }

    static webkitColumnBreakBeforeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnBreakBefore", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnBreakBefore(): string | null { return this.get(ControlStyle.webkitColumnBreakBeforeProperty); }
    set webkitColumnBreakBefore(value: string | null) { this.set(ControlStyle.webkitColumnBreakBeforeProperty, value); }

    static webkitColumnBreakInsideProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnBreakInside", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnBreakInside(): string | null { return this.get(ControlStyle.webkitColumnBreakInsideProperty); }
    set webkitColumnBreakInside(value: string | null) { this.set(ControlStyle.webkitColumnBreakInsideProperty, value); }

    static webkitColumnCountProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnCount", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnCount(): any { return this.get(ControlStyle.webkitColumnCountProperty); }
    set webkitColumnCount(value: any) { this.set(ControlStyle.webkitColumnCountProperty, value); }

    static webkitColumnGapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnGap", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnGap(): any { return this.get(ControlStyle.webkitColumnGapProperty); }
    set webkitColumnGap(value: any) { this.set(ControlStyle.webkitColumnGapProperty, value); }

    static webkitColumnRuleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnRule", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnRule(): string | null { return this.get(ControlStyle.webkitColumnRuleProperty); }
    set webkitColumnRule(value: string | null) { this.set(ControlStyle.webkitColumnRuleProperty, value); }

    static webkitColumnRuleColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnRuleColor", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnRuleColor(): any { return this.get(ControlStyle.webkitColumnRuleColorProperty); }
    set webkitColumnRuleColor(value: any) { this.set(ControlStyle.webkitColumnRuleColorProperty, value); }

    static webkitColumnRuleStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnRuleStyle", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnRuleStyle(): string | null { return this.get(ControlStyle.webkitColumnRuleStyleProperty); }
    set webkitColumnRuleStyle(value: string | null) { this.set(ControlStyle.webkitColumnRuleStyleProperty, value); }

    static webkitColumnRuleWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnRuleWidth", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnRuleWidth(): any { return this.get(ControlStyle.webkitColumnRuleWidthProperty); }
    set webkitColumnRuleWidth(value: any) { this.set(ControlStyle.webkitColumnRuleWidthProperty, value); }

    static webkitColumnSpanProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnSpan", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnSpan(): string | null { return this.get(ControlStyle.webkitColumnSpanProperty); }
    set webkitColumnSpan(value: string | null) { this.set(ControlStyle.webkitColumnSpanProperty, value); }

    static webkitColumnWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumnWidth", new PropertyMetadata(new AnyConstraint()));
    get webkitColumnWidth(): any { return this.get(ControlStyle.webkitColumnWidthProperty); }
    set webkitColumnWidth(value: any) { this.set(ControlStyle.webkitColumnWidthProperty, value); }

    static webkitColumnsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitColumns", new PropertyMetadata(new AnyConstraint()));
    get webkitColumns(): string | null { return this.get(ControlStyle.webkitColumnsProperty); }
    set webkitColumns(value: string | null) { this.set(ControlStyle.webkitColumnsProperty, value); }

    static webkitFilterProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFilter", new PropertyMetadata(new AnyConstraint()));
    get webkitFilter(): string { return this.get(ControlStyle.webkitFilterProperty); }
    set webkitFilter(value: string) { this.set(ControlStyle.webkitFilterProperty, value); }

    static webkitFlexProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlex", new PropertyMetadata(new AnyConstraint()));
    get webkitFlex(): string { return this.get(ControlStyle.webkitFlexProperty); }
    set webkitFlex(value: string) { this.set(ControlStyle.webkitFlexProperty, value); }

    static webkitFlexBasisProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexBasis", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexBasis(): string { return this.get(ControlStyle.webkitFlexBasisProperty); }
    set webkitFlexBasis(value: string) { this.set(ControlStyle.webkitFlexBasisProperty, value); }

    static webkitFlexDirectionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexDirection", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexDirection(): string { return this.get(ControlStyle.webkitFlexDirectionProperty); }
    set webkitFlexDirection(value: string) { this.set(ControlStyle.webkitFlexDirectionProperty, value); }

    static webkitFlexFlowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexFlow", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexFlow(): string { return this.get(ControlStyle.webkitFlexFlowProperty); }
    set webkitFlexFlow(value: string) { this.set(ControlStyle.webkitFlexFlowProperty, value); }

    static webkitFlexGrowProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexGrow", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexGrow(): string { return this.get(ControlStyle.webkitFlexGrowProperty); }
    set webkitFlexGrow(value: string) { this.set(ControlStyle.webkitFlexGrowProperty, value); }

    static webkitFlexShrinkProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexShrink", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexShrink(): string { return this.get(ControlStyle.webkitFlexShrinkProperty); }
    set webkitFlexShrink(value: string) { this.set(ControlStyle.webkitFlexShrinkProperty, value); }

    static webkitFlexWrapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitFlexWrap", new PropertyMetadata(new AnyConstraint()));
    get webkitFlexWrap(): string { return this.get(ControlStyle.webkitFlexWrapProperty); }
    set webkitFlexWrap(value: string) { this.set(ControlStyle.webkitFlexWrapProperty, value); }

    static webkitJustifyContentProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitJustifyContent", new PropertyMetadata(new AnyConstraint()));
    get webkitJustifyContent(): string { return this.get(ControlStyle.webkitJustifyContentProperty); }
    set webkitJustifyContent(value: string) { this.set(ControlStyle.webkitJustifyContentProperty, value); }

    static webkitLineClampProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitLineClamp", new PropertyMetadata(new AnyConstraint()));
    get webkitLineClamp(): string { return this.get(ControlStyle.webkitLineClampProperty); }
    set webkitLineClamp(value: string) { this.set(ControlStyle.webkitLineClampProperty, value); }

    static webkitMaskProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMask", new PropertyMetadata(new AnyConstraint()));
    get webkitMask(): string { return this.get(ControlStyle.webkitMaskProperty); }
    set webkitMask(value: string) { this.set(ControlStyle.webkitMaskProperty, value); }

    static webkitMaskBoxImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImage", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImage(): string { return this.get(ControlStyle.webkitMaskBoxImageProperty); }
    set webkitMaskBoxImage(value: string) { this.set(ControlStyle.webkitMaskBoxImageProperty, value); }

    static webkitMaskBoxImageOutsetProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImageOutset", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImageOutset(): string { return this.get(ControlStyle.webkitMaskBoxImageOutsetProperty); }
    set webkitMaskBoxImageOutset(value: string) { this.set(ControlStyle.webkitMaskBoxImageOutsetProperty, value); }

    static webkitMaskBoxImageRepeatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImageRepeat", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImageRepeat(): string { return this.get(ControlStyle.webkitMaskBoxImageRepeatProperty); }
    set webkitMaskBoxImageRepeat(value: string) { this.set(ControlStyle.webkitMaskBoxImageRepeatProperty, value); }

    static webkitMaskBoxImageSliceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImageSlice", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImageSlice(): string { return this.get(ControlStyle.webkitMaskBoxImageSliceProperty); }
    set webkitMaskBoxImageSlice(value: string) { this.set(ControlStyle.webkitMaskBoxImageSliceProperty, value); }

    static webkitMaskBoxImageSourceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImageSource", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImageSource(): string { return this.get(ControlStyle.webkitMaskBoxImageSourceProperty); }
    set webkitMaskBoxImageSource(value: string) { this.set(ControlStyle.webkitMaskBoxImageSourceProperty, value); }

    static webkitMaskBoxImageWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskBoxImageWidth", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskBoxImageWidth(): string { return this.get(ControlStyle.webkitMaskBoxImageWidthProperty); }
    set webkitMaskBoxImageWidth(value: string) { this.set(ControlStyle.webkitMaskBoxImageWidthProperty, value); }

    static webkitMaskClipProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskClip", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskClip(): string { return this.get(ControlStyle.webkitMaskClipProperty); }
    set webkitMaskClip(value: string) { this.set(ControlStyle.webkitMaskClipProperty, value); }

    static webkitMaskCompositeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskComposite", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskComposite(): string { return this.get(ControlStyle.webkitMaskCompositeProperty); }
    set webkitMaskComposite(value: string) { this.set(ControlStyle.webkitMaskCompositeProperty, value); }

    static webkitMaskImageProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskImage", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskImage(): string { return this.get(ControlStyle.webkitMaskImageProperty); }
    set webkitMaskImage(value: string) { this.set(ControlStyle.webkitMaskImageProperty, value); }

    static webkitMaskOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskOrigin", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskOrigin(): string { return this.get(ControlStyle.webkitMaskOriginProperty); }
    set webkitMaskOrigin(value: string) { this.set(ControlStyle.webkitMaskOriginProperty, value); }

    static webkitMaskPositionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskPosition", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskPosition(): string { return this.get(ControlStyle.webkitMaskPositionProperty); }
    set webkitMaskPosition(value: string) { this.set(ControlStyle.webkitMaskPositionProperty, value); }

    static webkitMaskRepeatProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskRepeat", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskRepeat(): string { return this.get(ControlStyle.webkitMaskRepeatProperty); }
    set webkitMaskRepeat(value: string) { this.set(ControlStyle.webkitMaskRepeatProperty, value); }

    static webkitMaskSizeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitMaskSize", new PropertyMetadata(new AnyConstraint()));
    get webkitMaskSize(): string { return this.get(ControlStyle.webkitMaskSizeProperty); }
    set webkitMaskSize(value: string) { this.set(ControlStyle.webkitMaskSizeProperty, value); }

    static webkitOrderProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitOrder", new PropertyMetadata(new AnyConstraint()));
    get webkitOrder(): string { return this.get(ControlStyle.webkitOrderProperty); }
    set webkitOrder(value: string) { this.set(ControlStyle.webkitOrderProperty, value); }

    static webkitPerspectiveProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitPerspective", new PropertyMetadata(new AnyConstraint()));
    get webkitPerspective(): string { return this.get(ControlStyle.webkitPerspectiveProperty); }
    set webkitPerspective(value: string) { this.set(ControlStyle.webkitPerspectiveProperty, value); }

    static webkitPerspectiveOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitPerspectiveOrigin", new PropertyMetadata(new AnyConstraint()));
    get webkitPerspectiveOrigin(): string { return this.get(ControlStyle.webkitPerspectiveOriginProperty); }
    set webkitPerspectiveOrigin(value: string) { this.set(ControlStyle.webkitPerspectiveOriginProperty, value); }

    static webkitTapHighlightColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTapHighlightColor", new PropertyMetadata(new AnyConstraint()));
    get webkitTapHighlightColor(): string | null { return this.get(ControlStyle.webkitTapHighlightColorProperty); }
    set webkitTapHighlightColor(value: string | null) { this.set(ControlStyle.webkitTapHighlightColorProperty, value); }

    static webkitTextFillColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTextFillColor", new PropertyMetadata(new AnyConstraint()));
    get webkitTextFillColor(): string { return this.get(ControlStyle.webkitTextFillColorProperty); }
    set webkitTextFillColor(value: string) { this.set(ControlStyle.webkitTextFillColorProperty, value); }

    static webkitTextSizeAdjustProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTextSizeAdjust", new PropertyMetadata(new AnyConstraint()));
    get webkitTextSizeAdjust(): string { return this.get(ControlStyle.webkitTextSizeAdjustProperty); }
    set webkitTextSizeAdjust(value: string) { this.set(ControlStyle.webkitTextSizeAdjustProperty, value); }

    static webkitTextStrokeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTextStroke", new PropertyMetadata(new AnyConstraint()));
    get webkitTextStroke(): string { return this.get(ControlStyle.webkitTextStrokeProperty); }
    set webkitTextStroke(value: string) { this.set(ControlStyle.webkitTextStrokeProperty, value); }

    static webkitTextStrokeColorProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTextStrokeColor", new PropertyMetadata(new AnyConstraint()));
    get webkitTextStrokeColor(): string { return this.get(ControlStyle.webkitTextStrokeColorProperty); }
    set webkitTextStrokeColor(value: string) { this.set(ControlStyle.webkitTextStrokeColorProperty, value); }

    static webkitTextStrokeWidthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTextStrokeWidth", new PropertyMetadata(new AnyConstraint()));
    get webkitTextStrokeWidth(): string { return this.get(ControlStyle.webkitTextStrokeWidthProperty); }
    set webkitTextStrokeWidth(value: string) { this.set(ControlStyle.webkitTextStrokeWidthProperty, value); }

    static webkitTransformProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransform", new PropertyMetadata(new AnyConstraint()));
    get webkitTransform(): string { return this.get(ControlStyle.webkitTransformProperty); }
    set webkitTransform(value: string) { this.set(ControlStyle.webkitTransformProperty, value); }

    static webkitTransformOriginProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransformOrigin", new PropertyMetadata(new AnyConstraint()));
    get webkitTransformOrigin(): string { return this.get(ControlStyle.webkitTransformOriginProperty); }
    set webkitTransformOrigin(value: string) { this.set(ControlStyle.webkitTransformOriginProperty, value); }

    static webkitTransformStyleProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransformStyle", new PropertyMetadata(new AnyConstraint()));
    get webkitTransformStyle(): string { return this.get(ControlStyle.webkitTransformStyleProperty); }
    set webkitTransformStyle(value: string) { this.set(ControlStyle.webkitTransformStyleProperty, value); }

    static webkitTransitionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransition", new PropertyMetadata(new AnyConstraint()));
    get webkitTransition(): string { return this.get(ControlStyle.webkitTransitionProperty); }
    set webkitTransition(value: string) { this.set(ControlStyle.webkitTransitionProperty, value); }

    static webkitTransitionDelayProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransitionDelay", new PropertyMetadata(new AnyConstraint()));
    get webkitTransitionDelay(): string { return this.get(ControlStyle.webkitTransitionDelayProperty); }
    set webkitTransitionDelay(value: string) { this.set(ControlStyle.webkitTransitionDelayProperty, value); }

    static webkitTransitionDurationProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransitionDuration", new PropertyMetadata(new AnyConstraint()));
    get webkitTransitionDuration(): string { return this.get(ControlStyle.webkitTransitionDurationProperty); }
    set webkitTransitionDuration(value: string) { this.set(ControlStyle.webkitTransitionDurationProperty, value); }

    static webkitTransitionPropertyProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransitionProperty", new PropertyMetadata(new AnyConstraint()));
    get webkitTransitionProperty(): string { return this.get(ControlStyle.webkitTransitionPropertyProperty); }
    set webkitTransitionProperty(value: string) { this.set(ControlStyle.webkitTransitionPropertyProperty, value); }

    static webkitTransitionTimingFunctionProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitTransitionTimingFunction", new PropertyMetadata(new AnyConstraint()));
    get webkitTransitionTimingFunction(): string { return this.get(ControlStyle.webkitTransitionTimingFunctionProperty); }
    set webkitTransitionTimingFunction(value: string) { this.set(ControlStyle.webkitTransitionTimingFunctionProperty, value); }

    static webkitUserModifyProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitUserModify", new PropertyMetadata(new AnyConstraint()));
    get webkitUserModify(): string | null { return this.get(ControlStyle.webkitUserModifyProperty); }
    set webkitUserModify(value: string | null) { this.set(ControlStyle.webkitUserModifyProperty, value); }

    static webkitUserSelectProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitUserSelect", new PropertyMetadata(new AnyConstraint()));
    get webkitUserSelect(): string | null { return this.get(ControlStyle.webkitUserSelectProperty); }
    set webkitUserSelect(value: string | null) { this.set(ControlStyle.webkitUserSelectProperty, value); }

    static webkitWritingModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "webkitWritingMode", new PropertyMetadata(new AnyConstraint()));
    get webkitWritingMode(): string | null { return this.get(ControlStyle.webkitWritingModeProperty); }
    set webkitWritingMode(value: string | null) { this.set(ControlStyle.webkitWritingModeProperty, value); }

    static whiteSpaceProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "whiteSpace", new PropertyMetadata(new AnyConstraint()));
    get whiteSpace(): string { return this.get(ControlStyle.whiteSpaceProperty); }
    set whiteSpace(value: string) { this.set(ControlStyle.whiteSpaceProperty, value); }

    static widowsProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "widows", new PropertyMetadata(new AnyConstraint()));
    get widows(): string { return this.get(ControlStyle.widowsProperty); }
    set widows(value: string) { this.set(ControlStyle.widowsProperty, value); }

    static widthProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "width", new PropertyMetadata(new AnyConstraint()));
    get width(): string { return this.get(ControlStyle.widthProperty); }
    set width(value: string) { this.set(ControlStyle.widthProperty, value); }

    static willChangeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "willChange", new PropertyMetadata(new AnyConstraint()));
    get willChange(): string { return this.get(ControlStyle.willChangeProperty); }
    set willChange(value: string) { this.set(ControlStyle.willChangeProperty, value); }

    static wordBreakProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "wordBreak", new PropertyMetadata(new AnyConstraint()));
    get wordBreak(): string { return this.get(ControlStyle.wordBreakProperty); }
    set wordBreak(value: string) { this.set(ControlStyle.wordBreakProperty, value); }

    static wordSpacingProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "wordSpacing", new PropertyMetadata(new AnyConstraint()));
    get wordSpacing(): string { return this.get(ControlStyle.wordSpacingProperty); }
    set wordSpacing(value: string) { this.set(ControlStyle.wordSpacingProperty, value); }

    static wordWrapProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "wordWrap", new PropertyMetadata(new AnyConstraint()));
    get wordWrap(): string { return this.get(ControlStyle.wordWrapProperty); }
    set wordWrap(value: string) { this.set(ControlStyle.wordWrapProperty, value); }

    static writingModeProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "writingMode", new PropertyMetadata(new AnyConstraint()));
    get writingMode(): string { return this.get(ControlStyle.writingModeProperty); }
    set writingMode(value: string) { this.set(ControlStyle.writingModeProperty, value); }

    static zIndexProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "zIndex", new PropertyMetadata(new AnyConstraint()));
    get zIndex(): string { return this.get(ControlStyle.zIndexProperty); }
    set zIndex(value: string) { this.set(ControlStyle.zIndexProperty, value); }

    static zoomProperty = DependencyProperty.registerAttached(Type.get(ControlStyle), "zoom", new PropertyMetadata(new AnyConstraint()));
    get zoom(): string | null { return this.get(ControlStyle.zoomProperty); }
    set zoom(value: string | null) { this.set(ControlStyle.zoomProperty, value); }

    private __targetControl: Control | null;

    protected destructor() {
        this.__styleDeclaration = null;
        this.__styleElement?.remove();
        this.__targetControl = null;
    }
}
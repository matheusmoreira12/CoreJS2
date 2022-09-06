import { DependencyObject, DependencyProperty, PropertyChangeEventArgs, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { Control } from "../control.js";
import { StringUtils } from "../../../core-base/utils/index.js";
import { Type } from "../../../standard/reflection/index.js";

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

    static allProperty = DependencyProperty.registerAttached(ControlStyle, "all", new PropertyMetadata(null));
    get all(): string { return this.get(ControlStyle.allProperty); }
    set all(value: string) { this.set(ControlStyle.allProperty, value); }

    static alignContentProperty = DependencyProperty.registerAttached(ControlStyle, "alignContent", new PropertyMetadata(null));
    get alignContent(): string { return this.get(ControlStyle.alignContentProperty); }
    set alignContent(value: string) { this.set(ControlStyle.alignContentProperty, value); }

    static alignItemsProperty = DependencyProperty.registerAttached(ControlStyle, "alignItems", new PropertyMetadata(null));
    get alignItems(): string { return this.get(ControlStyle.alignItemsProperty); }
    set alignItems(value: string) { this.set(ControlStyle.alignItemsProperty, value); }

    static alignSelfProperty = DependencyProperty.registerAttached(ControlStyle, "alignSelf", new PropertyMetadata(null));
    get alignSelf(): string { return this.get(ControlStyle.alignSelfProperty); }
    set alignSelf(value: string) { this.set(ControlStyle.alignSelfProperty, value); }

    static alignmentBaselineProperty = DependencyProperty.registerAttached(ControlStyle, "alignmentBaseline", new PropertyMetadata(null));
    get alignmentBaseline(): string { return this.get(ControlStyle.alignmentBaselineProperty); }
    set alignmentBaseline(value: string) { this.set(ControlStyle.alignmentBaselineProperty, value); }

    static animationProperty = DependencyProperty.registerAttached(ControlStyle, "animation", new PropertyMetadata(null));
    get animation(): string { return this.get(ControlStyle.animationProperty); }
    set animation(value: string) { this.set(ControlStyle.animationProperty, value); }

    static animationDelayProperty = DependencyProperty.registerAttached(ControlStyle, "animationDelay", new PropertyMetadata(null));
    get animationDelay(): string { return this.get(ControlStyle.animationDelayProperty); }
    set animationDelay(value: string) { this.set(ControlStyle.animationDelayProperty, value); }

    static animationDirectionProperty = DependencyProperty.registerAttached(ControlStyle, "animationDirection", new PropertyMetadata(null));
    get animationDirection(): string { return this.get(ControlStyle.animationDirectionProperty); }
    set animationDirection(value: string) { this.set(ControlStyle.animationDirectionProperty, value); }

    static animationDurationProperty = DependencyProperty.registerAttached(ControlStyle, "animationDuration", new PropertyMetadata(null));
    get animationDuration(): string { return this.get(ControlStyle.animationDurationProperty); }
    set animationDuration(value: string) { this.set(ControlStyle.animationDurationProperty, value); }

    static animationFillModeProperty = DependencyProperty.registerAttached(ControlStyle, "animationFillMode", new PropertyMetadata(null));
    get animationFillMode(): string { return this.get(ControlStyle.animationFillModeProperty); }
    set animationFillMode(value: string) { this.set(ControlStyle.animationFillModeProperty, value); }

    static animationIterationCountProperty = DependencyProperty.registerAttached(ControlStyle, "animationIterationCount", new PropertyMetadata(null));
    get animationIterationCount(): string { return this.get(ControlStyle.animationIterationCountProperty); }
    set animationIterationCount(value: string) { this.set(ControlStyle.animationIterationCountProperty, value); }

    static animationNameProperty = DependencyProperty.registerAttached(ControlStyle, "animationName", new PropertyMetadata(null));
    get animationName(): string { return this.get(ControlStyle.animationNameProperty); }
    set animationName(value: string) { this.set(ControlStyle.animationNameProperty, value); }

    static animationPlayStateProperty = DependencyProperty.registerAttached(ControlStyle, "animationPlayState", new PropertyMetadata(Type.get(String)));
    get animationPlayState(): string { return this.get(ControlStyle.animationPlayStateProperty); }
    set animationPlayState(value: string) { this.set(ControlStyle.animationPlayStateProperty, value); }

    static animationTimingFunctionProperty = DependencyProperty.registerAttached(ControlStyle, "animationTimingFunction", new PropertyMetadata(null));
    get animationTimingFunction(): string { return this.get(ControlStyle.animationTimingFunctionProperty); }
    set animationTimingFunction(value: string) { this.set(ControlStyle.animationTimingFunctionProperty, value); }

    static backfaceVisibilityProperty = DependencyProperty.registerAttached(ControlStyle, "backfaceVisibility", new PropertyMetadata(null));
    get backfaceVisibility(): string { return this.get(ControlStyle.backfaceVisibilityProperty); }
    set backfaceVisibility(value: string) { this.set(ControlStyle.backfaceVisibilityProperty, value); }

    static backgroundProperty = DependencyProperty.registerAttached(ControlStyle, "background", new PropertyMetadata(null));
    get background(): string { return this.get(ControlStyle.backgroundProperty); }
    set background(value: string) { this.set(ControlStyle.backgroundProperty, value); }

    static backgroundAttachmentProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundAttachment", new PropertyMetadata(null));
    get backgroundAttachment(): string { return this.get(ControlStyle.backgroundAttachmentProperty); }
    set backgroundAttachment(value: string) { this.set(ControlStyle.backgroundAttachmentProperty, value); }

    static backgroundClipProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundClip", new PropertyMetadata(null));
    get backgroundClip(): string { return this.get(ControlStyle.backgroundClipProperty); }
    set backgroundClip(value: string) { this.set(ControlStyle.backgroundClipProperty, value); }

    static backgroundColorProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundColor", new PropertyMetadata(null));
    get backgroundColor(): string { return this.get(ControlStyle.backgroundColorProperty); }
    set backgroundColor(value: string) { this.set(ControlStyle.backgroundColorProperty, value); }

    static backgroundImageProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundImage", new PropertyMetadata(null));
    get backgroundImage(): string { return this.get(ControlStyle.backgroundImageProperty); }
    set backgroundImage(value: string) { this.set(ControlStyle.backgroundImageProperty, value); }

    static backgroundOriginProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundOrigin", new PropertyMetadata(null));
    get backgroundOrigin(): string { return this.get(ControlStyle.backgroundOriginProperty); }
    set backgroundOrigin(value: string) { this.set(ControlStyle.backgroundOriginProperty, value); }

    static backgroundPositionProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundPosition", new PropertyMetadata(null));
    get backgroundPosition(): string { return this.get(ControlStyle.backgroundPositionProperty); }
    set backgroundPosition(value: string) { this.set(ControlStyle.backgroundPositionProperty, value); }

    static backgroundPositionXProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundPositionX", new PropertyMetadata(null));
    get backgroundPositionX(): string { return this.get(ControlStyle.backgroundPositionXProperty); }
    set backgroundPositionX(value: string) { this.set(ControlStyle.backgroundPositionXProperty, value); }

    static backgroundPositionYProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundPositionY", new PropertyMetadata(null));
    get backgroundPositionY(): string { return this.get(ControlStyle.backgroundPositionYProperty); }
    set backgroundPositionY(value: string) { this.set(ControlStyle.backgroundPositionYProperty, value); }

    static backgroundRepeatProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundRepeat", new PropertyMetadata(null));
    get backgroundRepeat(): string { return this.get(ControlStyle.backgroundRepeatProperty); }
    set backgroundRepeat(value: string) { this.set(ControlStyle.backgroundRepeatProperty, value); }

    static backgroundSizeProperty = DependencyProperty.registerAttached(ControlStyle, "backgroundSize", new PropertyMetadata(null));
    get backgroundSize(): string { return this.get(ControlStyle.backgroundSizeProperty); }
    set backgroundSize(value: string) { this.set(ControlStyle.backgroundSizeProperty, value); }

    static baselineShiftProperty = DependencyProperty.registerAttached(ControlStyle, "baselineShift", new PropertyMetadata(null));
    get baselineShift(): string { return this.get(ControlStyle.baselineShiftProperty); }
    set baselineShift(value: string) { this.set(ControlStyle.baselineShiftProperty, value); }

    static blockSizeProperty = DependencyProperty.registerAttached(ControlStyle, "blockSize", new PropertyMetadata(null));
    get blockSize(): string { return this.get(ControlStyle.blockSizeProperty); }
    set blockSize(value: string) { this.set(ControlStyle.blockSizeProperty, value); }

    static borderProperty = DependencyProperty.registerAttached(ControlStyle, "border", new PropertyMetadata(null));
    get border(): string { return this.get(ControlStyle.borderProperty); }
    set border(value: string) { this.set(ControlStyle.borderProperty, value); }

    static borderBlockEndProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockEnd", new PropertyMetadata(null));
    get borderBlockEnd(): string { return this.get(ControlStyle.borderBlockEndProperty); }
    set borderBlockEnd(value: string) { this.set(ControlStyle.borderBlockEndProperty, value); }

    static borderBlockEndColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockEndColor", new PropertyMetadata(null));
    get borderBlockEndColor(): string { return this.get(ControlStyle.borderBlockEndColorProperty); }
    set borderBlockEndColor(value: string) { this.set(ControlStyle.borderBlockEndColorProperty, value); }

    static borderBlockEndStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockEndStyle", new PropertyMetadata(null));
    get borderBlockEndStyle(): string { return this.get(ControlStyle.borderBlockEndStyleProperty); }
    set borderBlockEndStyle(value: string) { this.set(ControlStyle.borderBlockEndStyleProperty, value); }

    static borderBlockEndWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockEndWidth", new PropertyMetadata(null));
    get borderBlockEndWidth(): string { return this.get(ControlStyle.borderBlockEndWidthProperty); }
    set borderBlockEndWidth(value: string) { this.set(ControlStyle.borderBlockEndWidthProperty, value); }

    static borderBlockStartProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockStart", new PropertyMetadata(null));
    get borderBlockStart(): string { return this.get(ControlStyle.borderBlockStartProperty); }
    set borderBlockStart(value: string) { this.set(ControlStyle.borderBlockStartProperty, value); }

    static borderBlockStartColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockStartColor", new PropertyMetadata(null));
    get borderBlockStartColor(): string { return this.get(ControlStyle.borderBlockStartColorProperty); }
    set borderBlockStartColor(value: string) { this.set(ControlStyle.borderBlockStartColorProperty, value); }

    static borderBlockStartStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockStartStyle", new PropertyMetadata(null));
    get borderBlockStartStyle(): string { return this.get(ControlStyle.borderBlockStartStyleProperty); }
    set borderBlockStartStyle(value: string) { this.set(ControlStyle.borderBlockStartStyleProperty, value); }

    static borderBlockStartWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderBlockStartWidth", new PropertyMetadata(null));
    get borderBlockStartWidth(): string { return this.get(ControlStyle.borderBlockStartWidthProperty); }
    set borderBlockStartWidth(value: string) { this.set(ControlStyle.borderBlockStartWidthProperty, value); }

    static borderBottomProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottom", new PropertyMetadata(null));
    get borderBottom(): string { return this.get(ControlStyle.borderBottomProperty); }
    set borderBottom(value: string) { this.set(ControlStyle.borderBottomProperty, value); }

    static borderBottomColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottomColor", new PropertyMetadata(null));
    get borderBottomColor(): string { return this.get(ControlStyle.borderBottomColorProperty); }
    set borderBottomColor(value: string) { this.set(ControlStyle.borderBottomColorProperty, value); }

    static borderBottomLeftRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottomLeftRadius", new PropertyMetadata(null));
    get borderBottomLeftRadius(): string { return this.get(ControlStyle.borderBottomLeftRadiusProperty); }
    set borderBottomLeftRadius(value: string) { this.set(ControlStyle.borderBottomLeftRadiusProperty, value); }

    static borderBottomRightRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottomRightRadius", new PropertyMetadata(null));
    get borderBottomRightRadius(): string { return this.get(ControlStyle.borderBottomRightRadiusProperty); }
    set borderBottomRightRadius(value: string) { this.set(ControlStyle.borderBottomRightRadiusProperty, value); }

    static borderBottomStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottomStyle", new PropertyMetadata(null));
    get borderBottomStyle(): string { return this.get(ControlStyle.borderBottomStyleProperty); }
    set borderBottomStyle(value: string) { this.set(ControlStyle.borderBottomStyleProperty, value); }

    static borderBottomWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderBottomWidth", new PropertyMetadata(null));
    get borderBottomWidth(): string { return this.get(ControlStyle.borderBottomWidthProperty); }
    set borderBottomWidth(value: string) { this.set(ControlStyle.borderBottomWidthProperty, value); }

    static borderCollapseProperty = DependencyProperty.registerAttached(ControlStyle, "borderCollapse", new PropertyMetadata(null));
    get borderCollapse(): string { return this.get(ControlStyle.borderCollapseProperty); }
    set borderCollapse(value: string) { this.set(ControlStyle.borderCollapseProperty, value); }

    static borderColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderColor", new PropertyMetadata(null));
    get borderColor(): string { return this.get(ControlStyle.borderColorProperty); }
    set borderColor(value: string) { this.set(ControlStyle.borderColorProperty, value); }

    static borderImageProperty = DependencyProperty.registerAttached(ControlStyle, "borderImage", new PropertyMetadata(null));
    get borderImage(): string { return this.get(ControlStyle.borderImageProperty); }
    set borderImage(value: string) { this.set(ControlStyle.borderImageProperty, value); }

    static borderImageOutsetProperty = DependencyProperty.registerAttached(ControlStyle, "borderImageOutset", new PropertyMetadata(null));
    get borderImageOutset(): string { return this.get(ControlStyle.borderImageOutsetProperty); }
    set borderImageOutset(value: string) { this.set(ControlStyle.borderImageOutsetProperty, value); }

    static borderImageRepeatProperty = DependencyProperty.registerAttached(ControlStyle, "borderImageRepeat", new PropertyMetadata(null));
    get borderImageRepeat(): string { return this.get(ControlStyle.borderImageRepeatProperty); }
    set borderImageRepeat(value: string) { this.set(ControlStyle.borderImageRepeatProperty, value); }

    static borderImageSliceProperty = DependencyProperty.registerAttached(ControlStyle, "borderImageSlice", new PropertyMetadata(null));
    get borderImageSlice(): string { return this.get(ControlStyle.borderImageSliceProperty); }
    set borderImageSlice(value: string) { this.set(ControlStyle.borderImageSliceProperty, value); }

    static borderImageSourceProperty = DependencyProperty.registerAttached(ControlStyle, "borderImageSource", new PropertyMetadata(null));
    get borderImageSource(): string { return this.get(ControlStyle.borderImageSourceProperty); }
    set borderImageSource(value: string) { this.set(ControlStyle.borderImageSourceProperty, value); }

    static borderImageWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderImageWidth", new PropertyMetadata(null));
    get borderImageWidth(): string { return this.get(ControlStyle.borderImageWidthProperty); }
    set borderImageWidth(value: string) { this.set(ControlStyle.borderImageWidthProperty, value); }

    static borderInlineEndProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineEnd", new PropertyMetadata(null));
    get borderInlineEnd(): string { return this.get(ControlStyle.borderInlineEndProperty); }
    set borderInlineEnd(value: string) { this.set(ControlStyle.borderInlineEndProperty, value); }

    static borderInlineEndColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineEndColor", new PropertyMetadata(null));
    get borderInlineEndColor(): string { return this.get(ControlStyle.borderInlineEndColorProperty); }
    set borderInlineEndColor(value: string) { this.set(ControlStyle.borderInlineEndColorProperty, value); }

    static borderInlineEndStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineEndStyle", new PropertyMetadata(null));
    get borderInlineEndStyle(): string { return this.get(ControlStyle.borderInlineEndStyleProperty); }
    set borderInlineEndStyle(value: string) { this.set(ControlStyle.borderInlineEndStyleProperty, value); }

    static borderInlineEndWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineEndWidth", new PropertyMetadata(null));
    get borderInlineEndWidth(): string { return this.get(ControlStyle.borderInlineEndWidthProperty); }
    set borderInlineEndWidth(value: string) { this.set(ControlStyle.borderInlineEndWidthProperty, value); }

    static borderInlineStartProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineStart", new PropertyMetadata(null));
    get borderInlineStart(): string { return this.get(ControlStyle.borderInlineStartProperty); }
    set borderInlineStart(value: string) { this.set(ControlStyle.borderInlineStartProperty, value); }

    static borderInlineStartColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineStartColor", new PropertyMetadata(null));
    get borderInlineStartColor(): string { return this.get(ControlStyle.borderInlineStartColorProperty); }
    set borderInlineStartColor(value: string) { this.set(ControlStyle.borderInlineStartColorProperty, value); }

    static borderInlineStartStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineStartStyle", new PropertyMetadata(null));
    get borderInlineStartStyle(): string { return this.get(ControlStyle.borderInlineStartStyleProperty); }
    set borderInlineStartStyle(value: string) { this.set(ControlStyle.borderInlineStartStyleProperty, value); }

    static borderInlineStartWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderInlineStartWidth", new PropertyMetadata(null));
    get borderInlineStartWidth(): string { return this.get(ControlStyle.borderInlineStartWidthProperty); }
    set borderInlineStartWidth(value: string) { this.set(ControlStyle.borderInlineStartWidthProperty, value); }

    static borderLeftProperty = DependencyProperty.registerAttached(ControlStyle, "borderLeft", new PropertyMetadata(null));
    get borderLeft(): string { return this.get(ControlStyle.borderLeftProperty); }
    set borderLeft(value: string) { this.set(ControlStyle.borderLeftProperty, value); }

    static borderLeftColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderLeftColor", new PropertyMetadata(null));
    get borderLeftColor(): string { return this.get(ControlStyle.borderLeftColorProperty); }
    set borderLeftColor(value: string) { this.set(ControlStyle.borderLeftColorProperty, value); }

    static borderLeftStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderLeftStyle", new PropertyMetadata(null));
    get borderLeftStyle(): string { return this.get(ControlStyle.borderLeftStyleProperty); }
    set borderLeftStyle(value: string) { this.set(ControlStyle.borderLeftStyleProperty, value); }

    static borderLeftWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderLeftWidth", new PropertyMetadata(null));
    get borderLeftWidth(): string { return this.get(ControlStyle.borderLeftWidthProperty); }
    set borderLeftWidth(value: string) { this.set(ControlStyle.borderLeftWidthProperty, value); }

    static borderRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "borderRadius", new PropertyMetadata(null));
    get borderRadius(): string { return this.get(ControlStyle.borderRadiusProperty); }
    set borderRadius(value: string) { this.set(ControlStyle.borderRadiusProperty, value); }

    static borderRightProperty = DependencyProperty.registerAttached(ControlStyle, "borderRight", new PropertyMetadata(null));
    get borderRight(): string { return this.get(ControlStyle.borderRightProperty); }
    set borderRight(value: string) { this.set(ControlStyle.borderRightProperty, value); }

    static borderRightColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderRightColor", new PropertyMetadata(null));
    get borderRightColor(): string { return this.get(ControlStyle.borderRightColorProperty); }
    set borderRightColor(value: string) { this.set(ControlStyle.borderRightColorProperty, value); }

    static borderRightStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderRightStyle", new PropertyMetadata(null));
    get borderRightStyle(): string { return this.get(ControlStyle.borderRightStyleProperty); }
    set borderRightStyle(value: string) { this.set(ControlStyle.borderRightStyleProperty, value); }

    static borderRightWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderRightWidth", new PropertyMetadata(null));
    get borderRightWidth(): string { return this.get(ControlStyle.borderRightWidthProperty); }
    set borderRightWidth(value: string) { this.set(ControlStyle.borderRightWidthProperty, value); }

    static borderSpacingProperty = DependencyProperty.registerAttached(ControlStyle, "borderSpacing", new PropertyMetadata(null));
    get borderSpacing(): string { return this.get(ControlStyle.borderSpacingProperty); }
    set borderSpacing(value: string) { this.set(ControlStyle.borderSpacingProperty, value); }

    static borderStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderStyle", new PropertyMetadata(null));
    get borderStyle(): string { return this.get(ControlStyle.borderStyleProperty); }
    set borderStyle(value: string) { this.set(ControlStyle.borderStyleProperty, value); }

    static borderTopProperty = DependencyProperty.registerAttached(ControlStyle, "borderTop", new PropertyMetadata(null));
    get borderTop(): string { return this.get(ControlStyle.borderTopProperty); }
    set borderTop(value: string) { this.set(ControlStyle.borderTopProperty, value); }

    static borderTopColorProperty = DependencyProperty.registerAttached(ControlStyle, "borderTopColor", new PropertyMetadata(null));
    get borderTopColor(): string { return this.get(ControlStyle.borderTopColorProperty); }
    set borderTopColor(value: string) { this.set(ControlStyle.borderTopColorProperty, value); }

    static borderTopLeftRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "borderTopLeftRadius", new PropertyMetadata(null));
    get borderTopLeftRadius(): string { return this.get(ControlStyle.borderTopLeftRadiusProperty); }
    set borderTopLeftRadius(value: string) { this.set(ControlStyle.borderTopLeftRadiusProperty, value); }

    static borderTopRightRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "borderTopRightRadius", new PropertyMetadata(null));
    get borderTopRightRadius(): string { return this.get(ControlStyle.borderTopRightRadiusProperty); }
    set borderTopRightRadius(value: string) { this.set(ControlStyle.borderTopRightRadiusProperty, value); }

    static borderTopStyleProperty = DependencyProperty.registerAttached(ControlStyle, "borderTopStyle", new PropertyMetadata(null));
    get borderTopStyle(): string { return this.get(ControlStyle.borderTopStyleProperty); }
    set borderTopStyle(value: string) { this.set(ControlStyle.borderTopStyleProperty, value); }

    static borderTopWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderTopWidth", new PropertyMetadata(null));
    get borderTopWidth(): string { return this.get(ControlStyle.borderTopWidthProperty); }
    set borderTopWidth(value: string) { this.set(ControlStyle.borderTopWidthProperty, value); }

    static borderWidthProperty = DependencyProperty.registerAttached(ControlStyle, "borderWidth", new PropertyMetadata(null));
    get borderWidth(): string { return this.get(ControlStyle.borderWidthProperty); }
    set borderWidth(value: string) { this.set(ControlStyle.borderWidthProperty, value); }

    static bottomProperty = DependencyProperty.registerAttached(ControlStyle, "bottom", new PropertyMetadata(null));
    get bottom(): string { return this.get(ControlStyle.bottomProperty); }
    set bottom(value: string) { this.set(ControlStyle.bottomProperty, value); }

    static boxShadowProperty = DependencyProperty.registerAttached(ControlStyle, "boxShadow", new PropertyMetadata(null));
    get boxShadow(): string { return this.get(ControlStyle.boxShadowProperty); }
    set boxShadow(value: string) { this.set(ControlStyle.boxShadowProperty, value); }

    static boxSizingProperty = DependencyProperty.registerAttached(ControlStyle, "boxSizing", new PropertyMetadata(null));
    get boxSizing(): string { return this.get(ControlStyle.boxSizingProperty); }
    set boxSizing(value: string) { this.set(ControlStyle.boxSizingProperty, value); }

    static breakAfterProperty = DependencyProperty.registerAttached(ControlStyle, "breakAfter", new PropertyMetadata(null));
    get breakAfter(): string { return this.get(ControlStyle.breakAfterProperty); }
    set breakAfter(value: string) { this.set(ControlStyle.breakAfterProperty, value); }

    static breakBeforeProperty = DependencyProperty.registerAttached(ControlStyle, "breakBefore", new PropertyMetadata(null));
    get breakBefore(): string { return this.get(ControlStyle.breakBeforeProperty); }
    set breakBefore(value: string) { this.set(ControlStyle.breakBeforeProperty, value); }

    static breakInsideProperty = DependencyProperty.registerAttached(ControlStyle, "breakInside", new PropertyMetadata(null));
    get breakInside(): string { return this.get(ControlStyle.breakInsideProperty); }
    set breakInside(value: string) { this.set(ControlStyle.breakInsideProperty, value); }

    static captionSideProperty = DependencyProperty.registerAttached(ControlStyle, "captionSide", new PropertyMetadata(null));
    get captionSide(): string { return this.get(ControlStyle.captionSideProperty); }
    set captionSide(value: string) { this.set(ControlStyle.captionSideProperty, value); }

    static caretColorProperty = DependencyProperty.registerAttached(ControlStyle, "caretColor", new PropertyMetadata(null));
    get caretColor(): string { return this.get(ControlStyle.caretColorProperty); }
    set caretColor(value: string) { this.set(ControlStyle.caretColorProperty, value); }

    static clearProperty = DependencyProperty.registerAttached(ControlStyle, "clear", new PropertyMetadata(null));
    get clear(): string { return this.get(ControlStyle.clearProperty); }
    set clear(value: string) { this.set(ControlStyle.clearProperty, value); }

    static clipProperty = DependencyProperty.registerAttached(ControlStyle, "clip", new PropertyMetadata(null));
    get clip(): string { return this.get(ControlStyle.clipProperty); }
    set clip(value: string) { this.set(ControlStyle.clipProperty, value); }

    static clipPathProperty = DependencyProperty.registerAttached(ControlStyle, "clipPath", new PropertyMetadata(null));
    get clipPath(): string { return this.get(ControlStyle.clipPathProperty); }
    set clipPath(value: string) { this.set(ControlStyle.clipPathProperty, value); }

    static clipRuleProperty = DependencyProperty.registerAttached(ControlStyle, "clipRule", new PropertyMetadata(null));
    get clipRule(): string { return this.get(ControlStyle.clipRuleProperty); }
    set clipRule(value: string) { this.set(ControlStyle.clipRuleProperty, value); }

    static colorProperty = DependencyProperty.registerAttached(ControlStyle, "color", new PropertyMetadata(null));
    get color(): string { return this.get(ControlStyle.colorProperty); }
    set color(value: string) { this.set(ControlStyle.colorProperty, value); }

    static colorInterpolationProperty = DependencyProperty.registerAttached(ControlStyle, "colorInterpolation", new PropertyMetadata(null));
    get colorInterpolation(): string { return this.get(ControlStyle.colorInterpolationProperty); }
    set colorInterpolation(value: string) { this.set(ControlStyle.colorInterpolationProperty, value); }

    static colorInterpolationFiltersProperty = DependencyProperty.registerAttached(ControlStyle, "colorInterpolationFilters", new PropertyMetadata(null));
    get colorInterpolationFilters(): string { return this.get(ControlStyle.colorInterpolationFiltersProperty); }
    set colorInterpolationFilters(value: string) { this.set(ControlStyle.colorInterpolationFiltersProperty, value); }

    static columnCountProperty = DependencyProperty.registerAttached(ControlStyle, "columnCount", new PropertyMetadata(null));
    get columnCount(): string { return this.get(ControlStyle.columnCountProperty); }
    set columnCount(value: string) { this.set(ControlStyle.columnCountProperty, value); }

    static columnFillProperty = DependencyProperty.registerAttached(ControlStyle, "columnFill", new PropertyMetadata(null));
    get columnFill(): string { return this.get(ControlStyle.columnFillProperty); }
    set columnFill(value: string) { this.set(ControlStyle.columnFillProperty, value); }

    static columnGapProperty = DependencyProperty.registerAttached(ControlStyle, "columnGap", new PropertyMetadata(null));
    get columnGap(): string { return this.get(ControlStyle.columnGapProperty); }
    set columnGap(value: string) { this.set(ControlStyle.columnGapProperty, value); }

    static columnRuleProperty = DependencyProperty.registerAttached(ControlStyle, "columnRule", new PropertyMetadata(null));
    get columnRule(): string { return this.get(ControlStyle.columnRuleProperty); }
    set columnRule(value: string) { this.set(ControlStyle.columnRuleProperty, value); }

    static columnRuleColorProperty = DependencyProperty.registerAttached(ControlStyle, "columnRuleColor", new PropertyMetadata(null));
    get columnRuleColor(): string { return this.get(ControlStyle.columnRuleColorProperty); }
    set columnRuleColor(value: string) { this.set(ControlStyle.columnRuleColorProperty, value); }

    static columnRuleStyleProperty = DependencyProperty.registerAttached(ControlStyle, "columnRuleStyle", new PropertyMetadata(null));
    get columnRuleStyle(): string { return this.get(ControlStyle.columnRuleStyleProperty); }
    set columnRuleStyle(value: string) { this.set(ControlStyle.columnRuleStyleProperty, value); }

    static columnRuleWidthProperty = DependencyProperty.registerAttached(ControlStyle, "columnRuleWidth", new PropertyMetadata(null));
    get columnRuleWidth(): string { return this.get(ControlStyle.columnRuleWidthProperty); }
    set columnRuleWidth(value: string) { this.set(ControlStyle.columnRuleWidthProperty, value); }

    static columnSpanProperty = DependencyProperty.registerAttached(ControlStyle, "columnSpan", new PropertyMetadata(null));
    get columnSpan(): string { return this.get(ControlStyle.columnSpanProperty); }
    set columnSpan(value: string) { this.set(ControlStyle.columnSpanProperty, value); }

    static columnWidthProperty = DependencyProperty.registerAttached(ControlStyle, "columnWidth", new PropertyMetadata(null));
    get columnWidth(): string { return this.get(ControlStyle.columnWidthProperty); }
    set columnWidth(value: string) { this.set(ControlStyle.columnWidthProperty, value); }

    static columnsProperty = DependencyProperty.registerAttached(ControlStyle, "columns", new PropertyMetadata(null));
    get columns(): string { return this.get(ControlStyle.columnsProperty); }
    set columns(value: string) { this.set(ControlStyle.columnsProperty, value); }

    static contentProperty = DependencyProperty.registerAttached(ControlStyle, "content", new PropertyMetadata(null));
    get content(): string { return this.get(ControlStyle.contentProperty); }
    set content(value: string) { this.set(ControlStyle.contentProperty, value); }

    static counterIncrementProperty = DependencyProperty.registerAttached(ControlStyle, "counterIncrement", new PropertyMetadata(null));
    get counterIncrement(): string { return this.get(ControlStyle.counterIncrementProperty); }
    set counterIncrement(value: string) { this.set(ControlStyle.counterIncrementProperty, value); }

    static counterResetProperty = DependencyProperty.registerAttached(ControlStyle, "counterReset", new PropertyMetadata(null));
    get counterReset(): string { return this.get(ControlStyle.counterResetProperty); }
    set counterReset(value: string) { this.set(ControlStyle.counterResetProperty, value); }

    static cssFloatProperty = DependencyProperty.registerAttached(ControlStyle, "cssFloat", new PropertyMetadata(null));
    get cssFloat(): string | null { return this.get(ControlStyle.cssFloatProperty); }
    set cssFloat(value: string | null) { this.set(ControlStyle.cssFloatProperty, value); }

    static cssTextProperty = DependencyProperty.registerAttached(ControlStyle, "cssText", new PropertyMetadata(null));
    get cssText(): string { return this.get(ControlStyle.cssTextProperty); }
    set cssText(value: string) { this.set(ControlStyle.cssTextProperty, value); }

    static cursorProperty = DependencyProperty.registerAttached(ControlStyle, "cursor", new PropertyMetadata(null));
    get cursor(): string { return this.get(ControlStyle.cursorProperty); }
    set cursor(value: string) { this.set(ControlStyle.cursorProperty, value); }

    static directionProperty = DependencyProperty.registerAttached(ControlStyle, "direction", new PropertyMetadata(null));
    get direction(): string { return this.get(ControlStyle.directionProperty); }
    set direction(value: string) { this.set(ControlStyle.directionProperty, value); }

    static displayProperty = DependencyProperty.registerAttached(ControlStyle, "display", new PropertyMetadata(null));
    get display(): string { return this.get(ControlStyle.displayProperty); }
    set display(value: string) { this.set(ControlStyle.displayProperty, value); }

    static dominantBaselineProperty = DependencyProperty.registerAttached(ControlStyle, "dominantBaseline", new PropertyMetadata(null));
    get dominantBaseline(): string { return this.get(ControlStyle.dominantBaselineProperty); }
    set dominantBaseline(value: string) { this.set(ControlStyle.dominantBaselineProperty, value); }

    static emptyCellsProperty = DependencyProperty.registerAttached(ControlStyle, "emptyCells", new PropertyMetadata(null));
    get emptyCells(): string { return this.get(ControlStyle.emptyCellsProperty); }
    set emptyCells(value: string) { this.set(ControlStyle.emptyCellsProperty, value); }

    static enableBackgroundProperty = DependencyProperty.registerAttached(ControlStyle, "enableBackground", new PropertyMetadata(null));
    get enableBackground(): string | null { return this.get(ControlStyle.enableBackgroundProperty); }
    set enableBackground(value: string | null) { this.set(ControlStyle.enableBackgroundProperty, value); }

    static fillProperty = DependencyProperty.registerAttached(ControlStyle, "fill", new PropertyMetadata(null));
    get fill(): string { return this.get(ControlStyle.fillProperty); }
    set fill(value: string) { this.set(ControlStyle.fillProperty, value); }

    static fillOpacityProperty = DependencyProperty.registerAttached(ControlStyle, "fillOpacity", new PropertyMetadata(null));
    get fillOpacity(): string { return this.get(ControlStyle.fillOpacityProperty); }
    set fillOpacity(value: string) { this.set(ControlStyle.fillOpacityProperty, value); }

    static fillRuleProperty = DependencyProperty.registerAttached(ControlStyle, "fillRule", new PropertyMetadata(null));
    get fillRule(): string { return this.get(ControlStyle.fillRuleProperty); }
    set fillRule(value: string) { this.set(ControlStyle.fillRuleProperty, value); }

    static filterProperty = DependencyProperty.registerAttached(ControlStyle, "filter", new PropertyMetadata(null));
    get filter(): string { return this.get(ControlStyle.filterProperty); }
    set filter(value: string) { this.set(ControlStyle.filterProperty, value); }

    static flexProperty = DependencyProperty.registerAttached(ControlStyle, "flex", new PropertyMetadata(null));
    get flex(): string { return this.get(ControlStyle.flexProperty); }
    set flex(value: string) { this.set(ControlStyle.flexProperty, value); }

    static flexBasisProperty = DependencyProperty.registerAttached(ControlStyle, "flexBasis", new PropertyMetadata(null));
    get flexBasis(): string { return this.get(ControlStyle.flexBasisProperty); }
    set flexBasis(value: string) { this.set(ControlStyle.flexBasisProperty, value); }

    static flexDirectionProperty = DependencyProperty.registerAttached(ControlStyle, "flexDirection", new PropertyMetadata(null));
    get flexDirection(): string { return this.get(ControlStyle.flexDirectionProperty); }
    set flexDirection(value: string) { this.set(ControlStyle.flexDirectionProperty, value); }

    static flexFlowProperty = DependencyProperty.registerAttached(ControlStyle, "flexFlow", new PropertyMetadata(null));
    get flexFlow(): string { return this.get(ControlStyle.flexFlowProperty); }
    set flexFlow(value: string) { this.set(ControlStyle.flexFlowProperty, value); }

    static flexGrowProperty = DependencyProperty.registerAttached(ControlStyle, "flexGrow", new PropertyMetadata(null));
    get flexGrow(): string { return this.get(ControlStyle.flexGrowProperty); }
    set flexGrow(value: string) { this.set(ControlStyle.flexGrowProperty, value); }

    static flexShrinkProperty = DependencyProperty.registerAttached(ControlStyle, "flexShrink", new PropertyMetadata(null));
    get flexShrink(): string { return this.get(ControlStyle.flexShrinkProperty); }
    set flexShrink(value: string) { this.set(ControlStyle.flexShrinkProperty, value); }

    static flexWrapProperty = DependencyProperty.registerAttached(ControlStyle, "flexWrap", new PropertyMetadata(null));
    get flexWrap(): string { return this.get(ControlStyle.flexWrapProperty); }
    set flexWrap(value: string) { this.set(ControlStyle.flexWrapProperty, value); }

    static floatProperty = DependencyProperty.registerAttached(ControlStyle, "float", new PropertyMetadata(null));
    get float(): string { return this.get(ControlStyle.floatProperty); }
    set float(value: string) { this.set(ControlStyle.floatProperty, value); }

    static floodColorProperty = DependencyProperty.registerAttached(ControlStyle, "floodColor", new PropertyMetadata(null));
    get floodColor(): string { return this.get(ControlStyle.floodColorProperty); }
    set floodColor(value: string) { this.set(ControlStyle.floodColorProperty, value); }

    static floodOpacityProperty = DependencyProperty.registerAttached(ControlStyle, "floodOpacity", new PropertyMetadata(null));
    get floodOpacity(): string { return this.get(ControlStyle.floodOpacityProperty); }
    set floodOpacity(value: string) { this.set(ControlStyle.floodOpacityProperty, value); }

    static fontProperty = DependencyProperty.registerAttached(ControlStyle, "font", new PropertyMetadata(null));
    get font(): string { return this.get(ControlStyle.fontProperty); }
    set font(value: string) { this.set(ControlStyle.fontProperty, value); }

    static fontFamilyProperty = DependencyProperty.registerAttached(ControlStyle, "fontFamily", new PropertyMetadata(null));
    get fontFamily(): string { return this.get(ControlStyle.fontFamilyProperty); }
    set fontFamily(value: string) { this.set(ControlStyle.fontFamilyProperty, value); }

    static fontFeatureSettingsProperty = DependencyProperty.registerAttached(ControlStyle, "fontFeatureSettings", new PropertyMetadata(null));
    get fontFeatureSettings(): string { return this.get(ControlStyle.fontFeatureSettingsProperty); }
    set fontFeatureSettings(value: string) { this.set(ControlStyle.fontFeatureSettingsProperty, value); }

    static fontKerningProperty = DependencyProperty.registerAttached(ControlStyle, "fontKerning", new PropertyMetadata(null));
    get fontKerning(): string { return this.get(ControlStyle.fontKerningProperty); }
    set fontKerning(value: string) { this.set(ControlStyle.fontKerningProperty, value); }

    static fontSizeProperty = DependencyProperty.registerAttached(ControlStyle, "fontSize", new PropertyMetadata(null));
    get fontSize(): string { return this.get(ControlStyle.fontSizeProperty); }
    set fontSize(value: string) { this.set(ControlStyle.fontSizeProperty, value); }

    static fontSizeAdjustProperty = DependencyProperty.registerAttached(ControlStyle, "fontSizeAdjust", new PropertyMetadata(null));
    get fontSizeAdjust(): string { return this.get(ControlStyle.fontSizeAdjustProperty); }
    set fontSizeAdjust(value: string) { this.set(ControlStyle.fontSizeAdjustProperty, value); }

    static fontStretchProperty = DependencyProperty.registerAttached(ControlStyle, "fontStretch", new PropertyMetadata(null));
    get fontStretch(): string { return this.get(ControlStyle.fontStretchProperty); }
    set fontStretch(value: string) { this.set(ControlStyle.fontStretchProperty, value); }

    static fontStyleProperty = DependencyProperty.registerAttached(ControlStyle, "fontStyle", new PropertyMetadata(null));
    get fontStyle(): string { return this.get(ControlStyle.fontStyleProperty); }
    set fontStyle(value: string) { this.set(ControlStyle.fontStyleProperty, value); }

    static fontSynthesisProperty = DependencyProperty.registerAttached(ControlStyle, "fontSynthesis", new PropertyMetadata(null));
    get fontSynthesis(): string { return this.get(ControlStyle.fontSynthesisProperty); }
    set fontSynthesis(value: string) { this.set(ControlStyle.fontSynthesisProperty, value); }

    static fontVariantProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariant", new PropertyMetadata(null));
    get fontVariant(): string { return this.get(ControlStyle.fontVariantProperty); }
    set fontVariant(value: string) { this.set(ControlStyle.fontVariantProperty, value); }

    static fontVariantCapsProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariantCaps", new PropertyMetadata(null));
    get fontVariantCaps(): string { return this.get(ControlStyle.fontVariantCapsProperty); }
    set fontVariantCaps(value: string) { this.set(ControlStyle.fontVariantCapsProperty, value); }

    static fontVariantEastAsianProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariantEastAsian", new PropertyMetadata(null));
    get fontVariantEastAsian(): string { return this.get(ControlStyle.fontVariantEastAsianProperty); }
    set fontVariantEastAsian(value: string) { this.set(ControlStyle.fontVariantEastAsianProperty, value); }

    static fontVariantLigaturesProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariantLigatures", new PropertyMetadata(null));
    get fontVariantLigatures(): string { return this.get(ControlStyle.fontVariantLigaturesProperty); }
    set fontVariantLigatures(value: string) { this.set(ControlStyle.fontVariantLigaturesProperty, value); }

    static fontVariantNumericProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariantNumeric", new PropertyMetadata(null));
    get fontVariantNumeric(): string { return this.get(ControlStyle.fontVariantNumericProperty); }
    set fontVariantNumeric(value: string) { this.set(ControlStyle.fontVariantNumericProperty, value); }

    static fontVariantPositionProperty = DependencyProperty.registerAttached(ControlStyle, "fontVariantPosition", new PropertyMetadata(null));
    get fontVariantPosition(): string { return this.get(ControlStyle.fontVariantPositionProperty); }
    set fontVariantPosition(value: string) { this.set(ControlStyle.fontVariantPositionProperty, value); }

    static fontWeightProperty = DependencyProperty.registerAttached(ControlStyle, "fontWeight", new PropertyMetadata(null));
    get fontWeight(): string { return this.get(ControlStyle.fontWeightProperty); }
    set fontWeight(value: string) { this.set(ControlStyle.fontWeightProperty, value); }

    static gapProperty = DependencyProperty.registerAttached(ControlStyle, "gap", new PropertyMetadata(null));
    get gap(): string { return this.get(ControlStyle.gapProperty); }
    set gap(value: string) { this.set(ControlStyle.gapProperty, value); }

    static glyphOrientationHorizontalProperty = DependencyProperty.registerAttached(ControlStyle, "glyphOrientationHorizontal", new PropertyMetadata(null));
    get glyphOrientationHorizontal(): string | null { return this.get(ControlStyle.glyphOrientationHorizontalProperty); }
    set glyphOrientationHorizontal(value: string | null) { this.set(ControlStyle.glyphOrientationHorizontalProperty, value); }

    static glyphOrientationVerticalProperty = DependencyProperty.registerAttached(ControlStyle, "glyphOrientationVertical", new PropertyMetadata(null));
    get glyphOrientationVertical(): string { return this.get(ControlStyle.glyphOrientationVerticalProperty); }
    set glyphOrientationVertical(value: string) { this.set(ControlStyle.glyphOrientationVerticalProperty, value); }

    static gridProperty = DependencyProperty.registerAttached(ControlStyle, "grid", new PropertyMetadata(null));
    get grid(): string { return this.get(ControlStyle.gridProperty); }
    set grid(value: string) { this.set(ControlStyle.gridProperty, value); }

    static gridAreaProperty = DependencyProperty.registerAttached(ControlStyle, "gridArea", new PropertyMetadata(null));
    get gridArea(): string { return this.get(ControlStyle.gridAreaProperty); }
    set gridArea(value: string) { this.set(ControlStyle.gridAreaProperty, value); }

    static gridAutoColumnsProperty = DependencyProperty.registerAttached(ControlStyle, "gridAutoColumns", new PropertyMetadata(null));
    get gridAutoColumns(): string { return this.get(ControlStyle.gridAutoColumnsProperty); }
    set gridAutoColumns(value: string) { this.set(ControlStyle.gridAutoColumnsProperty, value); }

    static gridAutoFlowProperty = DependencyProperty.registerAttached(ControlStyle, "gridAutoFlow", new PropertyMetadata(null));
    get gridAutoFlow(): string { return this.get(ControlStyle.gridAutoFlowProperty); }
    set gridAutoFlow(value: string) { this.set(ControlStyle.gridAutoFlowProperty, value); }

    static gridAutoRowsProperty = DependencyProperty.registerAttached(ControlStyle, "gridAutoRows", new PropertyMetadata(null));
    get gridAutoRows(): string { return this.get(ControlStyle.gridAutoRowsProperty); }
    set gridAutoRows(value: string) { this.set(ControlStyle.gridAutoRowsProperty, value); }

    static gridColumnProperty = DependencyProperty.registerAttached(ControlStyle, "gridColumn", new PropertyMetadata(null));
    get gridColumn(): string { return this.get(ControlStyle.gridColumnProperty); }
    set gridColumn(value: string) { this.set(ControlStyle.gridColumnProperty, value); }

    static gridColumnEndProperty = DependencyProperty.registerAttached(ControlStyle, "gridColumnEnd", new PropertyMetadata(null));
    get gridColumnEnd(): string { return this.get(ControlStyle.gridColumnEndProperty); }
    set gridColumnEnd(value: string) { this.set(ControlStyle.gridColumnEndProperty, value); }

    static gridColumnGapProperty = DependencyProperty.registerAttached(ControlStyle, "gridColumnGap", new PropertyMetadata(null));
    get gridColumnGap(): string { return this.get(ControlStyle.gridColumnGapProperty); }
    set gridColumnGap(value: string) { this.set(ControlStyle.gridColumnGapProperty, value); }

    static gridColumnStartProperty = DependencyProperty.registerAttached(ControlStyle, "gridColumnStart", new PropertyMetadata(null));
    get gridColumnStart(): string { return this.get(ControlStyle.gridColumnStartProperty); }
    set gridColumnStart(value: string) { this.set(ControlStyle.gridColumnStartProperty, value); }

    static gridGapProperty = DependencyProperty.registerAttached(ControlStyle, "gridGap", new PropertyMetadata(null));
    get gridGap(): string { return this.get(ControlStyle.gridGapProperty); }
    set gridGap(value: string) { this.set(ControlStyle.gridGapProperty, value); }

    static gridRowProperty = DependencyProperty.registerAttached(ControlStyle, "gridRow", new PropertyMetadata(null));
    get gridRow(): string { return this.get(ControlStyle.gridRowProperty); }
    set gridRow(value: string) { this.set(ControlStyle.gridRowProperty, value); }

    static gridRowEndProperty = DependencyProperty.registerAttached(ControlStyle, "gridRowEnd", new PropertyMetadata(null));
    get gridRowEnd(): string { return this.get(ControlStyle.gridRowEndProperty); }
    set gridRowEnd(value: string) { this.set(ControlStyle.gridRowEndProperty, value); }

    static gridRowGapProperty = DependencyProperty.registerAttached(ControlStyle, "gridRowGap", new PropertyMetadata(null));
    get gridRowGap(): string { return this.get(ControlStyle.gridRowGapProperty); }
    set gridRowGap(value: string) { this.set(ControlStyle.gridRowGapProperty, value); }

    static gridRowStartProperty = DependencyProperty.registerAttached(ControlStyle, "gridRowStart", new PropertyMetadata(null));
    get gridRowStart(): string { return this.get(ControlStyle.gridRowStartProperty); }
    set gridRowStart(value: string) { this.set(ControlStyle.gridRowStartProperty, value); }

    static gridTemplateProperty = DependencyProperty.registerAttached(ControlStyle, "gridTemplate", new PropertyMetadata(null));
    get gridTemplate(): string { return this.get(ControlStyle.gridTemplateProperty); }
    set gridTemplate(value: string) { this.set(ControlStyle.gridTemplateProperty, value); }

    static gridTemplateAreasProperty = DependencyProperty.registerAttached(ControlStyle, "gridTemplateAreas", new PropertyMetadata(null));
    get gridTemplateAreas(): string { return this.get(ControlStyle.gridTemplateAreasProperty); }
    set gridTemplateAreas(value: string) { this.set(ControlStyle.gridTemplateAreasProperty, value); }

    static gridTemplateColumnsProperty = DependencyProperty.registerAttached(ControlStyle, "gridTemplateColumns", new PropertyMetadata(null));
    get gridTemplateColumns(): string { return this.get(ControlStyle.gridTemplateColumnsProperty); }
    set gridTemplateColumns(value: string) { this.set(ControlStyle.gridTemplateColumnsProperty, value); }

    static gridTemplateRowsProperty = DependencyProperty.registerAttached(ControlStyle, "gridTemplateRows", new PropertyMetadata(null));
    get gridTemplateRows(): string { return this.get(ControlStyle.gridTemplateRowsProperty); }
    set gridTemplateRows(value: string) { this.set(ControlStyle.gridTemplateRowsProperty, value); }

    static heightProperty = DependencyProperty.registerAttached(ControlStyle, "height", new PropertyMetadata(null));
    get height(): string { return this.get(ControlStyle.heightProperty); }
    set height(value: string) { this.set(ControlStyle.heightProperty, value); }

    static hyphensProperty = DependencyProperty.registerAttached(ControlStyle, "hyphens", new PropertyMetadata(null));
    get hyphens(): string { return this.get(ControlStyle.hyphensProperty); }
    set hyphens(value: string) { this.set(ControlStyle.hyphensProperty, value); }

    static imageOrientationProperty = DependencyProperty.registerAttached(ControlStyle, "imageOrientation", new PropertyMetadata(null));
    get imageOrientation(): string { return this.get(ControlStyle.imageOrientationProperty); }
    set imageOrientation(value: string) { this.set(ControlStyle.imageOrientationProperty, value); }

    static imageRenderingProperty = DependencyProperty.registerAttached(ControlStyle, "imageRendering", new PropertyMetadata(null));
    get imageRendering(): string { return this.get(ControlStyle.imageRenderingProperty); }
    set imageRendering(value: string) { this.set(ControlStyle.imageRenderingProperty, value); }

    static imeModeProperty = DependencyProperty.registerAttached(ControlStyle, "imeMode", new PropertyMetadata(null));
    get imeMode(): string | null { return this.get(ControlStyle.imeModeProperty); }
    set imeMode(value: string | null) { this.set(ControlStyle.imeModeProperty, value); }

    static inlineSizeProperty = DependencyProperty.registerAttached(ControlStyle, "inlineSize", new PropertyMetadata(null));
    get inlineSize(): string { return this.get(ControlStyle.inlineSizeProperty); }
    set inlineSize(value: string) { this.set(ControlStyle.inlineSizeProperty, value); }

    static justifyContentProperty = DependencyProperty.registerAttached(ControlStyle, "justifyContent", new PropertyMetadata(null));
    get justifyContent(): string { return this.get(ControlStyle.justifyContentProperty); }
    set justifyContent(value: string) { this.set(ControlStyle.justifyContentProperty, value); }

    static justifyItemsProperty = DependencyProperty.registerAttached(ControlStyle, "justifyItems", new PropertyMetadata(null));
    get justifyItems(): string { return this.get(ControlStyle.justifyItemsProperty); }
    set justifyItems(value: string) { this.set(ControlStyle.justifyItemsProperty, value); }

    static justifySelfProperty = DependencyProperty.registerAttached(ControlStyle, "justifySelf", new PropertyMetadata(null));
    get justifySelf(): string { return this.get(ControlStyle.justifySelfProperty); }
    set justifySelf(value: string) { this.set(ControlStyle.justifySelfProperty, value); }

    static kerningProperty = DependencyProperty.registerAttached(ControlStyle, "kerning", new PropertyMetadata(null));
    get kerning(): string | null { return this.get(ControlStyle.kerningProperty); }
    set kerning(value: string | null) { this.set(ControlStyle.kerningProperty, value); }

    static layoutGridProperty = DependencyProperty.registerAttached(ControlStyle, "layoutGrid", new PropertyMetadata(null));
    get layoutGrid(): string | null { return this.get(ControlStyle.layoutGridProperty); }
    set layoutGrid(value: string | null) { this.set(ControlStyle.layoutGridProperty, value); }

    static layoutGridCharProperty = DependencyProperty.registerAttached(ControlStyle, "layoutGridChar", new PropertyMetadata(null));
    get layoutGridChar(): string | null { return this.get(ControlStyle.layoutGridCharProperty); }
    set layoutGridChar(value: string | null) { this.set(ControlStyle.layoutGridCharProperty, value); }

    static layoutGridLineProperty = DependencyProperty.registerAttached(ControlStyle, "layoutGridLine", new PropertyMetadata(null));
    get layoutGridLine(): string | null { return this.get(ControlStyle.layoutGridLineProperty); }
    set layoutGridLine(value: string | null) { this.set(ControlStyle.layoutGridLineProperty, value); }

    static layoutGridModeProperty = DependencyProperty.registerAttached(ControlStyle, "layoutGridMode", new PropertyMetadata(null));
    get layoutGridMode(): string | null { return this.get(ControlStyle.layoutGridModeProperty); }
    set layoutGridMode(value: string | null) { this.set(ControlStyle.layoutGridModeProperty, value); }

    static layoutGridTypeProperty = DependencyProperty.registerAttached(ControlStyle, "layoutGridType", new PropertyMetadata(null));
    get layoutGridType(): string | null { return this.get(ControlStyle.layoutGridTypeProperty); }
    set layoutGridType(value: string | null) { this.set(ControlStyle.layoutGridTypeProperty, value); }

    static leftProperty = DependencyProperty.registerAttached(ControlStyle, "left", new PropertyMetadata(null));
    get left(): string { return this.get(ControlStyle.leftProperty); }
    set left(value: string) { this.set(ControlStyle.leftProperty, value); }

    static lengthProperty = DependencyProperty.registerAttached(ControlStyle, "length", new PropertyMetadata(null));
    get length(): number { return this.get(ControlStyle.lengthProperty); }
    set length(value: number) { this.set(ControlStyle.lengthProperty, value); }

    static letterSpacingProperty = DependencyProperty.registerAttached(ControlStyle, "letterSpacing", new PropertyMetadata(null));
    get letterSpacing(): string { return this.get(ControlStyle.letterSpacingProperty); }
    set letterSpacing(value: string) { this.set(ControlStyle.letterSpacingProperty, value); }

    static lightingColorProperty = DependencyProperty.registerAttached(ControlStyle, "lightingColor", new PropertyMetadata(null));
    get lightingColor(): string { return this.get(ControlStyle.lightingColorProperty); }
    set lightingColor(value: string) { this.set(ControlStyle.lightingColorProperty, value); }

    static lineBreakProperty = DependencyProperty.registerAttached(ControlStyle, "lineBreak", new PropertyMetadata(null));
    get lineBreak(): string { return this.get(ControlStyle.lineBreakProperty); }
    set lineBreak(value: string) { this.set(ControlStyle.lineBreakProperty, value); }

    static lineHeightProperty = DependencyProperty.registerAttached(ControlStyle, "lineHeight", new PropertyMetadata(null));
    get lineHeight(): string { return this.get(ControlStyle.lineHeightProperty); }
    set lineHeight(value: string) { this.set(ControlStyle.lineHeightProperty, value); }

    static listStyleProperty = DependencyProperty.registerAttached(ControlStyle, "listStyle", new PropertyMetadata(null));
    get listStyle(): string { return this.get(ControlStyle.listStyleProperty); }
    set listStyle(value: string) { this.set(ControlStyle.listStyleProperty, value); }

    static listStyleImageProperty = DependencyProperty.registerAttached(ControlStyle, "listStyleImage", new PropertyMetadata(null));
    get listStyleImage(): string { return this.get(ControlStyle.listStyleImageProperty); }
    set listStyleImage(value: string) { this.set(ControlStyle.listStyleImageProperty, value); }

    static listStylePositionProperty = DependencyProperty.registerAttached(ControlStyle, "listStylePosition", new PropertyMetadata(null));
    get listStylePosition(): string { return this.get(ControlStyle.listStylePositionProperty); }
    set listStylePosition(value: string) { this.set(ControlStyle.listStylePositionProperty, value); }

    static listStyleTypeProperty = DependencyProperty.registerAttached(ControlStyle, "listStyleType", new PropertyMetadata(null));
    get listStyleType(): string { return this.get(ControlStyle.listStyleTypeProperty); }
    set listStyleType(value: string) { this.set(ControlStyle.listStyleTypeProperty, value); }

    static marginProperty = DependencyProperty.registerAttached(ControlStyle, "margin", new PropertyMetadata(null));
    get margin(): string { return this.get(ControlStyle.marginProperty); }
    set margin(value: string) { this.set(ControlStyle.marginProperty, value); }

    static marginBlockEndProperty = DependencyProperty.registerAttached(ControlStyle, "marginBlockEnd", new PropertyMetadata(null));
    get marginBlockEnd(): string { return this.get(ControlStyle.marginBlockEndProperty); }
    set marginBlockEnd(value: string) { this.set(ControlStyle.marginBlockEndProperty, value); }

    static marginBlockStartProperty = DependencyProperty.registerAttached(ControlStyle, "marginBlockStart", new PropertyMetadata(null));
    get marginBlockStart(): string { return this.get(ControlStyle.marginBlockStartProperty); }
    set marginBlockStart(value: string) { this.set(ControlStyle.marginBlockStartProperty, value); }

    static marginBottomProperty = DependencyProperty.registerAttached(ControlStyle, "marginBottom", new PropertyMetadata(null));
    get marginBottom(): string { return this.get(ControlStyle.marginBottomProperty); }
    set marginBottom(value: string) { this.set(ControlStyle.marginBottomProperty, value); }

    static marginInlineEndProperty = DependencyProperty.registerAttached(ControlStyle, "marginInlineEnd", new PropertyMetadata(null));
    get marginInlineEnd(): string { return this.get(ControlStyle.marginInlineEndProperty); }
    set marginInlineEnd(value: string) { this.set(ControlStyle.marginInlineEndProperty, value); }

    static marginInlineStartProperty = DependencyProperty.registerAttached(ControlStyle, "marginInlineStart", new PropertyMetadata(null));
    get marginInlineStart(): string { return this.get(ControlStyle.marginInlineStartProperty); }
    set marginInlineStart(value: string) { this.set(ControlStyle.marginInlineStartProperty, value); }

    static marginLeftProperty = DependencyProperty.registerAttached(ControlStyle, "marginLeft", new PropertyMetadata(null));
    get marginLeft(): string { return this.get(ControlStyle.marginLeftProperty); }
    set marginLeft(value: string) { this.set(ControlStyle.marginLeftProperty, value); }

    static marginRightProperty = DependencyProperty.registerAttached(ControlStyle, "marginRight", new PropertyMetadata(null));
    get marginRight(): string { return this.get(ControlStyle.marginRightProperty); }
    set marginRight(value: string) { this.set(ControlStyle.marginRightProperty, value); }

    static marginTopProperty = DependencyProperty.registerAttached(ControlStyle, "marginTop", new PropertyMetadata(null));
    get marginTop(): string { return this.get(ControlStyle.marginTopProperty); }
    set marginTop(value: string) { this.set(ControlStyle.marginTopProperty, value); }

    static markerProperty = DependencyProperty.registerAttached(ControlStyle, "marker", new PropertyMetadata(null));
    get marker(): string { return this.get(ControlStyle.markerProperty); }
    set marker(value: string) { this.set(ControlStyle.markerProperty, value); }

    static markerEndProperty = DependencyProperty.registerAttached(ControlStyle, "markerEnd", new PropertyMetadata(null));
    get markerEnd(): string { return this.get(ControlStyle.markerEndProperty); }
    set markerEnd(value: string) { this.set(ControlStyle.markerEndProperty, value); }

    static markerMidProperty = DependencyProperty.registerAttached(ControlStyle, "markerMid", new PropertyMetadata(null));
    get markerMid(): string { return this.get(ControlStyle.markerMidProperty); }
    set markerMid(value: string) { this.set(ControlStyle.markerMidProperty, value); }

    static markerStartProperty = DependencyProperty.registerAttached(ControlStyle, "markerStart", new PropertyMetadata(null));
    get markerStart(): string { return this.get(ControlStyle.markerStartProperty); }
    set markerStart(value: string) { this.set(ControlStyle.markerStartProperty, value); }

    static maskProperty = DependencyProperty.registerAttached(ControlStyle, "mask", new PropertyMetadata(null));
    get mask(): string { return this.get(ControlStyle.maskProperty); }
    set mask(value: string) { this.set(ControlStyle.maskProperty, value); }

    static maskCompositeProperty = DependencyProperty.registerAttached(ControlStyle, "maskComposite", new PropertyMetadata(null));
    get maskComposite(): string { return this.get(ControlStyle.maskCompositeProperty); }
    set maskComposite(value: string) { this.set(ControlStyle.maskCompositeProperty, value); }

    static maskImageProperty = DependencyProperty.registerAttached(ControlStyle, "maskImage", new PropertyMetadata(null));
    get maskImage(): string { return this.get(ControlStyle.maskImageProperty); }
    set maskImage(value: string) { this.set(ControlStyle.maskImageProperty, value); }

    static maskPositionProperty = DependencyProperty.registerAttached(ControlStyle, "maskPosition", new PropertyMetadata(null));
    get maskPosition(): string { return this.get(ControlStyle.maskPositionProperty); }
    set maskPosition(value: string) { this.set(ControlStyle.maskPositionProperty, value); }

    static maskRepeatProperty = DependencyProperty.registerAttached(ControlStyle, "maskRepeat", new PropertyMetadata(null));
    get maskRepeat(): string { return this.get(ControlStyle.maskRepeatProperty); }
    set maskRepeat(value: string) { this.set(ControlStyle.maskRepeatProperty, value); }

    static maskSizeProperty = DependencyProperty.registerAttached(ControlStyle, "maskSize", new PropertyMetadata(null));
    get maskSize(): string { return this.get(ControlStyle.maskSizeProperty); }
    set maskSize(value: string) { this.set(ControlStyle.maskSizeProperty, value); }

    static maskTypeProperty = DependencyProperty.registerAttached(ControlStyle, "maskType", new PropertyMetadata(null));
    get maskType(): string { return this.get(ControlStyle.maskTypeProperty); }
    set maskType(value: string) { this.set(ControlStyle.maskTypeProperty, value); }

    static maxBlockSizeProperty = DependencyProperty.registerAttached(ControlStyle, "maxBlockSize", new PropertyMetadata(null));
    get maxBlockSize(): string { return this.get(ControlStyle.maxBlockSizeProperty); }
    set maxBlockSize(value: string) { this.set(ControlStyle.maxBlockSizeProperty, value); }

    static maxHeightProperty = DependencyProperty.registerAttached(ControlStyle, "maxHeight", new PropertyMetadata(null));
    get maxHeight(): string { return this.get(ControlStyle.maxHeightProperty); }
    set maxHeight(value: string) { this.set(ControlStyle.maxHeightProperty, value); }

    static maxInlineSizeProperty = DependencyProperty.registerAttached(ControlStyle, "maxInlineSize", new PropertyMetadata(null));
    get maxInlineSize(): string { return this.get(ControlStyle.maxInlineSizeProperty); }
    set maxInlineSize(value: string) { this.set(ControlStyle.maxInlineSizeProperty, value); }

    static maxWidthProperty = DependencyProperty.registerAttached(ControlStyle, "maxWidth", new PropertyMetadata(null));
    get maxWidth(): string { return this.get(ControlStyle.maxWidthProperty); }
    set maxWidth(value: string) { this.set(ControlStyle.maxWidthProperty, value); }

    static minBlockSizeProperty = DependencyProperty.registerAttached(ControlStyle, "minBlockSize", new PropertyMetadata(null));
    get minBlockSize(): string { return this.get(ControlStyle.minBlockSizeProperty); }
    set minBlockSize(value: string) { this.set(ControlStyle.minBlockSizeProperty, value); }

    static minHeightProperty = DependencyProperty.registerAttached(ControlStyle, "minHeight", new PropertyMetadata(null));
    get minHeight(): string { return this.get(ControlStyle.minHeightProperty); }
    set minHeight(value: string) { this.set(ControlStyle.minHeightProperty, value); }

    static minInlineSizeProperty = DependencyProperty.registerAttached(ControlStyle, "minInlineSize", new PropertyMetadata(null));
    get minInlineSize(): string { return this.get(ControlStyle.minInlineSizeProperty); }
    set minInlineSize(value: string) { this.set(ControlStyle.minInlineSizeProperty, value); }

    static minWidthProperty = DependencyProperty.registerAttached(ControlStyle, "minWidth", new PropertyMetadata(null));
    get minWidth(): string { return this.get(ControlStyle.minWidthProperty); }
    set minWidth(value: string) { this.set(ControlStyle.minWidthProperty, value); }

    static msContentZoomChainingProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomChaining", new PropertyMetadata(null));
    get msContentZoomChaining(): string | null { return this.get(ControlStyle.msContentZoomChainingProperty); }
    set msContentZoomChaining(value: string | null) { this.set(ControlStyle.msContentZoomChainingProperty, value); }

    static msContentZoomLimitProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomLimit", new PropertyMetadata(null));
    get msContentZoomLimit(): string | null { return this.get(ControlStyle.msContentZoomLimitProperty); }
    set msContentZoomLimit(value: string | null) { this.set(ControlStyle.msContentZoomLimitProperty, value); }

    static msContentZoomLimitMaxProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomLimitMax", new PropertyMetadata(null));
    get msContentZoomLimitMax(): any { return this.get(ControlStyle.msContentZoomLimitMaxProperty); }
    set msContentZoomLimitMax(value: any) { this.set(ControlStyle.msContentZoomLimitMaxProperty, value); }

    static msContentZoomLimitMinProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomLimitMin", new PropertyMetadata(null));
    get msContentZoomLimitMin(): any { return this.get(ControlStyle.msContentZoomLimitMinProperty); }
    set msContentZoomLimitMin(value: any) { this.set(ControlStyle.msContentZoomLimitMinProperty, value); }

    static msContentZoomSnapProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomSnap", new PropertyMetadata(null));
    get msContentZoomSnap(): string | null { return this.get(ControlStyle.msContentZoomSnapProperty); }
    set msContentZoomSnap(value: string | null) { this.set(ControlStyle.msContentZoomSnapProperty, value); }

    static msContentZoomSnapPointsProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomSnapPoints", new PropertyMetadata(null));
    get msContentZoomSnapPoints(): string | null { return this.get(ControlStyle.msContentZoomSnapPointsProperty); }
    set msContentZoomSnapPoints(value: string | null) { this.set(ControlStyle.msContentZoomSnapPointsProperty, value); }

    static msContentZoomSnapTypeProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZoomSnapType", new PropertyMetadata(null));
    get msContentZoomSnapType(): string | null { return this.get(ControlStyle.msContentZoomSnapTypeProperty); }
    set msContentZoomSnapType(value: string | null) { this.set(ControlStyle.msContentZoomSnapTypeProperty, value); }

    static msContentZoomingProperty = DependencyProperty.registerAttached(ControlStyle, "msContentZooming", new PropertyMetadata(null));
    get msContentZooming(): string | null { return this.get(ControlStyle.msContentZoomingProperty); }
    set msContentZooming(value: string | null) { this.set(ControlStyle.msContentZoomingProperty, value); }

    static msFlowFromProperty = DependencyProperty.registerAttached(ControlStyle, "msFlowFrom", new PropertyMetadata(null));
    get msFlowFrom(): string | null { return this.get(ControlStyle.msFlowFromProperty); }
    set msFlowFrom(value: string | null) { this.set(ControlStyle.msFlowFromProperty, value); }

    static msFlowIntoProperty = DependencyProperty.registerAttached(ControlStyle, "msFlowInto", new PropertyMetadata(null));
    get msFlowInto(): string | null { return this.get(ControlStyle.msFlowIntoProperty); }
    set msFlowInto(value: string | null) { this.set(ControlStyle.msFlowIntoProperty, value); }

    static msFontFeatureSettingsProperty = DependencyProperty.registerAttached(ControlStyle, "msFontFeatureSettings", new PropertyMetadata(null));
    get msFontFeatureSettings(): string | null { return this.get(ControlStyle.msFontFeatureSettingsProperty); }
    set msFontFeatureSettings(value: string | null) { this.set(ControlStyle.msFontFeatureSettingsProperty, value); }

    static msGridColumnProperty = DependencyProperty.registerAttached(ControlStyle, "msGridColumn", new PropertyMetadata(null));
    get msGridColumn(): any { return this.get(ControlStyle.msGridColumnProperty); }
    set msGridColumn(value: any) { this.set(ControlStyle.msGridColumnProperty, value); }

    static msGridColumnAlignProperty = DependencyProperty.registerAttached(ControlStyle, "msGridColumnAlign", new PropertyMetadata(null));
    get msGridColumnAlign(): string | null { return this.get(ControlStyle.msGridColumnAlignProperty); }
    set msGridColumnAlign(value: string | null) { this.set(ControlStyle.msGridColumnAlignProperty, value); }

    static msGridColumnSpanProperty = DependencyProperty.registerAttached(ControlStyle, "msGridColumnSpan", new PropertyMetadata(null));
    get msGridColumnSpan(): any { return this.get(ControlStyle.msGridColumnSpanProperty); }
    set msGridColumnSpan(value: any) { this.set(ControlStyle.msGridColumnSpanProperty, value); }

    static msGridColumnsProperty = DependencyProperty.registerAttached(ControlStyle, "msGridColumns", new PropertyMetadata(null));
    get msGridColumns(): string | null { return this.get(ControlStyle.msGridColumnsProperty); }
    set msGridColumns(value: string | null) { this.set(ControlStyle.msGridColumnsProperty, value); }

    static msGridRowProperty = DependencyProperty.registerAttached(ControlStyle, "msGridRow", new PropertyMetadata(null));
    get msGridRow(): any { return this.get(ControlStyle.msGridRowProperty); }
    set msGridRow(value: any) { this.set(ControlStyle.msGridRowProperty, value); }

    static msGridRowAlignProperty = DependencyProperty.registerAttached(ControlStyle, "msGridRowAlign", new PropertyMetadata(null));
    get msGridRowAlign(): string | null { return this.get(ControlStyle.msGridRowAlignProperty); }
    set msGridRowAlign(value: string | null) { this.set(ControlStyle.msGridRowAlignProperty, value); }

    static msGridRowSpanProperty = DependencyProperty.registerAttached(ControlStyle, "msGridRowSpan", new PropertyMetadata(null));
    get msGridRowSpan(): any { return this.get(ControlStyle.msGridRowSpanProperty); }
    set msGridRowSpan(value: any) { this.set(ControlStyle.msGridRowSpanProperty, value); }

    static msGridRowsProperty = DependencyProperty.registerAttached(ControlStyle, "msGridRows", new PropertyMetadata(null));
    get msGridRows(): string | null { return this.get(ControlStyle.msGridRowsProperty); }
    set msGridRows(value: string | null) { this.set(ControlStyle.msGridRowsProperty, value); }

    static msHighContrastAdjustProperty = DependencyProperty.registerAttached(ControlStyle, "msHighContrastAdjust", new PropertyMetadata(null));
    get msHighContrastAdjust(): string | null { return this.get(ControlStyle.msHighContrastAdjustProperty); }
    set msHighContrastAdjust(value: string | null) { this.set(ControlStyle.msHighContrastAdjustProperty, value); }

    static msHyphenateLimitCharsProperty = DependencyProperty.registerAttached(ControlStyle, "msHyphenateLimitChars", new PropertyMetadata(null));
    get msHyphenateLimitChars(): string | null { return this.get(ControlStyle.msHyphenateLimitCharsProperty); }
    set msHyphenateLimitChars(value: string | null) { this.set(ControlStyle.msHyphenateLimitCharsProperty, value); }

    static msHyphenateLimitLinesProperty = DependencyProperty.registerAttached(ControlStyle, "msHyphenateLimitLines", new PropertyMetadata(null));
    get msHyphenateLimitLines(): any { return this.get(ControlStyle.msHyphenateLimitLinesProperty); }
    set msHyphenateLimitLines(value: any) { this.set(ControlStyle.msHyphenateLimitLinesProperty, value); }

    static msHyphenateLimitZoneProperty = DependencyProperty.registerAttached(ControlStyle, "msHyphenateLimitZone", new PropertyMetadata(null));
    get msHyphenateLimitZone(): any { return this.get(ControlStyle.msHyphenateLimitZoneProperty); }
    set msHyphenateLimitZone(value: any) { this.set(ControlStyle.msHyphenateLimitZoneProperty, value); }

    static msHyphensProperty = DependencyProperty.registerAttached(ControlStyle, "msHyphens", new PropertyMetadata(null));
    get msHyphens(): string | null { return this.get(ControlStyle.msHyphensProperty); }
    set msHyphens(value: string | null) { this.set(ControlStyle.msHyphensProperty, value); }

    static msImeAlignProperty = DependencyProperty.registerAttached(ControlStyle, "msImeAlign", new PropertyMetadata(null));
    get msImeAlign(): string | null { return this.get(ControlStyle.msImeAlignProperty); }
    set msImeAlign(value: string | null) { this.set(ControlStyle.msImeAlignProperty, value); }

    static msOverflowStyleProperty = DependencyProperty.registerAttached(ControlStyle, "msOverflowStyle", new PropertyMetadata(null));
    get msOverflowStyle(): string | null { return this.get(ControlStyle.msOverflowStyleProperty); }
    set msOverflowStyle(value: string | null) { this.set(ControlStyle.msOverflowStyleProperty, value); }

    static msScrollChainingProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollChaining", new PropertyMetadata(null));
    get msScrollChaining(): string | null { return this.get(ControlStyle.msScrollChainingProperty); }
    set msScrollChaining(value: string | null) { this.set(ControlStyle.msScrollChainingProperty, value); }

    static msScrollLimitProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollLimit", new PropertyMetadata(null));
    get msScrollLimit(): string | null { return this.get(ControlStyle.msScrollLimitProperty); }
    set msScrollLimit(value: string | null) { this.set(ControlStyle.msScrollLimitProperty, value); }

    static msScrollLimitXMaxProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollLimitXMax", new PropertyMetadata(null));
    get msScrollLimitXMax(): any { return this.get(ControlStyle.msScrollLimitXMaxProperty); }
    set msScrollLimitXMax(value: any) { this.set(ControlStyle.msScrollLimitXMaxProperty, value); }

    static msScrollLimitXMinProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollLimitXMin", new PropertyMetadata(null));
    get msScrollLimitXMin(): any { return this.get(ControlStyle.msScrollLimitXMinProperty); }
    set msScrollLimitXMin(value: any) { this.set(ControlStyle.msScrollLimitXMinProperty, value); }

    static msScrollLimitYMaxProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollLimitYMax", new PropertyMetadata(null));
    get msScrollLimitYMax(): any { return this.get(ControlStyle.msScrollLimitYMaxProperty); }
    set msScrollLimitYMax(value: any) { this.set(ControlStyle.msScrollLimitYMaxProperty, value); }

    static msScrollLimitYMinProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollLimitYMin", new PropertyMetadata(null));
    get msScrollLimitYMin(): any { return this.get(ControlStyle.msScrollLimitYMinProperty); }
    set msScrollLimitYMin(value: any) { this.set(ControlStyle.msScrollLimitYMinProperty, value); }

    static msScrollRailsProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollRails", new PropertyMetadata(null));
    get msScrollRails(): string | null { return this.get(ControlStyle.msScrollRailsProperty); }
    set msScrollRails(value: string | null) { this.set(ControlStyle.msScrollRailsProperty, value); }

    static msScrollSnapPointsXProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollSnapPointsX", new PropertyMetadata(null));
    get msScrollSnapPointsX(): string | null { return this.get(ControlStyle.msScrollSnapPointsXProperty); }
    set msScrollSnapPointsX(value: string | null) { this.set(ControlStyle.msScrollSnapPointsXProperty, value); }

    static msScrollSnapPointsYProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollSnapPointsY", new PropertyMetadata(null));
    get msScrollSnapPointsY(): string | null { return this.get(ControlStyle.msScrollSnapPointsYProperty); }
    set msScrollSnapPointsY(value: string | null) { this.set(ControlStyle.msScrollSnapPointsYProperty, value); }

    static msScrollSnapTypeProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollSnapType", new PropertyMetadata(null));
    get msScrollSnapType(): string | null { return this.get(ControlStyle.msScrollSnapTypeProperty); }
    set msScrollSnapType(value: string | null) { this.set(ControlStyle.msScrollSnapTypeProperty, value); }

    static msScrollSnapXProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollSnapX", new PropertyMetadata(null));
    get msScrollSnapX(): string | null { return this.get(ControlStyle.msScrollSnapXProperty); }
    set msScrollSnapX(value: string | null) { this.set(ControlStyle.msScrollSnapXProperty, value); }

    static msScrollSnapYProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollSnapY", new PropertyMetadata(null));
    get msScrollSnapY(): string | null { return this.get(ControlStyle.msScrollSnapYProperty); }
    set msScrollSnapY(value: string | null) { this.set(ControlStyle.msScrollSnapYProperty, value); }

    static msScrollTranslationProperty = DependencyProperty.registerAttached(ControlStyle, "msScrollTranslation", new PropertyMetadata(null));
    get msScrollTranslation(): string | null { return this.get(ControlStyle.msScrollTranslationProperty); }
    set msScrollTranslation(value: string | null) { this.set(ControlStyle.msScrollTranslationProperty, value); }

    static msTextCombineHorizontalProperty = DependencyProperty.registerAttached(ControlStyle, "msTextCombineHorizontal", new PropertyMetadata(null));
    get msTextCombineHorizontal(): string | null { return this.get(ControlStyle.msTextCombineHorizontalProperty); }
    set msTextCombineHorizontal(value: string | null) { this.set(ControlStyle.msTextCombineHorizontalProperty, value); }

    static msTextSizeAdjustProperty = DependencyProperty.registerAttached(ControlStyle, "msTextSizeAdjust", new PropertyMetadata(null));
    get msTextSizeAdjust(): any { return this.get(ControlStyle.msTextSizeAdjustProperty); }
    set msTextSizeAdjust(value: any) { this.set(ControlStyle.msTextSizeAdjustProperty, value); }

    static msTouchActionProperty = DependencyProperty.registerAttached(ControlStyle, "msTouchAction", new PropertyMetadata(null));
    get msTouchAction(): string | null { return this.get(ControlStyle.msTouchActionProperty); }
    set msTouchAction(value: string | null) { this.set(ControlStyle.msTouchActionProperty, value); }

    static msTouchSelectProperty = DependencyProperty.registerAttached(ControlStyle, "msTouchSelect", new PropertyMetadata(null));
    get msTouchSelect(): string | null { return this.get(ControlStyle.msTouchSelectProperty); }
    set msTouchSelect(value: string | null) { this.set(ControlStyle.msTouchSelectProperty, value); }

    static msUserSelectProperty = DependencyProperty.registerAttached(ControlStyle, "msUserSelect", new PropertyMetadata(null));
    get msUserSelect(): string | null { return this.get(ControlStyle.msUserSelectProperty); }
    set msUserSelect(value: string | null) { this.set(ControlStyle.msUserSelectProperty, value); }

    static msWrapFlowProperty = DependencyProperty.registerAttached(ControlStyle, "msWrapFlow", new PropertyMetadata(null));
    get msWrapFlow(): string { return this.get(ControlStyle.msWrapFlowProperty); }
    set msWrapFlow(value: string) { this.set(ControlStyle.msWrapFlowProperty, value); }

    static msWrapMarginProperty = DependencyProperty.registerAttached(ControlStyle, "msWrapMargin", new PropertyMetadata(null));
    get msWrapMargin(): any { return this.get(ControlStyle.msWrapMarginProperty); }
    set msWrapMargin(value: any) { this.set(ControlStyle.msWrapMarginProperty, value); }

    static msWrapThroughProperty = DependencyProperty.registerAttached(ControlStyle, "msWrapThrough", new PropertyMetadata(null));
    get msWrapThrough(): string { return this.get(ControlStyle.msWrapThroughProperty); }
    set msWrapThrough(value: string) { this.set(ControlStyle.msWrapThroughProperty, value); }

    static objectFitProperty = DependencyProperty.registerAttached(ControlStyle, "objectFit", new PropertyMetadata(null));
    get objectFit(): string { return this.get(ControlStyle.objectFitProperty); }
    set objectFit(value: string) { this.set(ControlStyle.objectFitProperty, value); }

    static objectPositionProperty = DependencyProperty.registerAttached(ControlStyle, "objectPosition", new PropertyMetadata(null));
    get objectPosition(): string { return this.get(ControlStyle.objectPositionProperty); }
    set objectPosition(value: string) { this.set(ControlStyle.objectPositionProperty, value); }

    static opacityProperty = DependencyProperty.registerAttached(ControlStyle, "opacity", new PropertyMetadata(null));
    get opacity(): string { return this.get(ControlStyle.opacityProperty); }
    set opacity(value: string) { this.set(ControlStyle.opacityProperty, value); }

    static orderProperty = DependencyProperty.registerAttached(ControlStyle, "order", new PropertyMetadata(null));
    get order(): string { return this.get(ControlStyle.orderProperty); }
    set order(value: string) { this.set(ControlStyle.orderProperty, value); }

    static orphansProperty = DependencyProperty.registerAttached(ControlStyle, "orphans", new PropertyMetadata(null));
    get orphans(): string { return this.get(ControlStyle.orphansProperty); }
    set orphans(value: string) { this.set(ControlStyle.orphansProperty, value); }

    static outlineProperty = DependencyProperty.registerAttached(ControlStyle, "outline", new PropertyMetadata(null));
    get outline(): string { return this.get(ControlStyle.outlineProperty); }
    set outline(value: string) { this.set(ControlStyle.outlineProperty, value); }

    static outlineColorProperty = DependencyProperty.registerAttached(ControlStyle, "outlineColor", new PropertyMetadata(null));
    get outlineColor(): string { return this.get(ControlStyle.outlineColorProperty); }
    set outlineColor(value: string) { this.set(ControlStyle.outlineColorProperty, value); }

    static outlineOffsetProperty = DependencyProperty.registerAttached(ControlStyle, "outlineOffset", new PropertyMetadata(null));
    get outlineOffset(): string { return this.get(ControlStyle.outlineOffsetProperty); }
    set outlineOffset(value: string) { this.set(ControlStyle.outlineOffsetProperty, value); }

    static outlineStyleProperty = DependencyProperty.registerAttached(ControlStyle, "outlineStyle", new PropertyMetadata(null));
    get outlineStyle(): string { return this.get(ControlStyle.outlineStyleProperty); }
    set outlineStyle(value: string) { this.set(ControlStyle.outlineStyleProperty, value); }

    static outlineWidthProperty = DependencyProperty.registerAttached(ControlStyle, "outlineWidth", new PropertyMetadata(null));
    get outlineWidth(): string { return this.get(ControlStyle.outlineWidthProperty); }
    set outlineWidth(value: string) { this.set(ControlStyle.outlineWidthProperty, value); }

    static overflowProperty = DependencyProperty.registerAttached(ControlStyle, "overflow", new PropertyMetadata(null));
    get overflow(): string { return this.get(ControlStyle.overflowProperty); }
    set overflow(value: string) { this.set(ControlStyle.overflowProperty, value); }

    static overflowAnchorProperty = DependencyProperty.registerAttached(ControlStyle, "overflowAnchor", new PropertyMetadata(null));
    get overflowAnchor(): string { return this.get(ControlStyle.overflowAnchorProperty); }
    set overflowAnchor(value: string) { this.set(ControlStyle.overflowAnchorProperty, value); }

    static overflowWrapProperty = DependencyProperty.registerAttached(ControlStyle, "overflowWrap", new PropertyMetadata(null));
    get overflowWrap(): string { return this.get(ControlStyle.overflowWrapProperty); }
    set overflowWrap(value: string) { this.set(ControlStyle.overflowWrapProperty, value); }

    static overflowXProperty = DependencyProperty.registerAttached(ControlStyle, "overflowX", new PropertyMetadata(null));
    get overflowX(): string { return this.get(ControlStyle.overflowXProperty); }
    set overflowX(value: string) { this.set(ControlStyle.overflowXProperty, value); }

    static overflowYProperty = DependencyProperty.registerAttached(ControlStyle, "overflowY", new PropertyMetadata(null));
    get overflowY(): string { return this.get(ControlStyle.overflowYProperty); }
    set overflowY(value: string) { this.set(ControlStyle.overflowYProperty, value); }

    static overscrollBehaviorProperty = DependencyProperty.registerAttached(ControlStyle, "overscrollBehavior", new PropertyMetadata(null));
    get overscrollBehavior(): string { return this.get(ControlStyle.overscrollBehaviorProperty); }
    set overscrollBehavior(value: string) { this.set(ControlStyle.overscrollBehaviorProperty, value); }

    static overscrollBehaviorBlockProperty = DependencyProperty.registerAttached(ControlStyle, "overscrollBehaviorBlock", new PropertyMetadata(null));
    get overscrollBehaviorBlock(): string { return this.get(ControlStyle.overscrollBehaviorBlockProperty); }
    set overscrollBehaviorBlock(value: string) { this.set(ControlStyle.overscrollBehaviorBlockProperty, value); }

    static overscrollBehaviorInlineProperty = DependencyProperty.registerAttached(ControlStyle, "overscrollBehaviorInline", new PropertyMetadata(null));
    get overscrollBehaviorInline(): string { return this.get(ControlStyle.overscrollBehaviorInlineProperty); }
    set overscrollBehaviorInline(value: string) { this.set(ControlStyle.overscrollBehaviorInlineProperty, value); }

    static overscrollBehaviorXProperty = DependencyProperty.registerAttached(ControlStyle, "overscrollBehaviorX", new PropertyMetadata(null));
    get overscrollBehaviorX(): string { return this.get(ControlStyle.overscrollBehaviorXProperty); }
    set overscrollBehaviorX(value: string) { this.set(ControlStyle.overscrollBehaviorXProperty, value); }

    static overscrollBehaviorYProperty = DependencyProperty.registerAttached(ControlStyle, "overscrollBehaviorY", new PropertyMetadata(null));
    get overscrollBehaviorY(): string { return this.get(ControlStyle.overscrollBehaviorYProperty); }
    set overscrollBehaviorY(value: string) { this.set(ControlStyle.overscrollBehaviorYProperty, value); }

    static paddingProperty = DependencyProperty.registerAttached(ControlStyle, "padding", new PropertyMetadata(null));
    get padding(): string { return this.get(ControlStyle.paddingProperty); }
    set padding(value: string) { this.set(ControlStyle.paddingProperty, value); }

    static paddingBlockEndProperty = DependencyProperty.registerAttached(ControlStyle, "paddingBlockEnd", new PropertyMetadata(null));
    get paddingBlockEnd(): string { return this.get(ControlStyle.paddingBlockEndProperty); }
    set paddingBlockEnd(value: string) { this.set(ControlStyle.paddingBlockEndProperty, value); }

    static paddingBlockStartProperty = DependencyProperty.registerAttached(ControlStyle, "paddingBlockStart", new PropertyMetadata(null));
    get paddingBlockStart(): string { return this.get(ControlStyle.paddingBlockStartProperty); }
    set paddingBlockStart(value: string) { this.set(ControlStyle.paddingBlockStartProperty, value); }

    static paddingBottomProperty = DependencyProperty.registerAttached(ControlStyle, "paddingBottom", new PropertyMetadata(null));
    get paddingBottom(): string { return this.get(ControlStyle.paddingBottomProperty); }
    set paddingBottom(value: string) { this.set(ControlStyle.paddingBottomProperty, value); }

    static paddingInlineEndProperty = DependencyProperty.registerAttached(ControlStyle, "paddingInlineEnd", new PropertyMetadata(null));
    get paddingInlineEnd(): string { return this.get(ControlStyle.paddingInlineEndProperty); }
    set paddingInlineEnd(value: string) { this.set(ControlStyle.paddingInlineEndProperty, value); }

    static paddingInlineStartProperty = DependencyProperty.registerAttached(ControlStyle, "paddingInlineStart", new PropertyMetadata(null));
    get paddingInlineStart(): string { return this.get(ControlStyle.paddingInlineStartProperty); }
    set paddingInlineStart(value: string) { this.set(ControlStyle.paddingInlineStartProperty, value); }

    static paddingLeftProperty = DependencyProperty.registerAttached(ControlStyle, "paddingLeft", new PropertyMetadata(null));
    get paddingLeft(): string { return this.get(ControlStyle.paddingLeftProperty); }
    set paddingLeft(value: string) { this.set(ControlStyle.paddingLeftProperty, value); }

    static paddingRightProperty = DependencyProperty.registerAttached(ControlStyle, "paddingRight", new PropertyMetadata(null));
    get paddingRight(): string { return this.get(ControlStyle.paddingRightProperty); }
    set paddingRight(value: string) { this.set(ControlStyle.paddingRightProperty, value); }

    static paddingTopProperty = DependencyProperty.registerAttached(ControlStyle, "paddingTop", new PropertyMetadata(null));
    get paddingTop(): string { return this.get(ControlStyle.paddingTopProperty); }
    set paddingTop(value: string) { this.set(ControlStyle.paddingTopProperty, value); }

    static pageBreakAfterProperty = DependencyProperty.registerAttached(ControlStyle, "pageBreakAfter", new PropertyMetadata(null));
    get pageBreakAfter(): string { return this.get(ControlStyle.pageBreakAfterProperty); }
    set pageBreakAfter(value: string) { this.set(ControlStyle.pageBreakAfterProperty, value); }

    static pageBreakBeforeProperty = DependencyProperty.registerAttached(ControlStyle, "pageBreakBefore", new PropertyMetadata(null));
    get pageBreakBefore(): string { return this.get(ControlStyle.pageBreakBeforeProperty); }
    set pageBreakBefore(value: string) { this.set(ControlStyle.pageBreakBeforeProperty, value); }

    static pageBreakInsideProperty = DependencyProperty.registerAttached(ControlStyle, "pageBreakInside", new PropertyMetadata(null));
    get pageBreakInside(): string { return this.get(ControlStyle.pageBreakInsideProperty); }
    set pageBreakInside(value: string) { this.set(ControlStyle.pageBreakInsideProperty, value); }

    static paintOrderProperty = DependencyProperty.registerAttached(ControlStyle, "paintOrder", new PropertyMetadata(null));
    get paintOrder(): string { return this.get(ControlStyle.paintOrderProperty); }
    set paintOrder(value: string) { this.set(ControlStyle.paintOrderProperty, value); }

    static parentRuleProperty = DependencyProperty.registerAttached(ControlStyle, "parentRule", new PropertyMetadata(null));
    get parentRule(): CSSRule { return this.get(ControlStyle.parentRuleProperty); }
    set parentRule(value: CSSRule) { this.set(ControlStyle.parentRuleProperty, value); }

    static penActionProperty = DependencyProperty.registerAttached(ControlStyle, "penAction", new PropertyMetadata(null));
    get penAction(): string | null { return this.get(ControlStyle.penActionProperty); }
    set penAction(value: string | null) { this.set(ControlStyle.penActionProperty, value); }

    static perspectiveProperty = DependencyProperty.registerAttached(ControlStyle, "perspective", new PropertyMetadata(null));
    get perspective(): string { return this.get(ControlStyle.perspectiveProperty); }
    set perspective(value: string) { this.set(ControlStyle.perspectiveProperty, value); }

    static perspectiveOriginProperty = DependencyProperty.registerAttached(ControlStyle, "perspectiveOrigin", new PropertyMetadata(null));
    get perspectiveOrigin(): string { return this.get(ControlStyle.perspectiveOriginProperty); }
    set perspectiveOrigin(value: string) { this.set(ControlStyle.perspectiveOriginProperty, value); }

    static placeContentProperty = DependencyProperty.registerAttached(ControlStyle, "placeContent", new PropertyMetadata(null));
    get placeContent(): string { return this.get(ControlStyle.placeContentProperty); }
    set placeContent(value: string) { this.set(ControlStyle.placeContentProperty, value); }

    static placeItemsProperty = DependencyProperty.registerAttached(ControlStyle, "placeItems", new PropertyMetadata(null));
    get placeItems(): string { return this.get(ControlStyle.placeItemsProperty); }
    set placeItems(value: string) { this.set(ControlStyle.placeItemsProperty, value); }

    static placeSelfProperty = DependencyProperty.registerAttached(ControlStyle, "placeSelf", new PropertyMetadata(null));
    get placeSelf(): string { return this.get(ControlStyle.placeSelfProperty); }
    set placeSelf(value: string) { this.set(ControlStyle.placeSelfProperty, value); }

    static pointerEventsProperty = DependencyProperty.registerAttached(ControlStyle, "pointerEvents", new PropertyMetadata(null));
    get pointerEvents(): string | null { return this.get(ControlStyle.pointerEventsProperty); }
    set pointerEvents(value: string | null) { this.set(ControlStyle.pointerEventsProperty, value); }

    static positionProperty = DependencyProperty.registerAttached(ControlStyle, "position", new PropertyMetadata(null));
    get position(): string { return this.get(ControlStyle.positionProperty); }
    set position(value: string) { this.set(ControlStyle.positionProperty, value); }

    static quotesProperty = DependencyProperty.registerAttached(ControlStyle, "quotes", new PropertyMetadata(null));
    get quotes(): string { return this.get(ControlStyle.quotesProperty); }
    set quotes(value: string) { this.set(ControlStyle.quotesProperty, value); }

    static resizeProperty = DependencyProperty.registerAttached(ControlStyle, "resize", new PropertyMetadata(null));
    get resize(): string { return this.get(ControlStyle.resizeProperty); }
    set resize(value: string) { this.set(ControlStyle.resizeProperty, value); }

    static rightProperty = DependencyProperty.registerAttached(ControlStyle, "right", new PropertyMetadata(null));
    get right(): string { return this.get(ControlStyle.rightProperty); }
    set right(value: string) { this.set(ControlStyle.rightProperty, value); }

    static rotateProperty = DependencyProperty.registerAttached(ControlStyle, "rotate", new PropertyMetadata(null));
    get rotate(): string { return this.get(ControlStyle.rotateProperty); }
    set rotate(value: string) { this.set(ControlStyle.rotateProperty, value); }

    static rowGapProperty = DependencyProperty.registerAttached(ControlStyle, "rowGap", new PropertyMetadata(null));
    get rowGap(): string { return this.get(ControlStyle.rowGapProperty); }
    set rowGap(value: string) { this.set(ControlStyle.rowGapProperty, value); }

    static rubyAlignProperty = DependencyProperty.registerAttached(ControlStyle, "rubyAlign", new PropertyMetadata(null));
    get rubyAlign(): string { return this.get(ControlStyle.rubyAlignProperty); }
    set rubyAlign(value: string) { this.set(ControlStyle.rubyAlignProperty, value); }

    static rubyOverhangProperty = DependencyProperty.registerAttached(ControlStyle, "rubyOverhang", new PropertyMetadata(null));
    get rubyOverhang(): string | null { return this.get(ControlStyle.rubyOverhangProperty); }
    set rubyOverhang(value: string | null) { this.set(ControlStyle.rubyOverhangProperty, value); }

    static rubyPositionProperty = DependencyProperty.registerAttached(ControlStyle, "rubyPosition", new PropertyMetadata(null));
    get rubyPosition(): string { return this.get(ControlStyle.rubyPositionProperty); }
    set rubyPosition(value: string) { this.set(ControlStyle.rubyPositionProperty, value); }

    static scaleProperty = DependencyProperty.registerAttached(ControlStyle, "scale", new PropertyMetadata(null));
    get scale(): string { return this.get(ControlStyle.scaleProperty); }
    set scale(value: string) { this.set(ControlStyle.scaleProperty, value); }

    static scrollBehaviorProperty = DependencyProperty.registerAttached(ControlStyle, "scrollBehavior", new PropertyMetadata(null));
    get scrollBehavior(): string { return this.get(ControlStyle.scrollBehaviorProperty); }
    set scrollBehavior(value: string) { this.set(ControlStyle.scrollBehaviorProperty, value); }

    static shapeRenderingProperty = DependencyProperty.registerAttached(ControlStyle, "shapeRendering", new PropertyMetadata(null));
    get shapeRendering(): string { return this.get(ControlStyle.shapeRenderingProperty); }
    set shapeRendering(value: string) { this.set(ControlStyle.shapeRenderingProperty, value); }

    static stopColorProperty = DependencyProperty.registerAttached(ControlStyle, "stopColor", new PropertyMetadata(null));
    get stopColor(): string { return this.get(ControlStyle.stopColorProperty); }
    set stopColor(value: string) { this.set(ControlStyle.stopColorProperty, value); }

    static stopOpacityProperty = DependencyProperty.registerAttached(ControlStyle, "stopOpacity", new PropertyMetadata(null));
    get stopOpacity(): string { return this.get(ControlStyle.stopOpacityProperty); }
    set stopOpacity(value: string) { this.set(ControlStyle.stopOpacityProperty, value); }

    static strokeProperty = DependencyProperty.registerAttached(ControlStyle, "stroke", new PropertyMetadata(null));
    get stroke(): string { return this.get(ControlStyle.strokeProperty); }
    set stroke(value: string) { this.set(ControlStyle.strokeProperty, value); }

    static strokeDasharrayProperty = DependencyProperty.registerAttached(ControlStyle, "strokeDasharray", new PropertyMetadata(null));
    get strokeDasharray(): string { return this.get(ControlStyle.strokeDasharrayProperty); }
    set strokeDasharray(value: string) { this.set(ControlStyle.strokeDasharrayProperty, value); }

    static strokeDashoffsetProperty = DependencyProperty.registerAttached(ControlStyle, "strokeDashoffset", new PropertyMetadata(null));
    get strokeDashoffset(): string { return this.get(ControlStyle.strokeDashoffsetProperty); }
    set strokeDashoffset(value: string) { this.set(ControlStyle.strokeDashoffsetProperty, value); }

    static strokeLinecapProperty = DependencyProperty.registerAttached(ControlStyle, "strokeLinecap", new PropertyMetadata(null));
    get strokeLinecap(): string { return this.get(ControlStyle.strokeLinecapProperty); }
    set strokeLinecap(value: string) { this.set(ControlStyle.strokeLinecapProperty, value); }

    static strokeLinejoinProperty = DependencyProperty.registerAttached(ControlStyle, "strokeLinejoin", new PropertyMetadata(null));
    get strokeLinejoin(): string { return this.get(ControlStyle.strokeLinejoinProperty); }
    set strokeLinejoin(value: string) { this.set(ControlStyle.strokeLinejoinProperty, value); }

    static strokeMiterlimitProperty = DependencyProperty.registerAttached(ControlStyle, "strokeMiterlimit", new PropertyMetadata(null));
    get strokeMiterlimit(): string { return this.get(ControlStyle.strokeMiterlimitProperty); }
    set strokeMiterlimit(value: string) { this.set(ControlStyle.strokeMiterlimitProperty, value); }

    static strokeOpacityProperty = DependencyProperty.registerAttached(ControlStyle, "strokeOpacity", new PropertyMetadata(null));
    get strokeOpacity(): string { return this.get(ControlStyle.strokeOpacityProperty); }
    set strokeOpacity(value: string) { this.set(ControlStyle.strokeOpacityProperty, value); }

    static strokeWidthProperty = DependencyProperty.registerAttached(ControlStyle, "strokeWidth", new PropertyMetadata(null));
    get strokeWidth(): string { return this.get(ControlStyle.strokeWidthProperty); }
    set strokeWidth(value: string) { this.set(ControlStyle.strokeWidthProperty, value); }

    static tabSizeProperty = DependencyProperty.registerAttached(ControlStyle, "tabSize", new PropertyMetadata(null));
    get tabSize(): string { return this.get(ControlStyle.tabSizeProperty); }
    set tabSize(value: string) { this.set(ControlStyle.tabSizeProperty, value); }

    static tableLayoutProperty = DependencyProperty.registerAttached(ControlStyle, "tableLayout", new PropertyMetadata(null));
    get tableLayout(): string { return this.get(ControlStyle.tableLayoutProperty); }
    set tableLayout(value: string) { this.set(ControlStyle.tableLayoutProperty, value); }

    static textAlignProperty = DependencyProperty.registerAttached(ControlStyle, "textAlign", new PropertyMetadata(null));
    get textAlign(): string { return this.get(ControlStyle.textAlignProperty); }
    set textAlign(value: string) { this.set(ControlStyle.textAlignProperty, value); }

    static textAlignLastProperty = DependencyProperty.registerAttached(ControlStyle, "textAlignLast", new PropertyMetadata(null));
    get textAlignLast(): string { return this.get(ControlStyle.textAlignLastProperty); }
    set textAlignLast(value: string) { this.set(ControlStyle.textAlignLastProperty, value); }

    static textAnchorProperty = DependencyProperty.registerAttached(ControlStyle, "textAnchor", new PropertyMetadata(null));
    get textAnchor(): string { return this.get(ControlStyle.textAnchorProperty); }
    set textAnchor(value: string) { this.set(ControlStyle.textAnchorProperty, value); }

    static textCombineUprightProperty = DependencyProperty.registerAttached(ControlStyle, "textCombineUpright", new PropertyMetadata(null));
    get textCombineUpright(): string { return this.get(ControlStyle.textCombineUprightProperty); }
    set textCombineUpright(value: string) { this.set(ControlStyle.textCombineUprightProperty, value); }

    static textDecorationProperty = DependencyProperty.registerAttached(ControlStyle, "textDecoration", new PropertyMetadata(null));
    get textDecoration(): string { return this.get(ControlStyle.textDecorationProperty); }
    set textDecoration(value: string) { this.set(ControlStyle.textDecorationProperty, value); }

    static textDecorationColorProperty = DependencyProperty.registerAttached(ControlStyle, "textDecorationColor", new PropertyMetadata(null));
    get textDecorationColor(): string { return this.get(ControlStyle.textDecorationColorProperty); }
    set textDecorationColor(value: string) { this.set(ControlStyle.textDecorationColorProperty, value); }

    static textDecorationLineProperty = DependencyProperty.registerAttached(ControlStyle, "textDecorationLine", new PropertyMetadata(null));
    get textDecorationLine(): string { return this.get(ControlStyle.textDecorationLineProperty); }
    set textDecorationLine(value: string) { this.set(ControlStyle.textDecorationLineProperty, value); }

    static textDecorationStyleProperty = DependencyProperty.registerAttached(ControlStyle, "textDecorationStyle", new PropertyMetadata(null));
    get textDecorationStyle(): string { return this.get(ControlStyle.textDecorationStyleProperty); }
    set textDecorationStyle(value: string) { this.set(ControlStyle.textDecorationStyleProperty, value); }

    static textEmphasisProperty = DependencyProperty.registerAttached(ControlStyle, "textEmphasis", new PropertyMetadata(null));
    get textEmphasis(): string { return this.get(ControlStyle.textEmphasisProperty); }
    set textEmphasis(value: string) { this.set(ControlStyle.textEmphasisProperty, value); }

    static textEmphasisColorProperty = DependencyProperty.registerAttached(ControlStyle, "textEmphasisColor", new PropertyMetadata(null));
    get textEmphasisColor(): string { return this.get(ControlStyle.textEmphasisColorProperty); }
    set textEmphasisColor(value: string) { this.set(ControlStyle.textEmphasisColorProperty, value); }

    static textEmphasisPositionProperty = DependencyProperty.registerAttached(ControlStyle, "textEmphasisPosition", new PropertyMetadata(null));
    get textEmphasisPosition(): string { return this.get(ControlStyle.textEmphasisPositionProperty); }
    set textEmphasisPosition(value: string) { this.set(ControlStyle.textEmphasisPositionProperty, value); }

    static textEmphasisStyleProperty = DependencyProperty.registerAttached(ControlStyle, "textEmphasisStyle", new PropertyMetadata(null));
    get textEmphasisStyle(): string { return this.get(ControlStyle.textEmphasisStyleProperty); }
    set textEmphasisStyle(value: string) { this.set(ControlStyle.textEmphasisStyleProperty, value); }

    static textIndentProperty = DependencyProperty.registerAttached(ControlStyle, "textIndent", new PropertyMetadata(null));
    get textIndent(): string { return this.get(ControlStyle.textIndentProperty); }
    set textIndent(value: string) { this.set(ControlStyle.textIndentProperty, value); }

    static textJustifyProperty = DependencyProperty.registerAttached(ControlStyle, "textJustify", new PropertyMetadata(null));
    get textJustify(): string { return this.get(ControlStyle.textJustifyProperty); }
    set textJustify(value: string) { this.set(ControlStyle.textJustifyProperty, value); }

    static textKashidaProperty = DependencyProperty.registerAttached(ControlStyle, "textKashida", new PropertyMetadata(null));
    get textKashida(): string | null { return this.get(ControlStyle.textKashidaProperty); }
    set textKashida(value: string | null) { this.set(ControlStyle.textKashidaProperty, value); }

    static textKashidaSpaceProperty = DependencyProperty.registerAttached(ControlStyle, "textKashidaSpace", new PropertyMetadata(null));
    get textKashidaSpace(): string | null { return this.get(ControlStyle.textKashidaSpaceProperty); }
    set textKashidaSpace(value: string | null) { this.set(ControlStyle.textKashidaSpaceProperty, value); }

    static textOrientationProperty = DependencyProperty.registerAttached(ControlStyle, "textOrientation", new PropertyMetadata(null));
    get textOrientation(): string { return this.get(ControlStyle.textOrientationProperty); }
    set textOrientation(value: string) { this.set(ControlStyle.textOrientationProperty, value); }

    static textOverflowProperty = DependencyProperty.registerAttached(ControlStyle, "textOverflow", new PropertyMetadata(null));
    get textOverflow(): string { return this.get(ControlStyle.textOverflowProperty); }
    set textOverflow(value: string) { this.set(ControlStyle.textOverflowProperty, value); }

    static textRenderingProperty = DependencyProperty.registerAttached(ControlStyle, "textRendering", new PropertyMetadata(null));
    get textRendering(): string { return this.get(ControlStyle.textRenderingProperty); }
    set textRendering(value: string) { this.set(ControlStyle.textRenderingProperty, value); }

    static textShadowProperty = DependencyProperty.registerAttached(ControlStyle, "textShadow", new PropertyMetadata(null));
    get textShadow(): string { return this.get(ControlStyle.textShadowProperty); }
    set textShadow(value: string) { this.set(ControlStyle.textShadowProperty, value); }

    static textTransformProperty = DependencyProperty.registerAttached(ControlStyle, "textTransform", new PropertyMetadata(null));
    get textTransform(): string { return this.get(ControlStyle.textTransformProperty); }
    set textTransform(value: string) { this.set(ControlStyle.textTransformProperty, value); }

    static textUnderlinePositionProperty = DependencyProperty.registerAttached(ControlStyle, "textUnderlinePosition", new PropertyMetadata(null));
    get textUnderlinePosition(): string { return this.get(ControlStyle.textUnderlinePositionProperty); }
    set textUnderlinePosition(value: string) { this.set(ControlStyle.textUnderlinePositionProperty, value); }

    static topProperty = DependencyProperty.registerAttached(ControlStyle, "top", new PropertyMetadata(null));
    get top(): string { return this.get(ControlStyle.topProperty); }
    set top(value: string) { this.set(ControlStyle.topProperty, value); }

    static touchActionProperty = DependencyProperty.registerAttached(ControlStyle, "touchAction", new PropertyMetadata(null));
    get touchAction(): string { return this.get(ControlStyle.touchActionProperty); }
    set touchAction(value: string) { this.set(ControlStyle.touchActionProperty, value); }

    static transformProperty = DependencyProperty.registerAttached(ControlStyle, "transform", new PropertyMetadata(null));
    get transform(): string { return this.get(ControlStyle.transformProperty); }
    set transform(value: string) { this.set(ControlStyle.transformProperty, value); }

    static transformBoxProperty = DependencyProperty.registerAttached(ControlStyle, "transformBox", new PropertyMetadata(null));
    get transformBox(): string { return this.get(ControlStyle.transformBoxProperty); }
    set transformBox(value: string) { this.set(ControlStyle.transformBoxProperty, value); }

    static transformOriginProperty = DependencyProperty.registerAttached(ControlStyle, "transformOrigin", new PropertyMetadata(null));
    get transformOrigin(): string { return this.get(ControlStyle.transformOriginProperty); }
    set transformOrigin(value: string) { this.set(ControlStyle.transformOriginProperty, value); }

    static transformStyleProperty = DependencyProperty.registerAttached(ControlStyle, "transformStyle", new PropertyMetadata(null));
    get transformStyle(): string { return this.get(ControlStyle.transformStyleProperty); }
    set transformStyle(value: string) { this.set(ControlStyle.transformStyleProperty, value); }

    static transitionProperty = DependencyProperty.registerAttached(ControlStyle, "transition", new PropertyMetadata(null));
    get transition(): string { return this.get(ControlStyle.transitionProperty); }
    set transition(value: string) { this.set(ControlStyle.transitionProperty, value); }

    static transitionDelayProperty = DependencyProperty.registerAttached(ControlStyle, "transitionDelay", new PropertyMetadata(null));
    get transitionDelay(): string { return this.get(ControlStyle.transitionDelayProperty); }
    set transitionDelay(value: string) { this.set(ControlStyle.transitionDelayProperty, value); }

    static transitionDurationProperty = DependencyProperty.registerAttached(ControlStyle, "transitionDuration", new PropertyMetadata(null));
    get transitionDuration(): string { return this.get(ControlStyle.transitionDurationProperty); }
    set transitionDuration(value: string) { this.set(ControlStyle.transitionDurationProperty, value); }

    static transitionPropertyProperty = DependencyProperty.registerAttached(ControlStyle, "transitionProperty", new PropertyMetadata(null));
    get transitionProperty(): string { return this.get(ControlStyle.transitionPropertyProperty); }
    set transitionProperty(value: string) { this.set(ControlStyle.transitionPropertyProperty, value); }

    static transitionTimingFunctionProperty = DependencyProperty.registerAttached(ControlStyle, "transitionTimingFunction", new PropertyMetadata(null));
    get transitionTimingFunction(): string { return this.get(ControlStyle.transitionTimingFunctionProperty); }
    set transitionTimingFunction(value: string) { this.set(ControlStyle.transitionTimingFunctionProperty, value); }

    static translateProperty = DependencyProperty.registerAttached(ControlStyle, "translate", new PropertyMetadata(null));
    get translate(): string { return this.get(ControlStyle.translateProperty); }
    set translate(value: string) { this.set(ControlStyle.translateProperty, value); }

    static unicodeBidiProperty = DependencyProperty.registerAttached(ControlStyle, "unicodeBidi", new PropertyMetadata(null));
    get unicodeBidi(): string { return this.get(ControlStyle.unicodeBidiProperty); }
    set unicodeBidi(value: string) { this.set(ControlStyle.unicodeBidiProperty, value); }

    static userSelectProperty = DependencyProperty.registerAttached(ControlStyle, "userSelect", new PropertyMetadata(null));
    get userSelect(): string { return this.get(ControlStyle.userSelectProperty); }
    set userSelect(value: string) { this.set(ControlStyle.userSelectProperty, value); }

    static verticalAlignProperty = DependencyProperty.registerAttached(ControlStyle, "verticalAlign", new PropertyMetadata(null));
    get verticalAlign(): string { return this.get(ControlStyle.verticalAlignProperty); }
    set verticalAlign(value: string) { this.set(ControlStyle.verticalAlignProperty, value); }

    static visibilityProperty = DependencyProperty.registerAttached(ControlStyle, "visibility", new PropertyMetadata(null));
    get visibility(): string { return this.get(ControlStyle.visibilityProperty); }
    set visibility(value: string) { this.set(ControlStyle.visibilityProperty, value); }

    static webkitAlignContentProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAlignContent", new PropertyMetadata(null));
    get webkitAlignContent(): string { return this.get(ControlStyle.webkitAlignContentProperty); }
    set webkitAlignContent(value: string) { this.set(ControlStyle.webkitAlignContentProperty, value); }

    static webkitAlignItemsProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAlignItems", new PropertyMetadata(null));
    get webkitAlignItems(): string { return this.get(ControlStyle.webkitAlignItemsProperty); }
    set webkitAlignItems(value: string) { this.set(ControlStyle.webkitAlignItemsProperty, value); }

    static webkitAlignSelfProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAlignSelf", new PropertyMetadata(null));
    get webkitAlignSelf(): string { return this.get(ControlStyle.webkitAlignSelfProperty); }
    set webkitAlignSelf(value: string) { this.set(ControlStyle.webkitAlignSelfProperty, value); }

    static webkitAnimationProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimation", new PropertyMetadata(null));
    get webkitAnimation(): string { return this.get(ControlStyle.webkitAnimationProperty); }
    set webkitAnimation(value: string) { this.set(ControlStyle.webkitAnimationProperty, value); }

    static webkitAnimationDelayProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationDelay", new PropertyMetadata(null));
    get webkitAnimationDelay(): string { return this.get(ControlStyle.webkitAnimationDelayProperty); }
    set webkitAnimationDelay(value: string) { this.set(ControlStyle.webkitAnimationDelayProperty, value); }

    static webkitAnimationDirectionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationDirection", new PropertyMetadata(null));
    get webkitAnimationDirection(): string { return this.get(ControlStyle.webkitAnimationDirectionProperty); }
    set webkitAnimationDirection(value: string) { this.set(ControlStyle.webkitAnimationDirectionProperty, value); }

    static webkitAnimationDurationProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationDuration", new PropertyMetadata(null));
    get webkitAnimationDuration(): string { return this.get(ControlStyle.webkitAnimationDurationProperty); }
    set webkitAnimationDuration(value: string) { this.set(ControlStyle.webkitAnimationDurationProperty, value); }

    static webkitAnimationFillModeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationFillMode", new PropertyMetadata(null));
    get webkitAnimationFillMode(): string { return this.get(ControlStyle.webkitAnimationFillModeProperty); }
    set webkitAnimationFillMode(value: string) { this.set(ControlStyle.webkitAnimationFillModeProperty, value); }

    static webkitAnimationIterationCountProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationIterationCount", new PropertyMetadata(null));
    get webkitAnimationIterationCount(): string { return this.get(ControlStyle.webkitAnimationIterationCountProperty); }
    set webkitAnimationIterationCount(value: string) { this.set(ControlStyle.webkitAnimationIterationCountProperty, value); }

    static webkitAnimationNameProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationName", new PropertyMetadata(null));
    get webkitAnimationName(): string { return this.get(ControlStyle.webkitAnimationNameProperty); }
    set webkitAnimationName(value: string) { this.set(ControlStyle.webkitAnimationNameProperty, value); }

    static webkitAnimationPlayStateProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationPlayState", new PropertyMetadata(null));
    get webkitAnimationPlayState(): string { return this.get(ControlStyle.webkitAnimationPlayStateProperty); }
    set webkitAnimationPlayState(value: string) { this.set(ControlStyle.webkitAnimationPlayStateProperty, value); }

    static webkitAnimationTimingFunctionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAnimationTimingFunction", new PropertyMetadata(null));
    get webkitAnimationTimingFunction(): string { return this.get(ControlStyle.webkitAnimationTimingFunctionProperty); }
    set webkitAnimationTimingFunction(value: string) { this.set(ControlStyle.webkitAnimationTimingFunctionProperty, value); }

    static webkitAppearanceProperty = DependencyProperty.registerAttached(ControlStyle, "webkitAppearance", new PropertyMetadata(null));
    get webkitAppearance(): string { return this.get(ControlStyle.webkitAppearanceProperty); }
    set webkitAppearance(value: string) { this.set(ControlStyle.webkitAppearanceProperty, value); }

    static webkitBackfaceVisibilityProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBackfaceVisibility", new PropertyMetadata(null));
    get webkitBackfaceVisibility(): string { return this.get(ControlStyle.webkitBackfaceVisibilityProperty); }
    set webkitBackfaceVisibility(value: string) { this.set(ControlStyle.webkitBackfaceVisibilityProperty, value); }

    static webkitBackgroundClipProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBackgroundClip", new PropertyMetadata(null));
    get webkitBackgroundClip(): string { return this.get(ControlStyle.webkitBackgroundClipProperty); }
    set webkitBackgroundClip(value: string) { this.set(ControlStyle.webkitBackgroundClipProperty, value); }

    static webkitBackgroundOriginProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBackgroundOrigin", new PropertyMetadata(null));
    get webkitBackgroundOrigin(): string { return this.get(ControlStyle.webkitBackgroundOriginProperty); }
    set webkitBackgroundOrigin(value: string) { this.set(ControlStyle.webkitBackgroundOriginProperty, value); }

    static webkitBackgroundSizeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBackgroundSize", new PropertyMetadata(null));
    get webkitBackgroundSize(): string { return this.get(ControlStyle.webkitBackgroundSizeProperty); }
    set webkitBackgroundSize(value: string) { this.set(ControlStyle.webkitBackgroundSizeProperty, value); }

    static webkitBorderBottomLeftRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderBottomLeftRadius", new PropertyMetadata(null));
    get webkitBorderBottomLeftRadius(): string { return this.get(ControlStyle.webkitBorderBottomLeftRadiusProperty); }
    set webkitBorderBottomLeftRadius(value: string) { this.set(ControlStyle.webkitBorderBottomLeftRadiusProperty, value); }

    static webkitBorderBottomRightRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderBottomRightRadius", new PropertyMetadata(null));
    get webkitBorderBottomRightRadius(): string { return this.get(ControlStyle.webkitBorderBottomRightRadiusProperty); }
    set webkitBorderBottomRightRadius(value: string) { this.set(ControlStyle.webkitBorderBottomRightRadiusProperty, value); }

    static webkitBorderImageProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderImage", new PropertyMetadata(null));
    get webkitBorderImage(): string | null { return this.get(ControlStyle.webkitBorderImageProperty); }
    set webkitBorderImage(value: string | null) { this.set(ControlStyle.webkitBorderImageProperty, value); }

    static webkitBorderRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderRadius", new PropertyMetadata(null));
    get webkitBorderRadius(): string { return this.get(ControlStyle.webkitBorderRadiusProperty); }
    set webkitBorderRadius(value: string) { this.set(ControlStyle.webkitBorderRadiusProperty, value); }

    static webkitBorderTopLeftRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderTopLeftRadius", new PropertyMetadata(null));
    get webkitBorderTopLeftRadius(): string { return this.get(ControlStyle.webkitBorderTopLeftRadiusProperty); }
    set webkitBorderTopLeftRadius(value: string) { this.set(ControlStyle.webkitBorderTopLeftRadiusProperty, value); }

    static webkitBorderTopRightRadiusProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBorderTopRightRadius", new PropertyMetadata(null));
    get webkitBorderTopRightRadius(): string { return this.get(ControlStyle.webkitBorderTopRightRadiusProperty); }
    set webkitBorderTopRightRadius(value: string) { this.set(ControlStyle.webkitBorderTopRightRadiusProperty, value); }

    static webkitBoxAlignProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxAlign", new PropertyMetadata(null));
    get webkitBoxAlign(): string { return this.get(ControlStyle.webkitBoxAlignProperty); }
    set webkitBoxAlign(value: string) { this.set(ControlStyle.webkitBoxAlignProperty, value); }

    static webkitBoxDirectionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxDirection", new PropertyMetadata(null));
    get webkitBoxDirection(): string | null { return this.get(ControlStyle.webkitBoxDirectionProperty); }
    set webkitBoxDirection(value: string | null) { this.set(ControlStyle.webkitBoxDirectionProperty, value); }

    static webkitBoxFlexProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxFlex", new PropertyMetadata(null));
    get webkitBoxFlex(): string { return this.get(ControlStyle.webkitBoxFlexProperty); }
    set webkitBoxFlex(value: string) { this.set(ControlStyle.webkitBoxFlexProperty, value); }

    static webkitBoxOrdinalGroupProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxOrdinalGroup", new PropertyMetadata(null));
    get webkitBoxOrdinalGroup(): string { return this.get(ControlStyle.webkitBoxOrdinalGroupProperty); }
    set webkitBoxOrdinalGroup(value: string) { this.set(ControlStyle.webkitBoxOrdinalGroupProperty, value); }

    static webkitBoxOrientProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxOrient", new PropertyMetadata(null));
    get webkitBoxOrient(): string { return this.get(ControlStyle.webkitBoxOrientProperty); }
    set webkitBoxOrient(value: string) { this.set(ControlStyle.webkitBoxOrientProperty, value); }

    static webkitBoxPackProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxPack", new PropertyMetadata(null));
    get webkitBoxPack(): string { return this.get(ControlStyle.webkitBoxPackProperty); }
    set webkitBoxPack(value: string) { this.set(ControlStyle.webkitBoxPackProperty, value); }

    static webkitBoxShadowProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxShadow", new PropertyMetadata(null));
    get webkitBoxShadow(): string { return this.get(ControlStyle.webkitBoxShadowProperty); }
    set webkitBoxShadow(value: string) { this.set(ControlStyle.webkitBoxShadowProperty, value); }

    static webkitBoxSizingProperty = DependencyProperty.registerAttached(ControlStyle, "webkitBoxSizing", new PropertyMetadata(null));
    get webkitBoxSizing(): string { return this.get(ControlStyle.webkitBoxSizingProperty); }
    set webkitBoxSizing(value: string) { this.set(ControlStyle.webkitBoxSizingProperty, value); }

    static webkitColumnBreakAfterProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnBreakAfter", new PropertyMetadata(null));
    get webkitColumnBreakAfter(): string | null { return this.get(ControlStyle.webkitColumnBreakAfterProperty); }
    set webkitColumnBreakAfter(value: string | null) { this.set(ControlStyle.webkitColumnBreakAfterProperty, value); }

    static webkitColumnBreakBeforeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnBreakBefore", new PropertyMetadata(null));
    get webkitColumnBreakBefore(): string | null { return this.get(ControlStyle.webkitColumnBreakBeforeProperty); }
    set webkitColumnBreakBefore(value: string | null) { this.set(ControlStyle.webkitColumnBreakBeforeProperty, value); }

    static webkitColumnBreakInsideProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnBreakInside", new PropertyMetadata(null));
    get webkitColumnBreakInside(): string | null { return this.get(ControlStyle.webkitColumnBreakInsideProperty); }
    set webkitColumnBreakInside(value: string | null) { this.set(ControlStyle.webkitColumnBreakInsideProperty, value); }

    static webkitColumnCountProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnCount", new PropertyMetadata(null));
    get webkitColumnCount(): any { return this.get(ControlStyle.webkitColumnCountProperty); }
    set webkitColumnCount(value: any) { this.set(ControlStyle.webkitColumnCountProperty, value); }

    static webkitColumnGapProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnGap", new PropertyMetadata(null));
    get webkitColumnGap(): any { return this.get(ControlStyle.webkitColumnGapProperty); }
    set webkitColumnGap(value: any) { this.set(ControlStyle.webkitColumnGapProperty, value); }

    static webkitColumnRuleProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnRule", new PropertyMetadata(null));
    get webkitColumnRule(): string | null { return this.get(ControlStyle.webkitColumnRuleProperty); }
    set webkitColumnRule(value: string | null) { this.set(ControlStyle.webkitColumnRuleProperty, value); }

    static webkitColumnRuleColorProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnRuleColor", new PropertyMetadata(null));
    get webkitColumnRuleColor(): any { return this.get(ControlStyle.webkitColumnRuleColorProperty); }
    set webkitColumnRuleColor(value: any) { this.set(ControlStyle.webkitColumnRuleColorProperty, value); }

    static webkitColumnRuleStyleProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnRuleStyle", new PropertyMetadata(null));
    get webkitColumnRuleStyle(): string | null { return this.get(ControlStyle.webkitColumnRuleStyleProperty); }
    set webkitColumnRuleStyle(value: string | null) { this.set(ControlStyle.webkitColumnRuleStyleProperty, value); }

    static webkitColumnRuleWidthProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnRuleWidth", new PropertyMetadata(null));
    get webkitColumnRuleWidth(): any { return this.get(ControlStyle.webkitColumnRuleWidthProperty); }
    set webkitColumnRuleWidth(value: any) { this.set(ControlStyle.webkitColumnRuleWidthProperty, value); }

    static webkitColumnSpanProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnSpan", new PropertyMetadata(null));
    get webkitColumnSpan(): string | null { return this.get(ControlStyle.webkitColumnSpanProperty); }
    set webkitColumnSpan(value: string | null) { this.set(ControlStyle.webkitColumnSpanProperty, value); }

    static webkitColumnWidthProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumnWidth", new PropertyMetadata(null));
    get webkitColumnWidth(): any { return this.get(ControlStyle.webkitColumnWidthProperty); }
    set webkitColumnWidth(value: any) { this.set(ControlStyle.webkitColumnWidthProperty, value); }

    static webkitColumnsProperty = DependencyProperty.registerAttached(ControlStyle, "webkitColumns", new PropertyMetadata(null));
    get webkitColumns(): string | null { return this.get(ControlStyle.webkitColumnsProperty); }
    set webkitColumns(value: string | null) { this.set(ControlStyle.webkitColumnsProperty, value); }

    static webkitFilterProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFilter", new PropertyMetadata(null));
    get webkitFilter(): string { return this.get(ControlStyle.webkitFilterProperty); }
    set webkitFilter(value: string) { this.set(ControlStyle.webkitFilterProperty, value); }

    static webkitFlexProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlex", new PropertyMetadata(null));
    get webkitFlex(): string { return this.get(ControlStyle.webkitFlexProperty); }
    set webkitFlex(value: string) { this.set(ControlStyle.webkitFlexProperty, value); }

    static webkitFlexBasisProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexBasis", new PropertyMetadata(null));
    get webkitFlexBasis(): string { return this.get(ControlStyle.webkitFlexBasisProperty); }
    set webkitFlexBasis(value: string) { this.set(ControlStyle.webkitFlexBasisProperty, value); }

    static webkitFlexDirectionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexDirection", new PropertyMetadata(null));
    get webkitFlexDirection(): string { return this.get(ControlStyle.webkitFlexDirectionProperty); }
    set webkitFlexDirection(value: string) { this.set(ControlStyle.webkitFlexDirectionProperty, value); }

    static webkitFlexFlowProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexFlow", new PropertyMetadata(null));
    get webkitFlexFlow(): string { return this.get(ControlStyle.webkitFlexFlowProperty); }
    set webkitFlexFlow(value: string) { this.set(ControlStyle.webkitFlexFlowProperty, value); }

    static webkitFlexGrowProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexGrow", new PropertyMetadata(null));
    get webkitFlexGrow(): string { return this.get(ControlStyle.webkitFlexGrowProperty); }
    set webkitFlexGrow(value: string) { this.set(ControlStyle.webkitFlexGrowProperty, value); }

    static webkitFlexShrinkProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexShrink", new PropertyMetadata(null));
    get webkitFlexShrink(): string { return this.get(ControlStyle.webkitFlexShrinkProperty); }
    set webkitFlexShrink(value: string) { this.set(ControlStyle.webkitFlexShrinkProperty, value); }

    static webkitFlexWrapProperty = DependencyProperty.registerAttached(ControlStyle, "webkitFlexWrap", new PropertyMetadata(null));
    get webkitFlexWrap(): string { return this.get(ControlStyle.webkitFlexWrapProperty); }
    set webkitFlexWrap(value: string) { this.set(ControlStyle.webkitFlexWrapProperty, value); }

    static webkitJustifyContentProperty = DependencyProperty.registerAttached(ControlStyle, "webkitJustifyContent", new PropertyMetadata(null));
    get webkitJustifyContent(): string { return this.get(ControlStyle.webkitJustifyContentProperty); }
    set webkitJustifyContent(value: string) { this.set(ControlStyle.webkitJustifyContentProperty, value); }

    static webkitLineClampProperty = DependencyProperty.registerAttached(ControlStyle, "webkitLineClamp", new PropertyMetadata(null));
    get webkitLineClamp(): string { return this.get(ControlStyle.webkitLineClampProperty); }
    set webkitLineClamp(value: string) { this.set(ControlStyle.webkitLineClampProperty, value); }

    static webkitMaskProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMask", new PropertyMetadata(null));
    get webkitMask(): string { return this.get(ControlStyle.webkitMaskProperty); }
    set webkitMask(value: string) { this.set(ControlStyle.webkitMaskProperty, value); }

    static webkitMaskBoxImageProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImage", new PropertyMetadata(null));
    get webkitMaskBoxImage(): string { return this.get(ControlStyle.webkitMaskBoxImageProperty); }
    set webkitMaskBoxImage(value: string) { this.set(ControlStyle.webkitMaskBoxImageProperty, value); }

    static webkitMaskBoxImageOutsetProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImageOutset", new PropertyMetadata(null));
    get webkitMaskBoxImageOutset(): string { return this.get(ControlStyle.webkitMaskBoxImageOutsetProperty); }
    set webkitMaskBoxImageOutset(value: string) { this.set(ControlStyle.webkitMaskBoxImageOutsetProperty, value); }

    static webkitMaskBoxImageRepeatProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImageRepeat", new PropertyMetadata(null));
    get webkitMaskBoxImageRepeat(): string { return this.get(ControlStyle.webkitMaskBoxImageRepeatProperty); }
    set webkitMaskBoxImageRepeat(value: string) { this.set(ControlStyle.webkitMaskBoxImageRepeatProperty, value); }

    static webkitMaskBoxImageSliceProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImageSlice", new PropertyMetadata(null));
    get webkitMaskBoxImageSlice(): string { return this.get(ControlStyle.webkitMaskBoxImageSliceProperty); }
    set webkitMaskBoxImageSlice(value: string) { this.set(ControlStyle.webkitMaskBoxImageSliceProperty, value); }

    static webkitMaskBoxImageSourceProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImageSource", new PropertyMetadata(null));
    get webkitMaskBoxImageSource(): string { return this.get(ControlStyle.webkitMaskBoxImageSourceProperty); }
    set webkitMaskBoxImageSource(value: string) { this.set(ControlStyle.webkitMaskBoxImageSourceProperty, value); }

    static webkitMaskBoxImageWidthProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskBoxImageWidth", new PropertyMetadata(null));
    get webkitMaskBoxImageWidth(): string { return this.get(ControlStyle.webkitMaskBoxImageWidthProperty); }
    set webkitMaskBoxImageWidth(value: string) { this.set(ControlStyle.webkitMaskBoxImageWidthProperty, value); }

    static webkitMaskClipProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskClip", new PropertyMetadata(null));
    get webkitMaskClip(): string { return this.get(ControlStyle.webkitMaskClipProperty); }
    set webkitMaskClip(value: string) { this.set(ControlStyle.webkitMaskClipProperty, value); }

    static webkitMaskCompositeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskComposite", new PropertyMetadata(null));
    get webkitMaskComposite(): string { return this.get(ControlStyle.webkitMaskCompositeProperty); }
    set webkitMaskComposite(value: string) { this.set(ControlStyle.webkitMaskCompositeProperty, value); }

    static webkitMaskImageProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskImage", new PropertyMetadata(null));
    get webkitMaskImage(): string { return this.get(ControlStyle.webkitMaskImageProperty); }
    set webkitMaskImage(value: string) { this.set(ControlStyle.webkitMaskImageProperty, value); }

    static webkitMaskOriginProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskOrigin", new PropertyMetadata(null));
    get webkitMaskOrigin(): string { return this.get(ControlStyle.webkitMaskOriginProperty); }
    set webkitMaskOrigin(value: string) { this.set(ControlStyle.webkitMaskOriginProperty, value); }

    static webkitMaskPositionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskPosition", new PropertyMetadata(null));
    get webkitMaskPosition(): string { return this.get(ControlStyle.webkitMaskPositionProperty); }
    set webkitMaskPosition(value: string) { this.set(ControlStyle.webkitMaskPositionProperty, value); }

    static webkitMaskRepeatProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskRepeat", new PropertyMetadata(null));
    get webkitMaskRepeat(): string { return this.get(ControlStyle.webkitMaskRepeatProperty); }
    set webkitMaskRepeat(value: string) { this.set(ControlStyle.webkitMaskRepeatProperty, value); }

    static webkitMaskSizeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitMaskSize", new PropertyMetadata(null));
    get webkitMaskSize(): string { return this.get(ControlStyle.webkitMaskSizeProperty); }
    set webkitMaskSize(value: string) { this.set(ControlStyle.webkitMaskSizeProperty, value); }

    static webkitOrderProperty = DependencyProperty.registerAttached(ControlStyle, "webkitOrder", new PropertyMetadata(null));
    get webkitOrder(): string { return this.get(ControlStyle.webkitOrderProperty); }
    set webkitOrder(value: string) { this.set(ControlStyle.webkitOrderProperty, value); }

    static webkitPerspectiveProperty = DependencyProperty.registerAttached(ControlStyle, "webkitPerspective", new PropertyMetadata(null));
    get webkitPerspective(): string { return this.get(ControlStyle.webkitPerspectiveProperty); }
    set webkitPerspective(value: string) { this.set(ControlStyle.webkitPerspectiveProperty, value); }

    static webkitPerspectiveOriginProperty = DependencyProperty.registerAttached(ControlStyle, "webkitPerspectiveOrigin", new PropertyMetadata(null));
    get webkitPerspectiveOrigin(): string { return this.get(ControlStyle.webkitPerspectiveOriginProperty); }
    set webkitPerspectiveOrigin(value: string) { this.set(ControlStyle.webkitPerspectiveOriginProperty, value); }

    static webkitTapHighlightColorProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTapHighlightColor", new PropertyMetadata(null));
    get webkitTapHighlightColor(): string | null { return this.get(ControlStyle.webkitTapHighlightColorProperty); }
    set webkitTapHighlightColor(value: string | null) { this.set(ControlStyle.webkitTapHighlightColorProperty, value); }

    static webkitTextFillColorProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTextFillColor", new PropertyMetadata(null));
    get webkitTextFillColor(): string { return this.get(ControlStyle.webkitTextFillColorProperty); }
    set webkitTextFillColor(value: string) { this.set(ControlStyle.webkitTextFillColorProperty, value); }

    static webkitTextSizeAdjustProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTextSizeAdjust", new PropertyMetadata(null));
    get webkitTextSizeAdjust(): string { return this.get(ControlStyle.webkitTextSizeAdjustProperty); }
    set webkitTextSizeAdjust(value: string) { this.set(ControlStyle.webkitTextSizeAdjustProperty, value); }

    static webkitTextStrokeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTextStroke", new PropertyMetadata(null));
    get webkitTextStroke(): string { return this.get(ControlStyle.webkitTextStrokeProperty); }
    set webkitTextStroke(value: string) { this.set(ControlStyle.webkitTextStrokeProperty, value); }

    static webkitTextStrokeColorProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTextStrokeColor", new PropertyMetadata(null));
    get webkitTextStrokeColor(): string { return this.get(ControlStyle.webkitTextStrokeColorProperty); }
    set webkitTextStrokeColor(value: string) { this.set(ControlStyle.webkitTextStrokeColorProperty, value); }

    static webkitTextStrokeWidthProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTextStrokeWidth", new PropertyMetadata(null));
    get webkitTextStrokeWidth(): string { return this.get(ControlStyle.webkitTextStrokeWidthProperty); }
    set webkitTextStrokeWidth(value: string) { this.set(ControlStyle.webkitTextStrokeWidthProperty, value); }

    static webkitTransformProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransform", new PropertyMetadata(null));
    get webkitTransform(): string { return this.get(ControlStyle.webkitTransformProperty); }
    set webkitTransform(value: string) { this.set(ControlStyle.webkitTransformProperty, value); }

    static webkitTransformOriginProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransformOrigin", new PropertyMetadata(null));
    get webkitTransformOrigin(): string { return this.get(ControlStyle.webkitTransformOriginProperty); }
    set webkitTransformOrigin(value: string) { this.set(ControlStyle.webkitTransformOriginProperty, value); }

    static webkitTransformStyleProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransformStyle", new PropertyMetadata(null));
    get webkitTransformStyle(): string { return this.get(ControlStyle.webkitTransformStyleProperty); }
    set webkitTransformStyle(value: string) { this.set(ControlStyle.webkitTransformStyleProperty, value); }

    static webkitTransitionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransition", new PropertyMetadata(null));
    get webkitTransition(): string { return this.get(ControlStyle.webkitTransitionProperty); }
    set webkitTransition(value: string) { this.set(ControlStyle.webkitTransitionProperty, value); }

    static webkitTransitionDelayProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransitionDelay", new PropertyMetadata(null));
    get webkitTransitionDelay(): string { return this.get(ControlStyle.webkitTransitionDelayProperty); }
    set webkitTransitionDelay(value: string) { this.set(ControlStyle.webkitTransitionDelayProperty, value); }

    static webkitTransitionDurationProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransitionDuration", new PropertyMetadata(null));
    get webkitTransitionDuration(): string { return this.get(ControlStyle.webkitTransitionDurationProperty); }
    set webkitTransitionDuration(value: string) { this.set(ControlStyle.webkitTransitionDurationProperty, value); }

    static webkitTransitionPropertyProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransitionProperty", new PropertyMetadata(null));
    get webkitTransitionProperty(): string { return this.get(ControlStyle.webkitTransitionPropertyProperty); }
    set webkitTransitionProperty(value: string) { this.set(ControlStyle.webkitTransitionPropertyProperty, value); }

    static webkitTransitionTimingFunctionProperty = DependencyProperty.registerAttached(ControlStyle, "webkitTransitionTimingFunction", new PropertyMetadata(null));
    get webkitTransitionTimingFunction(): string { return this.get(ControlStyle.webkitTransitionTimingFunctionProperty); }
    set webkitTransitionTimingFunction(value: string) { this.set(ControlStyle.webkitTransitionTimingFunctionProperty, value); }

    static webkitUserModifyProperty = DependencyProperty.registerAttached(ControlStyle, "webkitUserModify", new PropertyMetadata(null));
    get webkitUserModify(): string | null { return this.get(ControlStyle.webkitUserModifyProperty); }
    set webkitUserModify(value: string | null) { this.set(ControlStyle.webkitUserModifyProperty, value); }

    static webkitUserSelectProperty = DependencyProperty.registerAttached(ControlStyle, "webkitUserSelect", new PropertyMetadata(null));
    get webkitUserSelect(): string | null { return this.get(ControlStyle.webkitUserSelectProperty); }
    set webkitUserSelect(value: string | null) { this.set(ControlStyle.webkitUserSelectProperty, value); }

    static webkitWritingModeProperty = DependencyProperty.registerAttached(ControlStyle, "webkitWritingMode", new PropertyMetadata(null));
    get webkitWritingMode(): string | null { return this.get(ControlStyle.webkitWritingModeProperty); }
    set webkitWritingMode(value: string | null) { this.set(ControlStyle.webkitWritingModeProperty, value); }

    static whiteSpaceProperty = DependencyProperty.registerAttached(ControlStyle, "whiteSpace", new PropertyMetadata(null));
    get whiteSpace(): string { return this.get(ControlStyle.whiteSpaceProperty); }
    set whiteSpace(value: string) { this.set(ControlStyle.whiteSpaceProperty, value); }

    static widowsProperty = DependencyProperty.registerAttached(ControlStyle, "widows", new PropertyMetadata(null));
    get widows(): string { return this.get(ControlStyle.widowsProperty); }
    set widows(value: string) { this.set(ControlStyle.widowsProperty, value); }

    static widthProperty = DependencyProperty.registerAttached(ControlStyle, "width", new PropertyMetadata(null));
    get width(): string { return this.get(ControlStyle.widthProperty); }
    set width(value: string) { this.set(ControlStyle.widthProperty, value); }

    static willChangeProperty = DependencyProperty.registerAttached(ControlStyle, "willChange", new PropertyMetadata(null));
    get willChange(): string { return this.get(ControlStyle.willChangeProperty); }
    set willChange(value: string) { this.set(ControlStyle.willChangeProperty, value); }

    static wordBreakProperty = DependencyProperty.registerAttached(ControlStyle, "wordBreak", new PropertyMetadata(null));
    get wordBreak(): string { return this.get(ControlStyle.wordBreakProperty); }
    set wordBreak(value: string) { this.set(ControlStyle.wordBreakProperty, value); }

    static wordSpacingProperty = DependencyProperty.registerAttached(ControlStyle, "wordSpacing", new PropertyMetadata(null));
    get wordSpacing(): string { return this.get(ControlStyle.wordSpacingProperty); }
    set wordSpacing(value: string) { this.set(ControlStyle.wordSpacingProperty, value); }

    static wordWrapProperty = DependencyProperty.registerAttached(ControlStyle, "wordWrap", new PropertyMetadata(null));
    get wordWrap(): string { return this.get(ControlStyle.wordWrapProperty); }
    set wordWrap(value: string) { this.set(ControlStyle.wordWrapProperty, value); }

    static writingModeProperty = DependencyProperty.registerAttached(ControlStyle, "writingMode", new PropertyMetadata(null));
    get writingMode(): string { return this.get(ControlStyle.writingModeProperty); }
    set writingMode(value: string) { this.set(ControlStyle.writingModeProperty, value); }

    static zIndexProperty = DependencyProperty.registerAttached(ControlStyle, "zIndex", new PropertyMetadata(null));
    get zIndex(): string { return this.get(ControlStyle.zIndexProperty); }
    set zIndex(value: string) { this.set(ControlStyle.zIndexProperty, value); }

    static zoomProperty = DependencyProperty.registerAttached(ControlStyle, "zoom", new PropertyMetadata(null));
    get zoom(): string | null { return this.get(ControlStyle.zoomProperty); }
    set zoom(value: string | null) { this.set(ControlStyle.zoomProperty, value); }

    private __targetControl: Control | null;

    protected destructor() {
        this.__styleDeclaration = null;
        this.__styleElement?.remove();
        this.__targetControl = null;
    }
}
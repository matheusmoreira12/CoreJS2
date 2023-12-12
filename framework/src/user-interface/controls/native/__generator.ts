import { Control } from "../index.js";
import { DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { NativeControlBase } from "./native-control-base.js";
import { NativeEvent } from "../../../standard/events/index.js";
import { ArrayUtils, ObjectUtils } from "../../../core-base/utils/index.js";
import { ControlConstructor } from "../control-constructor";
import { NativeControl } from "./native-control";
import { InvalidOperationException } from "../../../standard/exceptions/framework-exception.js";
import { Type } from "../../../standard/reflection/index.js";
import { AnyConstraint } from "../../../standard/reflection/type-constraints/index.js";
import { getEventName, isEventName } from "./event-name.js";
import { isExcludedProperty } from "./excluded-property.js";
import { getSubstitutedPropertyNameOrNull } from "./substituted-property.js";
import { DataMap } from "./data-map.js";

export namespace __Generator {
    export function generateNativeControls(elemDataMap: DataMap): { readonly [K: string]: NativeControl<any> } {
        const result = {};
        for (let elementName of Object.getOwnPropertyNames(elemDataMap)) {
            const { namespaceUri, ctorName } = elemDataMap[elementName];
            const elemCtor = globalThis[ctorName as keyof typeof globalThis] as typeof Element;
            if (elemCtor === undefined) {
                defineUnsuportedNativeControl(elementName);
                continue;
            }
            defineNativeControl(elementName, namespaceUri, elemCtor);
        }
        return result;

        function defineUnsuportedNativeControl(elementName: string) {
            Object.defineProperty(result, elementName, {
                get() { throw new InvalidOperationException("Element not supported."); }
            });
        }

        function defineNativeControl(elementName: string, namespaceUri: string, elemCtor: typeof Element) {
            let NativeControl: ControlConstructor | undefined;
            Object.defineProperty(result, elementName, {
                get() { return NativeControl ?? (NativeControl = createNativeControl()); }
            });

            function createNativeControl() {
                const NativeControl = nativeControlFactory(elementName, elemCtor) as unknown as ControlConstructor;
                Control.register(NativeControl, elementName, namespaceUri);
                return NativeControl;
            }
        }
    }

    function nativeControlFactory(tagName: string, elemCtor: typeof Element): NativeControlBase {
        const elemProto = elemCtor.prototype;
        const nativeControlClassName = `${tagName}_NativeControl`;

        let bodyStr = `return class ${nativeControlClassName} extends NativeControlBase {`;

        for (let [prop, subProp] of getOriginalAndSubstitutedPropertyNames(elemProto)) {
            const newProp = subProp ?? prop;
            const dependencyProp = `${newProp}Property`;

            bodyStr += `static get ${dependencyProp}() { return this.#${dependencyProp}; } static #${dependencyProp} = DependencyProperty.registerAttached(Type.get(${nativeControlClassName}), "${newProp}", new PropertyMetadata(new AnyConstraint(), null)); get ${newProp}() { return this.get(${nativeControlClassName}.${dependencyProp}); } set ${newProp}(value) { this.set(${nativeControlClassName}.${dependencyProp}, value); }`
        }

        const eventNames = [...getEventNames(elemProto)];

        for (let eventName of eventNames) {
            const nativeEvt = `${eventName}Event`;

            bodyStr += `get ${nativeEvt}() { return this.#${nativeEvt}; } #${nativeEvt} = new NativeEvent(this.domElement, "${eventName}");`;
        }

        bodyStr += "initialize() {} finalize() {} };";

        const NativeControl = new Function("Type", "DependencyProperty", "PropertyMetadata", "NativeControlBase", "AnyConstraint", "NativeEvent", bodyStr)(Type, DependencyProperty, PropertyMetadata, NativeControlBase, AnyConstraint, NativeEvent);

        return NativeControl;
    }

    function getEventNames(elemProto: Element): IterableIterator<string> {
        return ArrayUtils.select(
            ArrayUtils.where(
                ObjectUtils.getAllPropertyNames(elemProto),
                prop => isEventName(prop)
            ),
            prop => getEventName(prop)
        );
    }

    function getOriginalAndSubstitutedPropertyNames(elemProto: Element): IterableIterator<[string, string | null]> {
        return ArrayUtils.select(
            ArrayUtils.where(
                ObjectUtils.getAllPropertyNames(elemProto),
                prop => !isExcludedProperty(prop) && !isEventName(prop)
            ),
            prop => [prop, getSubstitutedPropertyNameOrNull(prop)]
        );
    }
}
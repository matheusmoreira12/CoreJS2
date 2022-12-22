import { Control } from "../index.js";
import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { NativeControlBase } from "./native-control-base.js";
import { NativeEvent } from "../../../standard/events/index.js";
import { ObjectUtils } from "../../../core-base/utils/index.js";
import { ControlConstructor } from "../control-constructor";
import { NativeControl } from "./native-control";
import { InvalidOperationException } from "../../../standard/exceptions/framework-exception.js";
import { Type } from "../../../standard/reflection/index.js";
import { AnyConstraint } from "../../../standard/reflection/type-constraints/index.js";
import { EXCLUDED_PROPERTIES } from "./excluded-properties.js";
import { SUBSTITUTED_PROPERTIES } from "./substituted-properties.js";

export namespace __Generator {
    export function generateNativeControls(elemDataTuples: readonly (readonly [string, string, string])[]): { readonly [K: string]: NativeControl<any> } {
        const result = {};
        for (let [elementName, namespaceUri, elemCtorName] of elemDataTuples) {
            const elemCtor = globalThis[elemCtorName as keyof typeof globalThis] as typeof Element;
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
                const NativeControl = nativeControlFactory(elementName) as unknown as ControlConstructor;
                Control.register(NativeControl, elementName, namespaceUri);
                defineDependencyProperties(NativeControl, elemCtor.prototype);
                defineInitializer(NativeControl.prototype);
                return NativeControl;
            }
        }

        function defineDependencyProperties(nativeControl: ControlConstructor, elemProto: Element) {
            for (let [propName, substPropName] of getPropertyNames(elemProto)) {
                const finalPropName = substPropName ?? propName;
                Object.defineProperty(nativeControl.prototype, finalPropName, {
                    get() { return this.get(prop); },
                    set(value: any) { return this.set(prop, value); }
                });
                const prop = DependencyProperty.registerAttached(Type.get(nativeControl), finalPropName, new PropertyMetadata(new AnyConstraint(), null));
                Object.defineProperty(nativeControl, `${finalPropName}Property`, {
                    get() { return prop; }
                });
            }
        }

        function defineInitializer(proto: Control) {
            Object.defineProperty(proto, "initialize", {
                get() { return initializeControl; }
            });
            function initializeControl(this: Control, elem: Element) {
                defineEvents(this, elem);

                function defineEvents(control: Control, elem: Element) {
                    for (let eventName of getEventNames(elem)) {
                        let event: NativeEvent | undefined;
                        Object.defineProperty(control, `${eventName}Event`, {
                            get(this: Element) {
                                return event ?? (event = new NativeEvent(elem, eventName));
                            }
                        });
                    }
                }
            }
        }
    }

    function nativeControlFactory(tagName: string): NativeControlBase {
        return new Function("NativeControlBase", `return class ${tagName}_NativeControl extends NativeControlBase {};`)(NativeControlBase)
    }

    function getEventNames(elemProto: Element): string[] {
        return Array.from(ObjectUtils.getAllPropertyNames(elemProto)).filter(prop => isEventName(prop)).map(prop => getEventNameFromProp(prop));

        function getEventNameFromProp(prop: string) {
            return prop.substring(2);
        }
    }

    function getPropertyNames(elemProto: Element): [string, string | null][] {
        return Array.from(ObjectUtils.getAllPropertyNames(elemProto)).filter(prop => !isEventName(prop) && !isExcludedProp(prop)).map(prop => [prop, SUBSTITUTED_PROPERTIES[prop as keyof typeof SUBSTITUTED_PROPERTIES] ?? null]);
    }

    function isEventName(prop: string) {
        return prop.startsWith("on");
    }

    function isExcludedProp(prop: string) {
        return EXCLUDED_PROPERTIES.includes(prop as typeof EXCLUDED_PROPERTIES[0]);
    }
}
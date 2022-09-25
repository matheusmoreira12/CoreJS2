import { Control } from "../index.js";
import { DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { NativeControlBase } from "./native-control-base.js";
import { NativeEvent } from "../../../standard/events/index.js";
import { ObjectUtils } from "../../../core-base/utils/index.js";
import { ControlConstructor } from "../control-constructor";
import { NativeControl } from "./native-control";
import { InvalidOperationException } from "../../../standard/exceptions/framework-exception.js";

export namespace __Generator {
    export function generateNativeControls(elemDataTuples: readonly(readonly [string, string, string])[]): { readonly [K: string]: NativeControl<any> } {
        const result = {};
        for (let [elementName, namespaceUri, elemCtorName] of elemDataTuples){
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
            for (let propName of getPropertyNames(elemProto)) {
                if (propName == "constructor" ||
                    propName == "name" ||
                    propName == "toString")
                    continue;
                Object.defineProperty(nativeControl.prototype, propName, {
                    get() { return this.get(prop); },
                    set(value: any) { return this.set(prop, value); }
                });
                const prop = DependencyProperty.registerAttached(nativeControl, propName, new PropertyMetadata(null, null));
                Object.defineProperty(nativeControl, `${propName}Property`, {
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
        return Array.from(ObjectUtils.getAllPropertyNames(elemProto)).map(p => p.match(/^on(\w+)/)).filter(m => m).map(m => m![1]);
    }

    function getPropertyNames(elemProto: Element): string[] {
        return Array.from(ObjectUtils.getAllPropertyNames(elemProto)).filter(p => !p.startsWith("on"));
    }
}
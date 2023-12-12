import { Control } from "../index.js";
import { DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { NativeControlBase } from "./native-control-base.js";
import { NativeEvent } from "../../../standard/events/index.js";
import { ControlConstructor } from "../control-constructor";
import { NativeControl } from "./__utils/native-control.js";
import { InvalidOperationException } from "../../../standard/exceptions/framework-exception.js";
import { Type } from "../../../standard/reflection/index.js";
import { AnyConstraint } from "../../../standard/reflection/type-constraints/index.js";
import { DataMap } from "./__utils/data-map.js";
import { NativeControlPrototype } from "./__utils/native-control-prototype.js";
import { getNativeEventNames, getNativeAndSubstitutedPropertyNames } from "./__utils/index.js";

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
        const nativeControlClassName = `${tagName}_NativeControl`;
        const nativeControlCtor = new Function("NativeControlBase", `return class ${nativeControlClassName} extends NativeControlBase { }`)(NativeControlBase);
        const eventNames = getNativeEventNames(elemCtor);

        for (let evtName of eventNames) {
            const evtPropName = `${evtName}Event`;
            const evtStorePropName = `#${evtName}Event`;
            Object.defineProperty(nativeControlCtor.prototype, evtPropName, {
                get() { return this[evtStorePropName]; }
            });
        }

        Object.defineProperty(nativeControlCtor.prototype, "initialize", {
            value: function (this: NativeControlPrototype<typeof Element>) {
                for (let evtName of eventNames) {
                    const evtStorePropName = `#${evtName}Event`;
                    const evt = new NativeEvent(this.domElement, evtName);
                    (this as any)[evtStorePropName] = evt;
                }
            },
            writable: false,
        });

        Object.defineProperty(nativeControlCtor.prototype, "finalize", {
            value: new Function(),
            writable: false,
        });

        for (let [prop, substitutedProp] of getNativeAndSubstitutedPropertyNames(elemCtor)) {
            const newProp = substitutedProp ?? prop;
            const dependencyPropName = `${newProp}Property`;

            Object.defineProperty(nativeControlCtor.prototype, newProp, {
                get() { return this.get(dependencyProp); },
                set(value) { return this.set(dependencyProp, value); }
            })

            const dependencyProp = DependencyProperty.registerAttached(Type.get(nativeControlCtor), newProp, new PropertyMetadata(new AnyConstraint()));

            Object.defineProperty(nativeControlCtor, dependencyPropName, {
                get() { return dependencyProp; }
            });
        }

        return nativeControlCtor;
    }
}
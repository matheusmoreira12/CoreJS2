// import { Collection } from "../../Standard/Collections/index.js";
// import { Control } from "./index.js";
// import { Class } from "../../Standard/Types/Types.js";

// const registeredControls = new Collection<ControlMetadata>();

// interface ControlMetadata {
//     elementName: string;
//     ctor: Class<Control>;
//     instances: Collection<ControlInstance>;
// }

// const ControlMetadata = {
//     create(elementName: string, ctor: Class<Control>): ControlMetadata {
//         const instances = new Collection<ControlInstance>();
//         return {
//             elementName,
//             ctor,
//             instances
//         };
//     }
// }

// interface ControlInstance {
//     instance: Control;
//     element: HTMLElement;
// }

// const ControlInstance = {
//     create(element: HTMLElement, instance: Control): ControlInstance {
//         return {
//             instance,
//             element
//         }
//     }
// }

// export function getDOMElement(control: Control): HTMLElement {
//     return null;
// }

// export function register(control: Control, elementName: string) {
// }

// export function unregister() {

// }
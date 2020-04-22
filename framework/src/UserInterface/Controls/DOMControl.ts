import { assertParams } from "../../ValidationStandalone/index.js";
import { Control } from "./index.js";

export class DOMControl extends Control {
    constructor(qualifiedName: string, namespaceURI?: string) {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        super(qualifiedName);

        let domElement: Element;
        if (namespaceURI === undefined)
            domElement = document.createElement(qualifiedName);
        else
            domElement = document.createElementNS(namespaceURI, qualifiedName);
        this.initialize(domElement);
    }
}
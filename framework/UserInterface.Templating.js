import { Collection } from "./standard";
import { InvalidOperationException, ArgumentTypeException } from "./exceptions";

class VisualTemplateElementPropertyMap extends Map {
    static get [Symbol.species]() { return Map; }

    set(name, value) {
        if (typeof name !== "string") throw new ArgumentTypeException("name", name, String);
    }
}

export class VisualTemplateNode {
    constructor() {
        if (this.constructor === VisualTemplateNode) throw new InvalidOperationException("Invalid constructor.");
    }

    childNodes = new Collection();
}

export class VisualTemplateElement extends VisualTemplateNode {
    constructor(qualifiedName, namespaceURI = null) {
        this.qualifiedName = qualifiedName;
        this.namespaceURI = namespaceURI;
    }
}

export class VisualTemplate extends VisualTemplateNode {
    constructor() {
    }
}

export class VisualTemplateBinding {
    constructor(options = null) {
        if (this.constructor === VisualTemplateBinding) throw new InvalidOperationException("Invalid constructor.");

        this.options = options;
    }
}

export class VisualTemplatePropertyBinding extends VisualTemplateBinding {
    constructor(sourceName, sourcePropertyName, targetName, targetPropertyName, options = null) {
        super(options);

        this.sourceName = sourceName;
        this.sourcePropertyName = sourcePropertyName;
        this.targetName = targetName;
        this.targetPropertyName = targetPropertyName;
    }
}

export class VisualTemplatePropertyAttributeBinding extends VisualTemplateBinding {
    constructor(sourceName, sourcePropertyName, targetElementName, targetAttributeName, options = null) {
        super(options);

        this.sourceName = sourceName;
        this.sourcePropertyName = sourcePropertyName;
        this.targetName = targetName;
        this.targetAttributeName = targetPropertyName;
    }
}
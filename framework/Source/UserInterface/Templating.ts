class VisualTemplateNodeWorker extends Worker {
    initialize() {
        super.initialize();
    }

    finalize() {
        super.finalize();
    }

    childNodes = new Collection();
}

export class VisualTemplateNode {
    constructor() {
        if (this.constructor === VisualTemplateNode)
            throw new InvalidOperationException("Invalid constructor.");

        Worker.create(this, VisualTemplateNodeWorker);
    }

    get childNodes() {
        let worker = Worker.retrieve(this, VisualTemplateElementWorker);
        if (!worker) return undefined;

        return worker.childNodes;
    }
}

class VisualTemplateElementWorker extends Worker {
    initialize(qualifiedName, namespaceUri) {
        super.initialize();

        this.qualifiedName = qualifiedName;
        this.namespaceUri = namespaceUri;
    }

    finalize() {
        super.finalize();
    }

    properties = new ObservableDictionary();
}

export class VisualTemplateElement extends VisualTemplateNode {
    constructor(qualifiedName, namespaceUri = null) {
        if (!Type.of(qualifiedName).equals(Type.get(String)))
            throw new ArgumentTypeException("qualifiedName", Type.of(qualifiedName), Type.get(String));
        if (namespaceUri && !Type.of(namespaceUri).equals(Type.get(String)))
            throw new ArgumentTypeException("namespaceUri", Type.of(namespaceUri), Type.get(String));

        Worker.override(this, VisualTemplateElementWorker, qualifiedName, namespaceUri);
    }

    get qualifiedName() {
        let worker = Worker.retrieve(this, VisualTemplateElementWorker);
        if (!worker) return undefined;

        return worker.qualifiedName;
    }

    get namespaceUri() {
        let worker = Worker.retrieve(this, VisualTemplateElementWorker);
        if (!worker) return undefined;

        return worker.namespaceUri;
    }

    get properties() {
        let worker = Worker.retrieve(this, VisualTemplateElementWorker);
        if (!worker) return undefined;

        return worker.properties;
    }
}

export class VisualTemplate extends VisualTemplateNode {
    constructor() {
    }
}

export class VisualTemplateBinding {
    constructor(options = null) {
        if (this.constructor === VisualTemplateBinding)
            throw new InvalidOperationException("Invalid constructor.");

        if (options && !Type.of(options).extends(Type.get(Object)))
            throw new ArgumentTypeException("options", Type.of(options), Type.get(String));

        this.options = options;
    }
}

export class VisualTemplatePropertyBinding extends VisualTemplateBinding {
    constructor(sourceName, sourcePropertyName, targetName, targetPropertyName, options = null) {
        if (!Type.of(sourceName).equals(Type.get(String)))
            throw new ArgumentTypeException("sourceName", Type.of(sourceName), Type.get(String));
        if (!Type.of(sourcePropertyName).equals(Type.get(String)))
            throw new ArgumentTypeException("sourcePropertyName", Type.of(sourcePropertyName), Type.get(String));
        if (!Type.of(targetName).equals(Type.get(String)))
            throw new ArgumentTypeException("targetName", Type.of(targetName), Type.get(String));
        if (!Type.of(targetPropertyName).equals(Type.get(String)))
            throw new ArgumentTypeException("targetPropertyName", Type.of(targetPropertyName), Type.get(String));

        super(options);

        this.sourceName = sourceName;
        this.sourcePropertyName = sourcePropertyName;
        this.targetName = targetName;
        this.targetPropertyName = targetPropertyName;
    }
}

export class VisualTemplatePropertyAttributeBinding extends VisualTemplateBinding {
    constructor(sourceName, sourcePropertyName, targetElementName, targetAttributeName, options = null) {
        if (!Type.of(sourceName).equals(Type.get(String)))
            throw new ArgumentTypeException("sourceName", Type.of(sourceName), Type.get(String));
        if (!Type.of(sourcePropertyName).equals(Type.get(String)))
            throw new ArgumentTypeException("sourcePropertyName", Type.of(sourcePropertyName), Type.get(String));
        if (!Type.of(targetElementName).equals(Type.get(String)))
            throw new ArgumentTypeException("targetElementName", Type.of(targetElementName), Type.get(String));
        if (!Type.of(targetAttributeName).equals(Type.get(String)))
            throw new ArgumentTypeException("targetAttributeName", Type.of(targetAttributeName), Type.get(String));

        super(options);

        this.sourceName = sourceName;
        this.sourcePropertyName = sourcePropertyName;
        this.targetName = targetElementName;
        this.targetAttributeName = targetAttributeName;
    }
}
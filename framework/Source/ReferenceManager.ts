import { ReverseIterator } from "./standard.js";
import { ObservableCollection, ObservableCollectionChangeAction } from "./Standard.Collections.js";
import { ArgumentTypeException } from "./exceptions.js";
import { Enumeration } from "./Standard.Enumeration.js";

const ReferenceRetrievalRequestStatus = new Enumeration([
    "Pending",
    "Resolved"
]);

class ReferenceRetrievalRequest extends Promise {
    static get [Symbol.species]() { return Promise; }

    constructor(name, context) {
        if (typeof name !== "string") throw new ArgumentTypeException("name", name, String);

        if (!(context instanceof ReferenceManagerContext)) throw new ArgumentTypeException("context", context,
            ReferenceManagerContext);

        let _resolve;

        super(function (resolve, reject) {
            _resolve = resolve;
        });

        this.resolve = (value) => {
            _resolve(value);

            this.status = ReferenceRetrievalRequestStatus.Resolved;
        }

        this.name = name;
        this.context = context;
    }

    status = ReferenceRetrievalRequestStatus.Pending;
}

class Declaration {
    constructor(name, context, value) {
        if (typeof name !== "string") throw new ArgumentTypeException("name", name, String);

        if (!(context instanceof ReferenceManagerContext)) throw new ArgumentTypeException("parentContext", parentContext,
            ReferenceManagerContext);

        this.name = name;
        this.context = context;
        this.value = value;
    }
}

export class ReferenceManagerContext {
    constructor(target = null, parentContext = null) {
        if (name && typeof name !== "string") throw new ArgumentTypeException("name", name, String);

        if (parentContext && !(parentContext instanceof ReferenceManagerContext)) throw new ArgumentTypeException("parentContext",
            parentContext, ReferenceManagerContext);

        this.name = name;
        this.parentContext = parentContext;
    }

    _ownDeclarations = new Map();

    isContainedWithin(parentContext) {
        let parentContexts = Array.from(this.getParentContexts());

        if (parentContexts.includes(parentContext))
            return true;

        return false;
    }

    *getParentContexts() {
        let context = this;

        while (context)
            yield context.parentContext;
    }

    derive(target = null) {
        return new ReferenceManagerContext(this, target);
    }
}

function clearResolvedRequests() {
    for (let request of new ReverseIterator(requests)) {
        if (request.status === ReferenceRetrievalRequestStatus.Resolved)
            requests.remove(request);
    }
}

function requestMatchesDeclaration(request, declaration) {
    if (request.name !== declaration.name) return false;

    if (request.context !== declaration.context &&
        !request.context.isContainedWithin(declaration.context)) return false;

    return true;
}

function* getMatchingPendingRequests(declaration) {
    for (let request of requests) {
        if (request.status !== ReferenceRetrievalRequestStatus.Pending) continue;

        if (!requestMatchesDeclaration(request, declaration)) continue;

        yield request;
    }
}

function resolveMatchingPendingRequests(declaration) {
    let matchingPendingRequests = getMatchingPendingRequests(declaration);

    for (let request of matchingPendingRequests)
        request.resolve(declaration.value);

    clearResolvedRequests();
}

function getMatchingDeclaration(request) {
    for (let declaration of declarations) {
        if (!requestMatchesDeclaration(request, declaration)) continue;

        return declaration;
    }
}

function resolvePendingRequestIfValueAvailable(request) {
    let matchingDeclaration = getMatchingDeclaration(request);

    if (!matchingDeclaration) return;

    request.resolve(matchingDeclaration.value);
}

const requests = new ObservableCollection();

function requests_onChange(sender, args) {
    if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Add, args.action)) {
        for (let request of args.newItems)
            resolvePendingRequestIfValueAvailable(request);
    }
}
requests.ChangeEvent.attach(requests_onChange);

const declarations = new ObservableCollection();

function declarations_onChange(sender, args) {
    if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Add, args.action)) {
        for (let declaration of args.newItems)
            resolveMatchingPendingRequests(declaration);
    }
}
declarations.ChangeEvent.attach(declarations_onChange);

let rootContext = new ReferenceManagerContext(window);

const ReferenceManager = {
    get rootContext() { return rootContext; },

    declare(name, value, context) {
        if (!(context instanceof ReferenceManagerContext)) throw new ArgumentTypeException("context", context,
            ReferenceManagerContext);

        let declaration = new Declaration(name, context, value);

        declarations.add(declaration);
    },

    retrieve(name, context) {
        let request = new ReferenceRetrievalRequest(name, context);

        requests.add(request);

        return request;
    }
};

export { ReferenceManager };

window.ReferenceManager = ReferenceManager;
import { InvalidOperationException, NotImplementedException } from "./exceptions.js";

let metadataMap = new WeakMap();

function createDestructibleMetadata(destructible) {
    let metadata = {
        isDestructed: false
    };

    metadataMap.set(destructible, metadata);
}

function getDestructibleMetadata(destructible) {
    let metadata = metadataMap.get(destructible);

    return metadata || {};
}

function markDestructableAsDestructed(destructible) {
    const metadata = getDestructibleMetadata(this);

    metadata.isDestructed = true;
}

export class Destructible {
    constructor() {
        if (this.constructor === Destructible)
            throw new InvalidOperationException("Invalid constructor.");

        createDestructibleMetadata(this);
    }

    destructor = null;

    destruct() {
        if (this.isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");

        if (!this.destructor)
            throw new NotImplementedException("Destructor has not been implemented.");

        this.destructor();

        markDestructableAsDestructed(this);
    }

    get isDestructed() {
        const metadata = getDestructibleMetadata(this);

        return metadata.isDestructed;
    }
}
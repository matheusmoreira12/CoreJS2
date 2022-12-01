import { Guid } from "./index.js";

export namespace __Generator {
    const uniqueBacklog: Guid[] = [];

    export function create(): Guid {
        const guid = doCreate();
        trySaveToUniqueBacklog(guid);
        return guid;
    }

    export function createUnique(): Guid {
        let guid: Guid | null = null;
        do
            guid = doCreate();
        while (!trySaveToUniqueBacklog(guid))
        return guid;
    }

    function doCreate() {
        return new Guid(crypto.getRandomValues(new Uint8Array(16)));
    }

    function trySaveToUniqueBacklog(guid: Guid): boolean {
        const isDuplicate = uniqueBacklog.some(g => g.equals(guid));
        if (isDuplicate)
            return false;
        uniqueBacklog.push(guid);
        return true;
    }    
}
import { Guid } from "./index.js";

export namespace __Generator {
    const uniqueBacklog: Guid[] = [];

    export function create(): Guid {
        const guid = new Guid(crypto.getRandomValues(new Uint8Array(16)));
        trySaveToUniqueBacklog(guid);
        return guid;
    }

    export function createUnique(): Guid {
        let guid: Guid | null = null;
        // do
            guid = create();
        // while (!trySaveToUniqueBacklog(guid))
        return guid;
    }

    function trySaveToUniqueBacklog(guid: Guid) {
        const duplicate = uniqueBacklog.find(g => g.equals(guid));
        if (duplicate !== undefined)
            return false;
        uniqueBacklog.push(guid);
        return true;
    }    
}
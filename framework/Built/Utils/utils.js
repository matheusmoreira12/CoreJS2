export const ArrayUtils = {
    detectArrayChanges(cached, current, addCallback, removeCallback, replaceCallback) {
        for (let i = 0; i < current.length || i < cached.length; i++) {
            if (i >= cached.length)
                addCallback(current[i], i);
            else if (i >= current.length)
                removeCallback(cached[i], i);
            else {
                if (ObjectUtils.deepEquals(cached[i], current[i]))
                    continue;
                replaceCallback(cached[i], [current[i]], i);
            }
        }
    }
};
export const DomUtils = {
    insertElementAt(parent, position, newChild) {
        if (parent.children.length === 0 || position >= parent.children.length)
            parent.appendChild(newChild);
        else {
            let refChild = parent.children[position];
            parent.insertBefore(newChild, refChild);
        }
    }
};
export const MapUtils = {
    invert(value) {
        function* generateInvertedEntries() {
            for (let entry of value)
                yield [entry[1], entry[0]];
        }
        return new Map(generateInvertedEntries());
    }
};

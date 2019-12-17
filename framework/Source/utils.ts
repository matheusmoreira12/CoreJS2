export let arrayUtils = {

    detectArrayChanges(cached, current, addCallback, removeCallback, replaceCallback) {
        for (let i = 0; i < current.length || i < cached.length; i++) {
            if (i >= cached.length)
                addCallback(current[i], i);
            else if (i >= current.length)
                removeCallback(cached[i], i);
            else {
                if (objectUtils.equals(cached[i], current[i])) continue;

                replaceCallback(cached[i], [current[i]], i);
            }
        }
    }
};

export let domUtils = {

    insertElementAt(parent, position, newChild) {
        if (parent.children.length === 0 || position >= parent.children.length)
            parent.appendChild(newChild);
        else {
            let refChild = parent.children[position];

            parent.insertBefore(newChild, refChild);
        }
    }
};

export let objectUtils = {

    equals(obj1, obj2) {
        if (obj1 instanceof Object) {
            //Check each property value
            for (let prop in obj1)
                if (!this.equals(obj1[prop], obj2[prop])) return false;

            return true;
        }

        if (obj1 !== obj2) return false;

        return true;
    }
};
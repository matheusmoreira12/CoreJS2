export function insertElementAt(parent: Element, position: number, child: Element) {
    if (parent.children.length === 0 || position >= parent.children.length)
        parent.appendChild(child);
    else {
        const refChild = parent.children[position];
        parent.insertBefore(child, refChild);
    }
}
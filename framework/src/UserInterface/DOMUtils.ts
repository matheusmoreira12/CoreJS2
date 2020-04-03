import { ArgumentTypeException } from "../Standard/index.js";

export function insertElementAt(parent: Element, position: number, child: Element) {
    if (parent.children.length === 0 || position >= parent.children.length - 1)
        parent.appendChild(child);
    else {
        const refChild = parent.children[position];
        parent.insertBefore(child, refChild);
    }
}

export function selectAllText(elem: Element) {
    var range = document.createRange();
    range.selectNodeContents(elem);

    const selection = window.getSelection();
    if (!selection)
        return;

    selection.removeAllRanges();
    selection.addRange(range);
}

export function deselectAllText() {
    const selection = window.getSelection();
    if (!selection)
        return;

    selection.removeAllRanges();
}

export function intersectRects(rect1: DOMRect, rect2: DOMRect) {
    const right = Math.min(rect1.right, rect2.right),
        left = Math.min(Math.max(rect1.left, rect2.left), right),
        bottom = Math.min(rect1.bottom, rect2.bottom),
        top = Math.min(Math.max(rect1.top, rect2.top), bottom);
    return new DOMRect(left, top, right - left, bottom - top);
}

export function offsetRect(rect: DOMRect, offsetTop: number, offsetRight: number, offsetBottom: number, offsetLeft: number) {
    const top = rect.top + offsetTop,
        right = rect.right + offsetRight,
        bottom = rect.bottom + offsetBottom,
        left = rect.left + offsetLeft;
    return new DOMRect(left, top, right - left, bottom - top);
}

export function clipRectSide(rect: DOMRect, side: "top" | "right" | "bottom" | "left", amount: number) {
    let top = rect.top,
        right = rect.right,
        bottom = rect.bottom,
        left = rect.left;

    switch (side) {
        case "top":
            bottom = top + amount;
            break;

        case "right":
            left = right - amount;
            break;

        case "bottom":
            top = bottom - amount;
            break;

        case "left":
            right = left + amount;
            break;
    }

    return new DOMRect(left, top, right - left, bottom - top);
}

export function pointInRect(rect: DOMRect, point: DOMPoint) {
    return point.z == 0 &&
        point.w == 0 &&
        rect.left <= point.x &&
        rect.right >= point.x &&
        rect.top <= point.y &&
        rect.bottom >= point.y;
}

export function rectsIntersect(rect1: DOMRect, rect2: DOMRect) {
    let intersectionRect = intersectRects(rect1, rect2);
    return intersectionRect.width > 0 && intersectionRect.height > 0;
}

export function* getElementTree(elem: Element | null) {
    while (elem) {
        yield elem;
        elem = elem.parentElement;
    }
}

export function elementIsScrollable(elem: Element) {
    let compStyle = getComputedStyle(elem);

    return compStyle.overflowX === "scroll" ||
        compStyle.overflowX === "auto" ||
        compStyle.overflowY === "scroll" ||
        compStyle.overflowY === "auto";
}

export function* getViewportElements(elems: Iterable<Element>) {
    for (let elem of elems)
        if (elementIsScrollable(elem))
            yield elem;
}

export function* getElementsUnderCursor(elems: Iterable<Element>, cursorPos: DOMPoint) {
    for (let elem of elems) {
        let boundingRect = elem.getBoundingClientRect();

        if (pointInRect(<DOMRect>boundingRect, cursorPos))
            yield elem;
    }
}

export function getElementVisibleRect(elem: Element): DOMRect | null {
    let result: DOMRect | null = null;

    for (let _elem of getElementTree(elem)) {
        let boundingRect = _elem.getBoundingClientRect();

        if (result) {
            result = intersectRects(<DOMRect>result, <DOMRect>boundingRect);
            if (result.left >= result.right || result.top >= result.bottom) break;
        }
        else
            result = <DOMRect>boundingRect;
    }

    return result;
}

export function createElement(qualifiedName: string, namespaceURI: string | null = null): Element {
    if (typeof qualifiedName !== "string")
        throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
    if (namespaceURI !== null && typeof namespaceURI !== "string")
        throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

    if (namespaceURI === null)
        return document.createElement(qualifiedName);
    else
        return document.createElementNS(namespaceURI, qualifiedName);
}

export function createAttribute(qualifiedName: string, namespaceURI: string | null = null): Attr {
    if (typeof qualifiedName !== "string")
        throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
    if (namespaceURI !== null && typeof namespaceURI !== "string")
        throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

    if (namespaceURI === null)
        return document.createAttribute(qualifiedName);
    else
        return document.createAttributeNS(namespaceURI, qualifiedName);
}
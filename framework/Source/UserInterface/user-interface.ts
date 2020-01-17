

/**
 * 
 */
export class Setter {

}


/** 
 * Visual State Manager
 *  Manages the interactions between user interface and logic. 
 */
class VisualStateManager {
    constructor() {
    }

    serverTaskStartedEvent = new BroadcastFrameworkEvent("ServerTask_started", this._onServerTaskStarted, this);
    serverTaskFinishedEvent = new BroadcastFrameworkEvent("ServerTask_finished", this._onServerTaskFinished, this);

    _onServerTaskStarted() {
        mainSpinner.hidden = false;
    }

    _onServerTaskFinished() {
        mainSpinner.hidden = true;
    }
}

export const visualStateManager = new VisualStateManager();

/**
 * 
 */
export const Utils = {
    selectAllText(elem) {
        var range = document.createRange();
        range.selectNodeContents(elem);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },

    deselectAllText() {
        window.getSelection().removeAllRanges();
    },

    intersectRects(rect1, rect2) {
        let { left: left1, top: top1, right: right1, bottom: bottom1 } = rect1;
        let { left: left2, top: top2, right: right2, bottom: bottom2 } = rect2;

        let right = Math.min(right1, right2);
        let left = Math.min(Math.max(left1, left2), right);

        let bottom = Math.min(bottom1, bottom2);
        let top = Math.min(Math.max(top1, top2), bottom);

        return new DOMRect(left, top, right - left, bottom - top);
    },

    offsetRect(rect, offsetTop, offsetRight, offsetBottom, offsetLeft) {
        let { top, right, bottom, left } = rect;

        top += offsetTop;

        right += offsetRight;

        bottom += offsetBottom;

        left += offsetLeft;

        return new DOMRect(left, top, right - left, bottom - top);
    },

    clipRectSide(rect, side, amount) {
        let { top, right, bottom, left } = rect;

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
    },

    pointInRect(rect, point) {
        return rect.left <= point.x &&
            rect.right >= point.x &&
            rect.top <= point.y &&
            rect.bottom >= point.y;
    },

    rectsIntersect(rect1, rect2) {
        let topLeft2 = new DOMPoint(rect2.left, rect2.top),
            topRight2 = new DOMPoint(rect2.right, rect2.top),
            bottomRight2 = new DOMPoint(rect2.right, rect2.bottom),
            bottomLeft2 = new DOMPoint(rect2.left, rect2.bottom);

        return this.pointInRect(topLeft2, rect1) ||
            this.pointInRect(topRight2, rect1) ||
            this.pointInRect(bottomRight2, rect1) ||
            this.pointInRect(bottomLeft2, rect1);
    },

    *getElementTree(elem) {
        while (elem) {
            yield elem;

            elem = elem.parentElement;
        }
    },

    elementIsScrollable(elem) {
        let compStyle = getComputedStyle(elem);

        return compStyle.overflowX === "scroll" ||
            compStyle.overflowX === "auto" ||
            compStyle.overflowY === "scroll" ||
            compStyle.overflowY === "auto";
    },

    *getViewportElements(elems) {
        for (let elem of elems)
            if (this.elementIsScrollable(elem))
                yield elem;
    },

    *getElementsUnderCursor(elems, cursorPos) {
        for (let elem of elems) {
            let boundingRect = elem.getBoundingClientRect();

            if (this.pointInRect(boundingRect, cursorPos))
                yield elem;
        }
    },

    getElementVisibleRect(elem) {
        let result = null;

        for (let _elem of this.getElementTree(elem)) {
            let boundingRect = _elem.getBoundingClientRect();

            if (!result)
                result = boundingRect;
            else
                result = this.intersectRects(result, boundingRect);

            if (result.left >= result.right || result.top >= result.bottom) break;
        }

        return result;
    }
};


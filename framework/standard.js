import { ArgumentException, ArgumentTypeException, FrameworkException, InvalidTypeException, InvalidOperationException, FormatException, ArgumentNullException, IndexOutOfRangeException } from "./exceptions.js";
import { FrameworkEvent } from "./Standard.Events.js";

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

export class Enumeration {
    static getName(enumeration, flag) {
        for (let flagPair of this.getAllFlags(enumeration))
            if (flagPair.value == flag)
                return flagPair.key;

        return null;
    }

    static *getAllFlags(enumeration) {
        for (let key of Object.getOwnPropertyNames(enumeration)) {
            let flag = enumeration[key];

            if (!key.match(ENUMERATION_FLAG_NAME_PATTERN)) continue;

            if (typeof flag === "number")
                yield new KeyValuePair(key, flag);
        }
    }

    static isSet(enumeration, flag) {
        return (flag & enumeration) == flag;
    }

    static create(map) {
        let customEnum = class CustomEnumeration extends Enumeration { };

        function addFlag(name, value) {
            Object.defineProperty(customEnum, name, {
                get() { return value; }
            });
        }

        if (map instanceof Array) {
            for (let i = 0; i < map.length; i++)
                addFlag(map[i], i);
        }
        else if (typeof map === "object")
            for (let key in map) {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("EnumerationName", key);

                let value = map[key];

                if (typeof value != "number")
                    throw new InvalidTypeException("value", Number);

                addFlag(key, value);
            }
        else
            throw new ArgumentTypeException("map", [Array, Object]);

        return customEnum;
    }
}

/**
 * Collection Class
 * Represents a collection of values.
 */
export class Collection extends Array {

    get first() { return this[0]; }

    get last() { return this[this.length - 1]; }

    * getRange(index, itemCount) {
        if (index < 0 || index > this.length - 1) throw new IndexOutOfRangeException();

        if (itemCount < 0 || itemCount > this.length - index) throw new IndexOutOfRangeException();

        for (let i = index; i < index + itemCount; i++)
            yield this[i];
    }

    add(item) { this.push(item); }

    insert(index, item) { this.splice(index, 0, item); }

    move(oldIndex, newIndex) {
        let item = this.removeAt(oldIndex);

        if (newIndex > oldIndex) newIndex--;

        this.insert(newIndex, item);
    }

    swap(index1, index2) {
        [this[index1], this[index2]] = [this[index2], this[index1]];
    }

    replace(oldItem, newItem) {
        let index = this.indexOf(oldItem);

        if (index === -1) throw new InvalidOperationException("Cannot replace item. Item not found.");

        this[index] = newItem;
    }

    removeAt(index) { return this.splice(index, 1)[0]; }

    remove(item) {
        let index = this.indexOf(item);

        if (index === -1) throw new InvalidOperationException("Cannot remove item. Item not found.");

        this.removeAt(index);
    }
}

/*
 * ObservableCollection class
 * Creates a collection observable via the "change" event.
 */
export const ObservableCollectionChangeAction = Enumeration.create({ Add: 1, Remove: 2 });

export class ObservableCollection extends Collection {
    _notifySplice(start, deleteCount, ...items) {
        let action = (items.length > 0 ? ObservableCollectionChangeAction.Add : 0) |
            (deleteCount > 0 ? ObservableCollectionChangeAction.Remove : 0);

        if (action == 0) return;

        action = new ObservableCollectionChangeAction(action);

        const oldItems = Array.from(this.getRange(start, deleteCount));

        this.ChangeEvent.invoke(this, {
            action,
            oldIndex: start,
            oldItems,
            newIndex: start,
            newItems: items
        });
    }

    _notifyPush(...items) {
        const newIndex = this.length - 1;

        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Add,
            oldIndex: null,
            oldItems: [],
            newIndex,
            newItems: items
        });
    }

    _notifyPop() {
        const oldIndex = this.length - 1,
            oldItem = this.last;

        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Remove,
            oldIndex,
            oldItems: [oldItem],
            newIndex: null,
            newItems: []
        });
    }

    splice(start, deleteCount, ...items) {
        this._notifySplice(start, deleteCount, ...items);

        return super.splice(start, deleteCount, ...items);
    }

    push(...items) {
        this._notifyPush(...items);

        super.push(...items);
    }

    pop() {
        this._notifyPop();

        return super.pop();
    }

    ChangeEvent = new FrameworkEvent();
}

/**
 * KeyValuePair class
 */
export class KeyValuePair {
    static fromMapItem(mapItem) {
        let { 0: key, 1: value } = mapItem;

        return new KeyValuePair(key, value);
    }

    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

/**
 * Dictionary class
 * 
 */
export class Dictionary extends Collection {
    static fromMap(map) {
        function* getItems() {
            for (let mapItem of map)
                yield KeyValuePair.fromMapItem(mapItem);
        }

        return new Dictionary(...getItems());
    }

    static fromKeyValueObject(obj) {
        function* getEntries(obj) {
            for (let key in obj) {
                let value = obj[key];
                yield new KeyValuePair(key, value);
            }
        }

        return new Dictionary(...getEntries(obj));
    }

    get(key) {
        for (let item of this) {
            if (item.key === key)
                return item;
        }

        return undefined;
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    set(key, value) {
        if (value === undefined) return;

        if (this.has(key))
            this.remove(key);

        this.add(key);
    }

    delete(key) {
        if (!this.has(key)) return;

        this.remove(item);
    }
}

window.Dictionary = Dictionary;

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export const ObservableDictionaryChangeAction = Enumeration.create([
    "Add",
    "Change",
    "Delete"
]);

export class ObservableDictionary extends Dictionary {
    constructor(entries) {
        super(entries);
    }

    _notifySet(key, value) {
        if (this.has(key)) {
            let oldValue = this.get(value);

            ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Change,
                key,
                oldValue,
                newValue: value,
            });
        }
        else
            ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Add,
                key,
                oldValue: undefined,
                newValue: value
            });
    }

    _notifyDelete(key) {
        if (!this.has(key)) return;

        let oldValue = this.get(key);

        ChangeEvent.invoke(this, {
            action: ObservableDictionaryChangeAction.Delete,
            key,
            oldValue,
            newValue: undefined
        });
    }

    set(key, value) {
        this._notifySet(key, value);

        return super.set(key, value);
    }

    delete(key) {
        this._notifyDelete(key);

        return super.delete(key);
    }

    ChangeEvent = new FrameworkEvent();
}

/**
 * ReverseIterator class
 * Iterates backwards through an Iterable.*/
export class ReverseIterator {
    constructor(iterable) {
        this._iterable = iterable;
        this._index = iterable.length;
    }

    [Symbol.iterator] = () => this;

    next() {
        this._index--;

        return {
            done: this._index < 0,
            value: this._iterable[this._index]
        };
    }
}

/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export class ContextSelectionFlags {
    static [Symbol.species]() { return String; }

    static get all() { return new ContextSelectionFlags(["*"], null, null); }

    static get none() { return new ContextSelectionFlags(null, null, ["*"]) }

    static parse(str) {
        if (typeof str != "string") throw new ArgumentTypeException(str, String);

        const MEMBER_PATTERN = "(\\w+(\\s+)?|\\*)+";
        const FORMAT_PATTERN = `^(?<include>${MEMBER_PATTERN})?(!(?<require>${MEMBER_PATTERN}))?(-(?<exclude>${MEMBER_PATTERN}))?$`;
        const SEPARATOR_REGEX = /\s*,\s*/;

        let FORMAT_REGEX = new RegExp(FORMAT_PATTERN);

        let matches = FORMAT_REGEX.exec(str);

        if (!matches) throw new FormatException("[includeFlag, ...][!requireFlag, ...][-excludeFlag, ...]", str);

        let { include: includeFlagsStr, require: requireFlagsStr, exclude: excludeFlagsStr } = matches.groups;

        let includeFlags = includeFlagsStr ? includeFlagsStr.split(SEPARATOR_REGEX) : [];
        let requireFlags = requireFlagsStr ? requireFlagsStr.split(SEPARATOR_REGEX) : [];
        let excludeFlags = excludeFlagsStr ? excludeFlagsStr.split(SEPARATOR_REGEX) : [];

        return new ContextSelectionFlags(includeFlags, requireFlags, excludeFlags);
    }

    constructor(includeFlags = null, requireFlags = null, excludeFlags = null) {
        this._includeFlags = includeFlags || [];
        this._requireFlags = requireFlags || [];
        this._excludeFlags = excludeFlags || [];
    }

    toString() {
        let str = "";

        str += this._includeFlags.join(", ");

        if (this._requireFlags.length > 0)
            str += " !" + this._requireFlags.join(", ");

        if (this._excludeFlags.length > 0)
            str += " -" + this._excludeFlags.join(", ");

        return str;
    }

    matchesFlag(flag) {
        const includeFlags = this._includeFlags;
        const requireFlags = this._requireFlags;
        const excludeFlags = this._excludeFlags;

        function flagsInclude(flag, flags) {
            if (flags.includes("*")) return true;

            if (flags.includes(flag)) return true;

            return false;
        }

        return !flagsInclude(flag, excludeFlags) && flagsInclude(flag, includeFlags);
    }

    matches(contextFlags) {
        return !this._excludeFlags.some(f => contextFlags.matchesFlag(f)) &&
            this._includeFlags.some(f => contextFlags.matchesFlag(f));
    }
}

export class ServerTaskError {
    constructor(message, errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

    [Symbol.toString]() {
        return this.message;
    }
}

const DEFAULT_SERVER_TASK_OPTIONS = {
    timeout: 60 * 1000,
    maxRetries: 0
}

export const ServerTaskStatus = Enumeration.create([
    "Pending",
    "Started",
    "Retried",
    "Failed",
    "TimedOut",
    "Success",
]);

//Keys for ServerTask
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export class ServerTask extends Promise {
    static get [Symbol.species]() { return Promise; }

    constructor(promise, options) {
        let _resolve, _reject;

        if (!(promise instanceof Promise)) throw new ArgumentTypeException("promise", Promise);

        super((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });

        options = Object.assign({}, DEFAULT_SERVER_TASK_OPTIONS, options);
        this._maxRetries = options.maxRetries;
        this._timeout = options.timeout;

        this._execute(promise, _resolve, _reject);
    }

    _execute(promise, resolve, reject) {
        let retries = 0;
        let timeoutHandle = null;

        function notifyStatus(status) {
            this._status = status;

            this.statusChangedEvent.broadcast(this, { status: status });
        }

        function notifyStart() {
            notifyStatus.call(this, ServerTaskStatus.Started);

            this.startedEvent.broadcast(this);
        }

        function notifyRetry(error, retries) {
            notifyStatus.call(this, ServerTaskStatus.Retried);

            this._retries = retries;

            this.retriedEvent.broadcast(this, { error: error, retries: retries });
        }

        function notifyTimeout() {
            notifyStatus.call(this, ServerTaskStatus.TimedOut);

            this.timedOutEvent.broadcast(this);
        }

        function notifySuccess() {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);

            this.succeededEvent.broadcast(this);
            this.finishedEvent.broadcast(this, { error: null });
        }

        function notifyError(error) {
            notifyStatus.call(this, ServerTaskStatus.Failed);

            this._error = error;

            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this);
        }

        function abort(error) {
            notifyError.call(this, error);

            reject(error);
        }

        function failed(error) {
            if (retries > this.maxRetries ||
                error instanceof ServerTaskError)
                abort.call(this, error);
            else
                retry.call(this, error);

            clearTimeout(timeoutHandle);
        }

        function succeeded(result) {
            notifySuccess.call(this);

            resolve(result);

            clearTimeout(timeoutHandle);
        }

        function timedOut() {
            notifyTimeout.call(this, ServerTaskStatus.TimedOut);

            failed.call(this, null);

            clearTimeout(timeoutHandle);
        }

        function retry(error) {
            timeoutHandle = setTimeout(timedOut.bind(this), this.timeout);

            promise.then(value => { //Fulfilled
                succeeded.call(this, value);
            }, reason => { //Rejected
                failed.call(this, reason);
            });

            if (retries > 0)
                notifyRetry.call(this, error, retries);
            else
                notifyStart.call(this);

            retries++;
        }

        retry.call(this);
    }

    _timedOutEvent = new BroadcastFrameworkEvent("ServerTask_timedOut");
    _retriedEvent = new BroadcastFrameworkEvent("ServerTask_retried");
    _statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
    _startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
    _finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
    _succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
    _failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");

    _status = ServerTaskStatus.Pending;
    _error = null;

    get timedOutEvent() { return this._timedOutEvent; }
    get retriedEvent() { return this._retriedEvent; }
    get statusChangedEvent() { return this._statusChangedEvent; }
    get startedEvent() { return this._startedEvent; }
    get finishedEvent() { return this._finishedEvent; }
    get succeededEvent() { return this._succeededEvent; }
    get failedEvent() { return this._failedEvent; }

    get status() { return this._status; }
    get error() { return this._error; }
    get maxRetries() { return this._maxRetries; }
    get retries() { return this._retries; }
    get timeout() { return this._timeout; }
}

/**
 * ValueConverter Class 
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export class ValueConverter {
    convert(value) { throw NotImplementedException(); }
    convertBack(value) { throw NotImplementedException(); }
}

/**
 * ValueValidator Class 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export class ValueValidator {
    validate(value) { throw NotImplementedException(); }
}
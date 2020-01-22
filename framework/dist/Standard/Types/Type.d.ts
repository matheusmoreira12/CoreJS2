import { Class, MemberInfo } from "./index.js";
import { Interface } from "../Interfaces/index.js";
export declare class Type<T = any> {
    static get<T>(_class: Class<T>): Type<T>;
    static of<T>(instance: T): Type<T>;
    private __initializeWithInstance;
    private __initializeWithClass;
    private __checkInitializationStatus;
    getName(): string;
    getOwnMembers(selectionType?: number, selectionAttributes?: number): MemberInfo[];
    getMembers(selectionType?: number, selectionAttributes?: number): MemberInfo[];
    private __getEffectiveValue;
    equals(other: Type): boolean;
    extends(other: Type): boolean;
    matches(other: Type | Interface): boolean;
    matchesAny(...others: (Type | Interface)[]): boolean;
    implements(_interface: Interface): boolean;
    getParentTypes(): Type[];
    private __getParentInstance;
    private __getParentClass;
    getParentType(): Type | null;
    private __instance;
    private __hasInstance;
    private __class;
    private __hasClass;
    private __initialized;
}

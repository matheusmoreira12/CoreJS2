import { Enumeration } from "./Standard.Enumeration.js";
import { Closure, Shell } from "./Standard.Closures.js";
export declare const InterfaceDifferenceType: Enumeration;
export declare class InterfaceDifference extends Shell {
    constructor(analizedType: any, analizedInterface: any, propertyName: any);
    readonly analizedType: any;
    readonly analizedInterface: any;
}
export declare class InterfaceDifferAnalysisClosure extends Closure {
    static createFromTypeAndInterface(): void;
    initialize(analizedType: any, ...differences: any[]): void;
    getIsEmpty(): boolean;
    analizedType: any;
    differences: any;
}
export declare class InterfaceDifferAnalysis extends Shell {
    constructor();
    readonly analizedType: any;
    readonly analizedInterface: any;
    readonly differences: any;
}
export declare const InterfaceMemberType: Enumeration;
export declare class InterfaceMember extends Shell {
    constructor(name: any, memberType: any, type: any, attributes: any, isOptional: any);
    readonly name: any;
    readonly attributes: any;
    readonly isOptional: any;
}
export declare class InterfaceProperty extends InterfaceMember {
    constructor(name: any, type?: any, attributes?: any, isOptional?: boolean);
    readonly type: any;
}
export declare class InterfaceFunction extends InterfaceMember {
    constructor(name: any, attributes?: any, isOptional?: boolean);
}
export declare class InterfaceFunctionArgumentClosure extends Closure {
    initialize(name: any, argumentType: any, isOptional: any): void;
}
export declare const InterfaceFunctionArgumentType: Enumeration;
export declare class InterfaceFunctionArgument extends Shell {
    constructor(name: any, argumentType?: any, isOptional?: boolean);
}
export declare class Interface extends Shell {
    static extract(type: any): any;
    constructor(descriptorMap: any);
    readonly members: any;
}
export declare const MemberSelectionAttributes: Enumeration;
export declare const MemberSelectionType: Enumeration;
export declare class TypeClosure extends Closure {
    static getInstanceHasConstructor(instance: any): boolean;
    static createTypeFromClass(_class: any): Type;
    static createTypeFromInstance(instance: any): Type;
    instance: any;
    hasInstance: boolean;
    _class: any;
    hasClass: boolean;
    typeofResult: any;
    members: any;
    initialized: boolean;
    initializeWithInstance(instance: any): void;
    initializeWithClass(_class: any): void;
    checkInitializedStatus(): void;
    getName(): any;
    getOwnMembers(selectionType: any, selectionAttributes: any): Generator<any, void, unknown>;
    getMembers(selectionType: any, selectionAttributes: any): Generator<any, void, any>;
    getEffectiveValue(): any;
    equals(other: any): boolean;
    extends(other: any): boolean;
    equalsOrExtends(other: any): boolean;
    implements(_interface: any): boolean;
    _getParentClasses(_class: any): Generator<any, void, unknown>;
    getParentTypes(): Generator<any, void, any>;
    _getParentInstance(instance: any): any;
    _getParentClass(_class: any): any;
    getParentType(): Type;
}
export declare class Type extends Shell {
    static get(_class: any): Type;
    static of(instance: any): Type;
    constructor();
    readonly name: any;
    getOwnMembers(selectionType?: any, selectionAttributes?: any): any;
    getMembers(selectionType?: any, selectionAttributes?: any): any;
    getParentTypes(): any;
    getParentType(): any;
    implements(_interface: any): any;
    equals(other: any): any;
    equalsOrExtends(other: any): any;
    extends(other: any): any;
}
export declare const MemberAttributes: Enumeration;
export declare const MemberType: Enumeration;
export declare class Member extends Shell {
    constructor(name: any, type: any, parentType: any, memberType: any, attributes: any);
    isSame(other: any): any;
    readonly parentType: any;
    readonly memberType: any;
    readonly name: any;
    readonly attributes: any;
}
export declare class PropertyMember extends Member {
    constructor(name: any, type: any, parentType: any, attributes: any);
    readonly type: any;
    getValue(instance: any): any;
    setValue(instance: any, value: any): any;
}
export declare class StaticPropertyMember extends Member {
    constructor(name: any, type: any, parentType: any, attributes: any);
    readonly type: any;
    getValue(instance: any): any;
    setValue(instance: any, value: any): any;
}
export declare class FunctionMember extends Member {
    constructor(name: any, type: any, parentType: any, attributes: any);
    invoke(instance: any, ...args: any[]): any;
}
export declare class StaticFunctionMember extends Member {
    constructor(name: any, type: any, parentType: any, attributes: any);
    invoke(...args: any[]): any;
}

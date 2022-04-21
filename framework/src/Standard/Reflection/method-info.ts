import { MethodInfoBase, MemberType, Type, ParameterInfo } from "./index.js";

export class MethodInfo extends MethodInfoBase {
    constructor(name: string, declaringType: Type, parameters: ParameterInfo[], isStatic: boolean = false) {
        super(MemberType.Function, name, declaringType, parameters, isStatic);
    }
}
import { FunctionInfoBase, Type, ParameterInfo, MemberType } from "./index.js";

export class ConstructorInfo extends FunctionInfoBase {
    constructor(name: string, declaringType: Type, parameters: ParameterInfo[]) {
        super(MemberType.Constructor, name, declaringType, parameters);
    }
}
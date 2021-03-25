import { MemberInfo, MemberType } from "./index.js";

export class ParameterInfo extends MemberInfo {
    constructor(name: string) {
        super(MemberType.Parameter, name)
    }
}
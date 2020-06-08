import { MemberInfoMetadata } from "./~MemberInfoMetadata.js";
import { Class } from "./Types.js";
import { MemberInfo } from "./MemberInfo.js";
import { Type } from "./index.js";

export interface TypeMetadata extends MemberInfoMetadata {
    ctor: Class<any> | undefined;
    ctorAvailable: boolean;
    reference: any;
    referenceAvailable: boolean;
    members: MemberInfo[];
    membersEvaluated: boolean;
}
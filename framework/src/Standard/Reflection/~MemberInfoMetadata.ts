import { Flag } from "./Metadata/Flags/index.js";
import { Type } from "./Type.js";

export interface MemberInfoMetadata {
    declaringType: Type | null;
    reflectedType: Type;
    name: string;
    memberType: number;
    flags: Flag[];
}
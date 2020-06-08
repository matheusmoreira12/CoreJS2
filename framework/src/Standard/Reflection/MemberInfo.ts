import { Type } from "./index.js";
import { Flag, flags } from "./Metadata/Flags/index.js";
import { Class } from "./Types.js";
import { getMetadata } from "./~Storage.js";
import { InvalidOperationException } from "../Exceptions/index.js";

export class MemberInfo {
    getFlags<TFlag extends Flag = Flag>(flag?: Class<TFlag>): TFlag[] {
        const metadata = getMetadata(this._metadataToken);
        if (metadata) {
            if (flag === undefined)
                return <TFlag[]>[...metadata.flags];
            else
                return <TFlag[]>metadata.flags.filter(f => f.constructor === flag);
        }
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }

    protected _metadataToken: bigint = -1n;

    get declaringType(): Type {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.declaringType;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }

    get reflectedType(): Type {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.declaringType;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }

    get type(): Type {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.declaringType;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }

    get memberType(): number {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.memberType;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }

    get name(): string {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.name;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }
}
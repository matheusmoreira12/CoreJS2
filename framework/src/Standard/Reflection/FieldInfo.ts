import { MemberInfo } from "./MemberInfo.js";
import { getMetadata } from "./~Storage.js";
import { InvalidOperationException } from "../Exceptions/index.js";

export class FieldInfo extends MemberInfo {
    get attributes(): number {
        const metadata = getMetadata(this._metadataToken);
        if (metadata)
            return metadata.attributes;
        else
            throw new InvalidOperationException("Invalid MemberInfo instance.");
    }
}
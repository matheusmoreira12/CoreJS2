import { IdentifierGenerator } from "../../CoreBase/index.js";
import { MemberInfoMetadata } from "./~MemberInfoMetadata.js";

const storedMetadata: Map<bigint, MemberInfoMetadata> = new Map();

const metadataTokenGenerator = new IdentifierGenerator();

export function storeMetadata(metadata: MemberInfoMetadata): bigint {
    const token = metadataTokenGenerator.generate();
    storedMetadata.set(token, metadata);
    return token;
}

export function getMetadata(token: bigint): MemberInfoMetadata | undefined {
    return storedMetadata.get(token);
}
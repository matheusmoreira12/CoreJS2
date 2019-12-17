export declare class IdentifierGenerator {
    constructor(prefix: any);
    generate(): string;
    delete(id: any): boolean;
    private __usedNumbers;
    private __prefix;
}

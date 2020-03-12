import * as Base from "./Base";
import { Type } from "../Standard/Types/Type";
import { Interface } from "../Standard/Interfaces/index";
import { TypeDesignator } from "./Types";
import { NotSupportedException } from "../Standard/index";

function* resolveTypes(typeDesignators: Iterable<TypeDesignator>): Type | Interface {
    for (let type of typeDesignators) {
        if (type instanceof Type || type instanceof Interface)
            yield type;
        else if (type instanceof Function)
            yield Type.get(type);
        else
            throw new NotSupportedException("The specified type designator is not supported.");
    }
}

function valueTypeMatches(value: , typeDesignators: Iterable<TypeDesignator>): boolean {

}

export function assertParams(map: object, typeDesignators: Iterable<TypeDesignator>, mode: number = TypeValidationMode.Any) {
    switch ()
}
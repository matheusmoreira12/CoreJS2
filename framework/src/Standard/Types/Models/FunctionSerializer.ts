import { NotImplementedException } from "../../Exceptions";
import { FunctionModel } from "./FunctionModel";
import { StringReader } from "../../../CoreBase/Tokenifier";

export class FunctionSerializer {
    serialize(content: string): FunctionModel {
        content = content.replace(/\s/g, " ");

        const reader = new StringReader(content);
        return reader;
    }
}
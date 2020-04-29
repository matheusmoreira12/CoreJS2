import { ObservableCollection } from "../../Standard/Collections/index.js";
import { assertParams, assert } from "../../Validation/index.js";
import { MarkupAttribute } from "./MarkupAttribute.js";
import { KeyNotFoundException } from "../../Standard/Exceptions/index.js"
import { ObjectUtils } from "../../CoreBase/Utils/index.js";

export class MarkupAttributeCollection extends ObservableCollection<MarkupAttribute> {
    has(name: string): boolean {
        assertParams({ name }, [String]);

        return this.findIndex(a => String(a.name) === name) != -1;
    }

    get(name: string): MarkupAttribute {
        assertParams({ name }, [String]);

        const result = this.find(a => String(a.name) === name);
        if (result)
            return result;
        else
            throw new KeyNotFoundException();
    }

    set(name: string, value: string = ObjectUtils.getDefault(String)): MarkupAttribute {
        assertParams({ name }, [String]);

        if (this.has(name)) {
            const attribute = this.get(name);
            attribute.value = value;
            return attribute;
        }
        else {
            const attribute = new MarkupAttribute(name, value);
            this.add(attribute);
            return attribute;
        }
    }

    delete(name: string): MarkupAttribute {
        assertParams({ name }, [String]);

        const attribute = this.get(name);
        this.remove(attribute);
        return attribute;
    }

    setMany(map: { [name: string]: string }) {
        assertParams({ map }, [Object]);

        for (let name in map) {
            const value = map[name];

            assert({ name, value }, [String, null]);

            this.set(name, value);
        }
    }
}
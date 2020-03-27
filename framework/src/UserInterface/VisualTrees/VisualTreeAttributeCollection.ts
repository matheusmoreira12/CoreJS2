import { ObservableCollection } from "../../Standard/Collections/index";
import { assertParams, assert } from "../../Validation/index";
import { VisualTreeAttribute } from "./VisualTreeAttribute";
import { KeyNotFoundException } from "../../Standard/index";
import { ObjectUtils } from "../../CoreBase/Utils/index";

export class VisualTreeAttributeCollection extends ObservableCollection<VisualTreeAttribute> {
    has(qualifiedName: string, namespaceURI: string | null = null): boolean {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        return this.findIndex(a => a.qualifiedName === qualifiedName && a.namespaceURI === namespaceURI) != -1;
    }

    get(qualifiedName: string, namespaceURI: string | null = null): VisualTreeAttribute {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        const result = this.find(a => a.qualifiedName === qualifiedName && a.namespaceURI === namespaceURI);
        if (result)
            return result;
        else
            throw new KeyNotFoundException();
    }

    set(qualifiedName: string, namespaceURI: string | null = null, value: string = ObjectUtils.getDefault(String)): VisualTreeAttribute {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI, value }, [String, null]);

        if (this.has(qualifiedName, namespaceURI)) {
            const attribute = this.get(qualifiedName, namespaceURI);
            attribute.value = value;
            return attribute;
        }
        else {
            const attribute = new VisualTreeAttribute(qualifiedName, namespaceURI, value);
            this.add(attribute);
            return attribute;
        }
    }

    delete(qualifiedName: string, namespaceURI: string | null = null): VisualTreeAttribute {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        const attribute = this.get(qualifiedName, namespaceURI);
        this.remove(attribute);
        return attribute;
    }

    setMany(map: { [qualifiedName: string]: string }, namespaceURI: string | null = ObjectUtils.getDefault(String)) {
        assertParams({ map }, [Object]);

        for (let qualifiedName in map) {
            const value = map[qualifiedName];

            assert({ qualifiedName, value }, [String, null]);

            this.set(qualifiedName, namespaceURI, value);
        }
    }
}
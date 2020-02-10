import { ObservableCollection } from "../../Standard/Collections/index";
import { assertParams, assert } from "../../Validation/index";
import { VisualTreeAttribute } from "./VisualTreeAttribute";
import { KeyNotFoundException, InvalidOperationException } from "../../Standard/index";

export class VisualTreeAttributeCollection extends ObservableCollection<VisualTreeAttribute> {
    has(qualifiedName: string, namespaceURI: string | null = null): boolean {
        assertParams({ qualifiedName }, String);
        assertParams({ namespaceURI }, String, null);

        return !!this.find(a => a.qualifiedName === qualifiedName && a.namespaceURI === namespaceURI);
    }

    get(qualifiedName: string, namespaceURI: string | null = null): VisualTreeAttribute {
        assertParams({ qualifiedName }, String);
        assertParams({ namespaceURI }, String, null);

        const result = this.find(a => a.qualifiedName === qualifiedName && a.namespaceURI === namespaceURI);
        if (!result)
            throw new KeyNotFoundException();
        return result;
    }

    create(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string) {
        assertParams({ qualifiedName }, String);
        assertParams({ namespaceURI }, String, null);
        assertParams({ initialValue }, String, undefined);

        if (this.has(qualifiedName, namespaceURI))
            throw new InvalidOperationException("Cannot create attribute. An attribute with the specified name already exists in the same namespace.");

        const attribute = VisualTreeAttribute.create(qualifiedName, namespaceURI, initialValue);
        this.add(attribute);
        return attribute;
    }

    createMultiple(map: { [qualifiedName: string]: string | null }, namespaceURI: string | null = null) {
        assertParams({ map }, Object);

        for (let qualifiedName in map) {
            const initialValue = map[qualifiedName];

            assert({ qualifiedName }, String);
            assert({ initialValue }, String, null);

            if (initialValue === null)
                this.create(qualifiedName, namespaceURI);
            else
                this.create(qualifiedName, namespaceURI, initialValue);
        }
    }
}
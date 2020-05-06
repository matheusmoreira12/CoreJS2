import { DependencyObject, DependencyProperty } from "../../UserInterface/DependencyObjects/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js";

export class DataContract extends DependencyObject {
    update(data: object) {
        const properties = DependencyProperty.GetAll(this);
    }
}
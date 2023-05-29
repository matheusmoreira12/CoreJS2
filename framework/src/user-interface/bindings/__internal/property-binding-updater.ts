import { PropertyChangeEventArgs } from "../../../standard/dependency-objects/index.js";
import { PropertyBinding } from "../index.js";
import { BindingUpdater } from "./binding-updater.js";

export class PropertyBindingUpdater extends BindingUpdater {
    constructor(binding: PropertyBinding) {
        super(binding);

        binding.source.PropertyChangeEvent.attach(PropertyBindingUpdater.#source_OnPropertyChange);
        binding.target.PropertyChangeEvent.attach(PropertyBindingUpdater.#target_OnPropertyChange);
    }

    static #source_OnPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
    }

    static #target_OnPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
    }
}
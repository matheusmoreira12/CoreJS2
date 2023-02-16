import { ObservableCollection, ObservableCollectionChangeAction, ObservableCollectionChangeArgs } from "../../standard/collections/index.js";
import { DependencyObject, DependencyProperty, PropertyChangeEventArgs } from "../../standard/dependency-objects/index.js";
import { Enumeration } from "../../standard/index.js";
import { DeferredTask } from "../../standard/timing/index.js";
import { assertParams } from "../../validation/index.js";
import { IMultiConverter } from "../value-converters/index.js";
import { BindingDirection } from "./index.js";

export class ListBinding {
    constructor(direction: number = BindingDirection.Both, source: DependencyObject, sourceListProperty: DependencyProperty, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, converter: IMultiConverter) {
        assertParams({ direction }, [Number]);
        assertParams({ source }, [DependencyObject]);
        assertParams({ sourceListProperty, sourceProperty }, [DependencyProperty]);
        assertParams({ target }, [DependencyObject]);
        assertParams({ targetProperty }, [DependencyProperty]);
        assertParams({ converter }, [IMultiConverter]);

        this.#direction = direction;
        this.#source = source;
        this.#sourceListProperty = sourceListProperty;
        this.#sourceProperty = sourceProperty;
        this.#target = target;
        this.#targetProperty = targetProperty;
        this.#converter = converter;

        this.#doInitialSetup();
    }

    #doInitialSetup() {
        this.#listenListPropertyChanges();

        const sourceList = this.#sourceList;
        this.#listenListChangeEvent(sourceList)
        this.#listenItemsPropertyChangeEvent(sourceList);

        this.#target.PropertyChangeEvent.attach(this.#target_onPropertyChange);

        if (this.#canUpdateTarget)
            this.#updateTarget();
        if (this.#canUpdateSource)
            this.#updateSource();
    }

    #listenListPropertyChanges() {
        this.#source.PropertyChangeEvent.attach(this.#source_onPropertyChange);
    }

    #source_onPropertyChange = (_sender: any, args: PropertyChangeEventArgs) => {
        if (args.property === this.#sourceListProperty) {
            this.#listenListChangeEvent(args.newValue);
            this.#unlistenListChangeEvent(args.oldValue);
        }
    }

    #unlistenListChangeEvent(list: ObservableCollection<DependencyObject>) {
        list.ChangeEvent.detach(this.#sourceList_onChange);
    }

    #listenListChangeEvent(list: ObservableCollection<DependencyObject>) {
        list.ChangeEvent.attach(this.#sourceList_onChange);
    }

    #sourceList_onChange = (_sender: any, args: ObservableCollectionChangeArgs<DependencyObject>) => {
        switch (args.action) {
            case ObservableCollectionChangeAction.Add:
                this.#listenItemsPropertyChangeEvent(args.newItems);
                break;
            case ObservableCollectionChangeAction.Remove:
                this.#unlistenItemsPropertyChangeEvent(args.oldItems);
                break;
        }

        this.#updateTarget();
    }

    #listenItemsPropertyChangeEvent(newItems: DependencyObject[]) {
        for (let item of newItems)
            item.PropertyChangeEvent.attach(this.#sourceItem_onPropertyChange);
    }

    #unlistenItemsPropertyChangeEvent(oldItems: DependencyObject[]) {
        for (let item of oldItems)
            item.PropertyChangeEvent.detach(this.#sourceItem_onPropertyChange);
    }

    #sourceItem_onPropertyChange = (_sender: any, args: PropertyChangeEventArgs) => {
        if (args.property === this.#sourceProperty)
            this.#updateTarget_deferredTask.trigger();
    }

    #updateTarget = () => {
        const sourceList = this.#sourceList;
        const inputValues = sourceList.map(item => item.get(this.#sourceProperty));
        const outputValue = this.transformer.convert(inputValues);
        this.target.set(this.targetProperty, outputValue);
    }

    #target_onPropertyChange = (_sender: any, args: PropertyChangeEventArgs) => {
        if (args.property === this.#targetProperty) {
            if (this.#canUpdateSource)
                this.#updateSource_deferredTask.trigger();
        }
    }

    #updateSource = () => {
        const inputValue = this.#target.get(this.#targetProperty);
        const outputValues = this.#converter.convertBack(inputValue);
        const sourceList = this.#sourceList;
        outputValues.forEach((value, index) => sourceList[index].set(this.#sourceProperty, value));
    }

    get #sourceList() {
        return this.#source.get(this.#sourceListProperty) as ObservableCollection<DependencyObject>;
    }

    get #canUpdateTarget() {
        return Enumeration.contains(BindingDirection.ToTarget, this.#direction);
    }

    get #canUpdateSource() {
        return Enumeration.contains(BindingDirection.ToSource, this.#direction);
    }

    get direction(): number { return this.#direction; }
    #direction: number;

    get source(): DependencyObject { return this.#source; }
    #source: DependencyObject;

    get sourceListProperty(): DependencyProperty { return this.#sourceListProperty; }
    #sourceListProperty: DependencyProperty;

    get sourceProperty(): DependencyProperty { return this.#sourceProperty; }
    #sourceProperty: DependencyProperty;

    get target(): DependencyObject { return this.#target; }
    #target: DependencyObject;

    get targetProperty(): DependencyProperty { return this.#targetProperty; }
    #targetProperty: DependencyProperty;

    get transformer(): IMultiConverter { return this.#converter; }
    #converter: IMultiConverter;

    #updateTarget_deferredTask = new DeferredTask(this.#updateTarget);

    #updateSource_deferredTask = new DeferredTask(this.#updateSource);
}
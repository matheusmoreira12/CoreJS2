export module __Factory {
    export function createFieldGetter(name: string): () => any {
        return new Function(`return function __get_${name}() { return this["${name}"]; };`)() as () => any;
    }

    export function createFieldSetter(name: string): (value: any) => void {
        return new Function(`return function __set_${name}() { return this["${name}"]; };`)() as (value: any) => void;
    }
}
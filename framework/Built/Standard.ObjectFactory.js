export const ObjectFactory = {
    createEmptyClass(name) {
        let classFactory = new Function(`return class ${name} {};`);
        return classFactory();
    }
};

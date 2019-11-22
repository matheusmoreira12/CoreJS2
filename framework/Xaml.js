import { Module, ModuleMemberType } from "./Modules";

Module.create("Core::Xaml", function () {
    this.export("Test", ModuleMemberType.Class);
}, function () {
    this["Test"] = class Test {

    }
});
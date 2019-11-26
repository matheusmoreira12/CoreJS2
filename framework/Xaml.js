import { Module, ModuleMemberType } from "./Modules";

Module.declare("Core::Xaml", function (context) {
    class Test {

    }
    context.export({ Test });
});
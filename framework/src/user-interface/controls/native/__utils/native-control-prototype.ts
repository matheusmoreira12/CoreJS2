import { NativeControlBase, NativeEvents, Properties } from "./index";

export type NativeControlPrototype<T extends typeof Element> = Properties<T> & NativeEvents<T> & NativeControlBase;

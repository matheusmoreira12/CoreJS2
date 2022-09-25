import { NativeControlBase } from "./native-control-base";
import { NativeEvents } from "./native-events";
import { Properties } from "./properties";

export type NativeControlPrototype<T extends typeof Element> = Properties<T> & NativeEvents<T> & NativeControlBase;

import { Guid } from "./index.js";

export namespace __Generator {
    export function create(): Guid {
        return new Guid(new Uint8Array([...getTimestampAndVersionBytes(), ...getClockSequenceAndReservedBytes(), ...getNodeBytes()]));

        function getTimestampAndVersionBytes() {
            const randomBytes = crypto.getRandomValues(new Uint8Array(8));
            return new Uint8Array([
                ...randomBytes.slice(0, 6),
                VERSION << 4 | randomBytes[6] & 0x1111,
                ...randomBytes.slice(7),
            ]);
        }

        function getClockSequenceAndReservedBytes() {
            const randomBytes = crypto.getRandomValues(new Uint8Array(2));
            return new Uint8Array([VARIANT << 5 | randomBytes[0] & 0x11111, randomBytes[1]]);
        }

        function getNodeBytes() {
            return new Uint8Array(6);
        }
    }
}

const VERSION = 4;
const VARIANT = 0b100;
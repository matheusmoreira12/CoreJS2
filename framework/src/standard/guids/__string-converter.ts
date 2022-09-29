import { ArrayUtils } from "../../core-base/utils/index.js";
import { FormatException } from "../exceptions/index.js";
import { OutputArgument } from "../reflection/types.js";
import { StringReader } from "../strings/string-reader.js";
import { Guid } from "./index.js";

export namespace __StringConverter {
    export function convertGuidToString(guid: Guid, format: string): string {
        const bytes: number[] = Array.from(guid.buffer);
        switch (format) {
            case "N":
                return bstfs(bytes, N_MASK);
            case null:
            case "":
            case "D":
                return bstfs(bytes, D_MASK);
            case "B":
                return bstfs(bytes, B_MASK);
            case "P":
                return bstfs(bytes, P_MASK);
            case "X":
                return bstfs(bytes, X_MASK);
            default:
                throw new FormatException("N, D, B, P, X");
        }

        function bstfs(bs: number[], m: string): string {
            return fs(bsts(bs), m);

            function fs(s: string, m: string) {
                let rs = "";
                const msr = new StringReader(m);
                const si = s[Symbol.iterator]();
                while (!msr.isEOF) {
                    const co = msr.read();
                    if (co != "0" || msr.peek() == "x") {
                        rs += co!;
                        continue;
                    }
                    const sir = si.next();
                    rs += sir.value;
                }
                if(si.return)
                    si.return();
                return rs;
            }

            function bsts(bs: number[]): string {
                return bs.map(b => b.toString(16).padStart(2, "0")).join("");
            }
        }
    }

    export function tryConvertStringToGuid(str: string, outGuid: OutputArgument<Guid>): boolean {
        const obs: OutputArgument<number[]> = {};
        if (!tfstbs(str, N_MASK, obs) &&
            !tfstbs(str, D_MASK, obs) &&
            !tfstbs(str, P_MASK, obs) &&
            !tfstbs(str, B_MASK, obs) &&
            !tfstbs(str, X_MASK, obs))
            return false;
        outGuid.value = new Guid(new Uint8Array(obs.value!));
        return true;

        function tfstbs(s: string, m: string, ob: OutputArgument<number[]>): boolean {
            const ous: OutputArgument<string> = {};
            if (!tus(s, m, ous))
                return false;
            ob.value = stbs(ous.value!);
            return true;

            function tus(s: string, m: string, ous: OutputArgument<string>): boolean {
                let us = "";
                const msr = new StringReader(m);
                const si = s[Symbol.iterator]();
                while (!msr.isEOF) {
                    const sir = si.next();
                    if (sir.done)
                        return false;
                    const co = msr.read();
                    if (co != "0" || msr.peek() == "x")
                        continue;
                    if (!sir.value!.match(/[0-9a-f]/))
                        return false;
                    us += sir.value;
                }
                if (si.return)
                    si.return();
                ous.value = us;
                return true;
            }

            function stbs(s: string): number[] {
                return Array.from(ArrayUtils.selectChunks(s, 2, c => Number.parseInt(c.join(""), 16)));
            }
        }
    }
}

const N_MASK = "0".repeat(32);

const D_MASK = [8, 4, 4, 4, 12].map(l => "0".repeat(l)).join("-");

const P_MASK = `(${D_MASK})`;

const B_MASK = `{${D_MASK}}`;

const X_MASK = `{${[8, 4, 4, [2, 2, 2, 2, 2, 2, 2, 2]].flatMap(l => typeof l == "number" ? "0x" + "0".repeat(l) : `{${l.map(m => "0x" + "0".repeat(m))}}`)}}`;
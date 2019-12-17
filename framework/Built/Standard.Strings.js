var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Module.declare("Core::Strings", function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const StringUtils = {};
        context.export({ StringUtils });
        class RegExpXContext {
            constructor() {
                this.namedPatterns = new Dictionary();
                return Object.freeze(this);
            }
            derive() {
                let result = new RegExpXContext();
                result.addMultiple(this.namedPatterns);
                return result;
            }
            declareNamedPattern(name, pattern) {
                if (this.namedPatterns.has(name))
                    return false;
                this.namedPatterns.set(name, pattern);
                return true;
            }
            deleteNamedPattern(name) {
                return this.namedPatterns.delete(name);
            }
            createRegExpX(pattern, flags = "") {
                let result = new RegExpX(pattern, flags, this);
                return result;
            }
        }
        context.export({ RegExpXContext });
        function computeFinalPattern(pattern, context) {
            function replaceEscapedPattern(match) {
                const name = match.slice(1, match.length - 1); //Performatically extract name from escaped string
                let pattern = context.namedPatterns.get(name);
                if (pattern === undefined)
                    throw new IndexOutOfRangeException(`No declared named pattern matches name "${name}".`);
                return pattern;
            }
            if (context === null)
                return pattern;
            pattern = pattern.replace(/(?<!\$)\$[A-Za-z]\w*?;/g, replaceEscapedPattern);
            pattern = pattern.replace(/\${2}/g, "$");
            return pattern;
        }
        class RegExpX extends RegExp {
            constructor(pattern, flags = "", context = null) {
                if (context !== null && !(context instanceof RegExpXContext))
                    throw new ArgumentTypeException("context", Type.of(context), Type.get(RegExpXContext));
                const finalPattern = computeFinalPattern(pattern, context);
                super(finalPattern, flags);
                this.context = context;
            }
        }
        context.export({ RegExpX });
    });
});

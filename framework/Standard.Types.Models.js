import { Closure, Shell } from "./Standard.Closures.js";
import { FormatException, ArgumentTypeException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";

function treatString(str) {
    str = str.replace("\n", " ");
    str = str.replace(/\w\w+/, " ");

    return str;
}

function getWholeRegex(pattern) {
    return new RegExp(`^${pattern}$`);
}

const IDENTIFIER_PATTERN = "[A-Za-z_$]\\w*";
const ANY_VALUE_PATTERN = ".*?";
const DECIMAL_VALUE_PATTERN = `\\d+`;
const STRING_VALUE_PATTERN = `(\"${ANY_VALUE_PATTERN}\"|\'${ANY_VALUE_PATTERN}\')`;
const OBJ_VALUE_PATTERN = `{.*?}`;
const ARRAY_VALUE_PATTERN = `\\[.*?\\]`;
const LITERAL_VALUE_PATTERN = `(${IDENTIFIER_PATTERN}|${STRING_VALUE_PATTERN}|${DECIMAL_VALUE_PATTERN}|${OBJ_VALUE_PATTERN}|${ARRAY_VALUE_PATTERN})`;
const WHITESPACE_PATTERN = "\\s*";
const SEPARATOR_PATTERN = "\\s*,\\s*";
const ASSIGNMENT_PATTERN = `${WHITESPACE_PATTERN}=${WHITESPACE_PATTERN}`;

const DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN = `(?<argumentName>${IDENTIFIER_PATTERN})(${ASSIGNMENT_PATTERN}(?<argumentDefaultValue>${LITERAL_VALUE_PATTERN}))?`;

class DestructuringExpressionArgumentClosure extends Closure {
    static parseFromString(value) {
        value = treatString(value);

        let matches = getWholeRegex(DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN).exec(value);
        let name = null;
        let defaultValue = undefined;

        if (matches) {
            name = matches.groups["argumentName"];

            let defaultValueStr = matches.groups["argumentDefaultValue"];
            if (defaultValueStr)
                defaultValue = eval(defaultValueStr);

            return new DestructuringExpressionArgument(name, defaultValue);
        }

        throw new FormatException("argumentName[ = defaultValue]", value);
    }

    initialize(name, defaultValue) {
        this.name = name;
        this.defaultValue = defaultValue;
    }
}

export class DestructuringExpressionArgument extends Shell {
    static parse(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        return DestructuringExpressionArgumentClosure.parseFromString(value);
    }

    constructor(name, defaultValue) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("name", Type.of(name), Type.get(String));

        super(DestructuringExpressionArgumentClosure, name, defaultValue);
    }

    get name() {
        return Closure.doIfExists(this, c => c.name);
    }

    get defaultValue() {
        return Closure.doIfExists(this, c => c.defaultValue);
    }
}

const OPTIONAL_SEPARATOR_PATTERN = `(${SEPARATOR_PATTERN})?`;
const ARRAY_DESTRUCTURING_EXPRESSION_PATTERN = `\\[(?<destructuringExpArgs>(${DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN}${OPTIONAL_SEPARATOR_PATTERN})+)\\]`;
const OBJ_DESTRUCTURING_EXPRESSION_PATTERN = `{(?<destructuringExpArgs>(${DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN}${OPTIONAL_SEPARATOR_PATTERN})+)}`;

class DestructuringExpressionClosure extends Closure {
    static parseFromString(value) {
        value = treatString(value);

        function* parseArguments(argumentsStr) {
            const SEPARATOR_REGEX = new RegExp(SEPARATOR_PATTERN);

            const argumentStrs = argumentsStr.split(SEPARATOR_REGEX);
            for (let argumentStr of argumentStrs)
                yield DestructuringExpressionArgument.parse(argumentStr);
        }

        function parseDefaultValue(defaultValueStr) {
            if (defaultValueStr)
                return eval(defaultValueStr);

            return undefined;
        }

        function parseArrayDestructuringExpression() {
            const matches = getWholeRegex(ARRAY_DESTRUCTURING_EXPRESSION_PATTERN).exec(value);

            if (matches) {
                const argumentsStr = matches.groups["destructuringExpArgs"];
                _arguments = [...parseArguments(argumentsStr)];

                const defaultValueStr = matches.groups["destructuringExpDefVal"];
                defaultValue = parseDefaultValue(defaultValueStr);

                return true;
            }

            return false;
        }

        function parseObjectDestructuringExpression() {
            const matches = getWholeRegex(OBJ_DESTRUCTURING_EXPRESSION_PATTERN).exec(value);

            if (matches) {
                const argumentsStr = matches.groups["destructuringExpArgs"];
                _arguments = [...parseArguments(argumentsStr)];

                const defaultValueStr = matches.groups["destructuringExpDefVal"];
                defaultValue = parseDefaultValue(defaultValueStr);

                return true;
            }

            return false;
        }

        let _arguments = null,
            defaultValue = null;

        if (parseArrayDestructuringExpression())
            return new DestructuringExpression(DestructuringExpressionType.Array, _arguments, defaultValue);
        else if (parseObjectDestructuringExpression())
            return new DestructuringExpression(DestructuringExpressionType.Object, _arguments, defaultValue);

        throw new FormatException("\"{\"[parameter: name[ = defaultValue]][, ...parameter]\"}\"|" +
            "\"[\"[parameter: name[ = defaultValue]][, ...parameter]\"]\"", value);
    }

    initialize(type, _arguments, defaultValue) {
        this.type = type;
        this.arguments = _arguments;
        this.defaultValue = defaultValue;
    }
}

export const DestructuringExpressionType = new Enumeration([
    "Array",
    "Object"
]);

export class DestructuringExpression extends Shell {
    static parse(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        return DestructuringExpressionClosure.parseFromString(value);
    }

    constructor(type, _arguments, defaultValue) {
        super(DestructuringExpressionClosure, type, _arguments, defaultValue);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }

    get arguments() {
        return Closure.doIfExists(this, c => c.arguments);
    }

    get defaultValue() {
        return Closure.doIfExists(this, c => c.defaultValue);
    }
}

const FUNCTION_SIMPLE_ARGUMENT_PATTERN = `^(?<name>${IDENTIFIER_PATTERN})$`;
const SPREAD_PATTERN = "\\.\\.\\.";
const FUNCTION_SPREAD_ARGUMENT_PATTERN = `^${SPREAD_PATTERN}(?<name>${IDENTIFIER_PATTERN})$`;
const FUNCTION_DESTRUCTURING_ARGUMENT_PATTERN = `((?<argumentDestructuringPattern>${ARRAY_DESTRUCTURING_EXPRESSION_PATTERN})` +
    `(${ASSIGNMENT_PATTERN}(<parameterDefaultValue>${ARRAY_VALUE_PATTERN}))?|((?<argumentDestructuringPattern>${OBJ_DESTRUCTURING_EXPRESSION_PATTERN})` +
    `(${ASSIGNMENT_PATTERN}(<parameterDefaultValue>${OBJ_VALUE_PATTERN}))?`;
    
    export const FunctionParameterType = new Enumeration([
        "Simple",
        "Destructuring",
        "Spread"
    ]);
    
class FunctionParameterModelClosure extends Closure {
    initialize(name, parameterType, defaultValue, destructuringExpression) {
        this.name = name;
        this.parameterType = parameterType;
        this.defaultValue = defaultValue;
        this.destructuringExpression = destructuringExpression;
    }
}

export class FunctionParameterModel extends Shell {
    static parse(value) {
        if (typeof value !== "string")
            throw ParameterTypeException("value", Type.of(value), Type.get(String));

        return FunctionParameterModelClosure.parseFromString(value);
    }

    constructor(name, parameterType, defaultValue, destructuringExpression) {
        if (name !== null && typeof name !== "string")
            throw ParameterTypeException("name", Type.of(name), Type.get(String));
        if (typeof parameterType !== "number")
            throw ParameterTypeException("parameterType", Type.of(parameterType), Type.get(Number));
        if (destructuringExpression !== null && !(destructuringExpression instanceof DestructuringExpression))
            throw ParameterTypeException("destructuringExpression", Type.of(destructuringExpression), Type.get(DestructuringExpression));

        super(FunctionParameterModelClosure, name, parameterType, defaultValue, destructuringExpression);
    }

    toString() {
        return Closure.doIfExists(this, c => c.convertToString());
    }

    get name() {
        return Closure.doIfExists(this, c => c.name);
    }

    get parameterType() {
        return Closure.doIfExists(this, c => c.parameterType);
    }

    get defaultValue() {
        return Closure.doIfExists(this, c => c.defaultValue);
    }
}

export class FunctionSimpleParameterModel extends FunctionParameterModel {
    constructor(name, defaultValue) {
        super(name, FunctionParameterType.Simple, defaultValue, null);
    }
}

export class FunctionSpreadParameterModel extends FunctionParameterModel {
    constructor(name) {
        super(name, FunctionParameterType.Spread, [], null);
    }
}

export class FunctionDestructuringParameterModel extends FunctionParameterModel {
    constructor(destructuringExpression, defaultValue) {
        super(null, FunctionParameterType.Destructuring, defaultValue, destructuringExpression);
    }
}

const FUNCTION_PATTERN = `^(function${WHITESPACE_PATTERN})?(?<name>${IDENTIFIER_PATTERN})${WHITESPACE_PATTERN}\\((?<parameters>${ANY_VALUE_PATTERN})\\)${WHITESPACE_PATTERN}{(?<body>${ANY_VALUE_PATTERN})}$`;

class FunctionModelClosure extends Closure {
    static parseFromString(value) {
        function treatFunctionString(functionstr) {
            const REDUNDANT_WHITESPACE_REGEX = /\s\s+/g;

            functionStr = functionStr.replace("\n", " ");
            functionStr = functionStr.replace(REDUNDANT_WHITESPACE_REGEX, " ");

            return functionStr;
        }

        function parseFunction() {
            function* parseFunctionParameters(parametersStr) {
                const SEPARATOR_REGEX = new RegExp(SEPARATOR_PATTERN);

                if (!parametersStr) return;

                const parameterStrs = parametersStr.split(SEPARATOR_REGEX);
                for (let parameterStr of parameterStrs)
                    yield FunctionParameter.parse(parameterStr);
            }

            function parseFunctionBody(bodyStr) {
                if (bodyStr.match("native"))
                    return null;

                return bodyStr;
            }

            const treatedFunctionStr = treatFunctionString(value);

            let matches = new RegExp(FUNCTION_PATTERN).exec(treatedFunctionStr);
            if (matches) {
                const parametersStr = matches.groups["parameters"];
                _parameters = [...parseFunctionParameters(parametersStr)];

                const bodyStr = matches.groups["body"];
                body = parseFunctionBody(bodyStr);
            }
        }

        let _parameters = null,
            body = null;

        if (parseFunction)
            return new FunctionModel(name, _parameters, body);

        throw new FormatException("[\"function\"] functionName([parameter][, ...parameters])", value);
    }
}

export class FunctionModel extends Shell {
    static parse(value) {
        if (typeof value !== "string")
            throw ParameterTypeException("value", Type.of(value), Type.get(String));

        FunctionModelClosure.parseFromString(value);
    }

    constructor(name, [_parameters], body) {
        super(FunctionModelClosure, name, _parameters, body);
    }

    getInvokable() {
        return Closure.doIfExists(this, c => c.getInvokable());
    }

    get parameters() {
        return Closure.doIfExists(this, c => c._parameters);
    }
}
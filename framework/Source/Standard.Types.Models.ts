import { Closure, Shell } from "./Standard.Closures.js";
import { FormatException, ArgumentTypeException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";

function treatString(str) {
    str = str.replace("\n", " ");
    str = str.replace(/\s\s+/g, " ");

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
    initialize(name, defaultValue) {
        this.name = name;
        this.defaultValue = defaultValue;
    }
}

export class DestructuringExpressionArgument extends Shell {
    static parse(value) {
        value = treatString(value);

        const matches = getWholeRegex(DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN).exec(value);

        if (matches) {
            const name = matches.groups["argumentName"];

            const defaultValueStr = matches.groups["argumentDefaultValue"];
            const defaultValue = eval(defaultValueStr);

            return new DestructuringExpressionArgument(name, defaultValue);
        }

        throw new FormatException("argumentName[ = defaultValue]", value);
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
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

class DestructuringExpressionClosure extends Closure {
    initialize(type, ..._arguments) {
        this.type = type;
        this.arguments = _arguments;
    }
}

export const DestructuringExpressionType = new Enumeration([
    "Array",
    "Object"
]);

const OPTIONAL_SEPARATOR_PATTERN = `(${SEPARATOR_PATTERN})?`;

export class DestructuringExpression extends Shell {
    static * parseArguments(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        const argumentStrs = value.split(new RegExp(SEPARATOR_PATTERN, "g"));
        for (let argumentStr of argumentStrs)
            yield DestructuringExpressionArgument.parse(argumentStr);
    }

    static parse(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        let outputObj = {};
        if (ArrayDestructuringExpression.tryParse(value, outputObj) ||
            ObjectDestructuringExpression.tryParse(value, outputObj))
            return outputObj.result;

        throw new FormatException(`"{"[parameter: name[ "=" defaultValue]][, ...parameter]"}" | "["[parameter: name[ "=" defaultValue]][, ...parameter]"]"`, value);
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(type, ..._arguments) {
        super(DestructuringExpressionClosure, type, ..._arguments);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }

    get arguments() {
        return Closure.doIfExists(this, c => c.arguments);
    }
}

const ARRAY_DESTRUCTURING_EXPRESSION_PATTERN = `\\[(?<arrDestructExpArgs>(${DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN}${OPTIONAL_SEPARATOR_PATTERN})+)\\]`;

export class ArrayDestructuringExpression extends DestructuringExpression {
    static parse(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        const matches = getWholeRegex(ARRAY_DESTRUCTURING_EXPRESSION_PATTERN).exec(value);
        if (matches) {
            const argumentsStr = matches.groups["arrDestructExpArgs"];
            if (argumentsStr)
                return new ArrayDestructuringExpression(...this.parseArguments(argumentsStr));
            else
                return new ArrayDestructuringExpression();
        }

        throw new FormatException(`"["[parameter: name[ "=" defaultValue]][, ...parameter]"]"`, "value");
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(..._arguments) {
        super(DestructuringExpressionType.Array, ..._arguments);
    }
}

const OBJ_DESTRUCTURING_EXPRESSION_PATTERN = `{(?<objDestructExpArgs>(${DESTRUCTURING_EXPRESSION_ARGUMENT_PATTERN}${OPTIONAL_SEPARATOR_PATTERN})+)}`;

export class ObjectDestructuringExpression extends DestructuringExpression {
    static parse(value) {
        if (typeof name !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        const matches = getWholeRegex(OBJ_DESTRUCTURING_EXPRESSION_PATTERN).exec(value);
        if (matches) {
            const argumentsStr = matches.groups["objDestructExpArgs"];
            if (argumentsStr)
                return new ObjectDestructuringExpression(...this.parseArguments(argumentsStr));
            else
                return new ObjectDestructuringExpression();
        }

        throw new FormatException(`"{"[parameter: name[ "=" defaultValue]][, ...parameter]"}"`, "value");
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(..._arguments) {
        super(DestructuringExpressionType.Array, ..._arguments);
    }
}

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
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        let outputObj = {};

        if (FunctionSimpleParameterModel.tryParse(value, outputObj) ||
            FunctionSpreadParameterModel.tryParse(value, outputObj) ||
            FunctionDestructuringParameterModel.tryParse(value, outputObj))
            return outputObj.result;

        throw new FormatException(`argumentName[ "=" argumentValue] | "..."argumentName | "{"[parameter: parameterName "=" parameterDefaultValue]["," ...parameters]"}"[ "=" defaultValue] | "["[parameter: parameterName "=" parameterDefaultValue]["," ...parameters]"]"[ "=" defaultValue]`, value);
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(name, parameterType, defaultValue, destructuringExpression) {
        if (name !== null && typeof name !== "string")
            throw new ArgumentTypeException("name", Type.of(name), Type.get(String));
        if (typeof parameterType !== "number")
            throw new ArgumentTypeException("parameterType", Type.of(parameterType), Type.get(Number));
        if (destructuringExpression !== null && !(destructuringExpression instanceof DestructuringExpression))
            throw new ArgumentTypeException("destructuringExpression", Type.of(destructuringExpression), Type.get(DestructuringExpression));

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

const FUNCTION_SIMPLE_PARAMETER_PATTERN = `(?<simpleParamName>${IDENTIFIER_PATTERN})(${ASSIGNMENT_PATTERN}(?<simpleParamDefVal>${LITERAL_VALUE_PATTERN}))?`;

export class FunctionSimpleParameterModel extends FunctionParameterModel {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        let matches = getWholeRegex(FUNCTION_SIMPLE_PARAMETER_PATTERN).exec(value);
        if (matches) {
            const name = matches.groups["simpleParamName"];

            const defaultValueStr = matches.groups["simpleParamDefVal"];
            const defaultValue = eval(defaultValueStr);

            return new FunctionSimpleParameterModel(name, defaultValue);
        }

        throw new FormatException(`name[ "=" defaultValue]`, value);
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(name, defaultValue) {
        super(name, FunctionParameterType.Simple, defaultValue, null);
    }
}

const SPREAD_PATTERN = "\\.\\.\\.";
const FUNCTION_SPREAD_PARAMETER_PATTERN = `^${SPREAD_PATTERN}(?<spreadParamName>${IDENTIFIER_PATTERN})$`;

export class FunctionSpreadParameterModel extends FunctionParameterModel {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        let matches = getWholeRegex(FUNCTION_SPREAD_PARAMETER_PATTERN).exec(value);
        if (matches) {
            const name = matches.groups["spreadParamName"];

            return new FunctionSpreadParameterModel(name);
        }

        throw new FormatException(`"..."name`, value);
    }

    static tryParse(value, outputObj) {
        try {
            outputObj.result = this.parse(value);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    constructor(name) {
        super(name, FunctionParameterType.Spread, [], null);
    }
}

const FUNCTION_DESTRUCT_PARAM_PATTERN = `(?<destrParamDestrExp>${ARRAY_VALUE_PATTERN}|${OBJ_VALUE_PATTERN})(${ASSIGNMENT_PATTERN}(?<destrParamDefVal>${LITERAL_VALUE_PATTERN}))?`;

export class FunctionDestructuringParameterModel extends FunctionParameterModel {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        value = treatString(value);

        let matches = getWholeRegex(FUNCTION_DESTRUCT_PARAM_PATTERN).exec(value);
        if (matches) {
            const destrExpressionStr = matches.groups["destrParamDestrExp"];
            const destrExpression = DestructuringExpression.parse(destrExpressionStr);

            const defaultValueStr = matches.groups["destrParamDefVal"];
            const defaultValue = eval(defaultValueStr);

            return new FunctionDestructuringParameterModel(destrExpression, defaultValue);
        }

        throw new FormatException(`"{"[parameter: parameterName "=" parameterDefaultValue]["," ...parameters]"}"[ "=" defaultValue] | "["[parameter: parameterName "=" parameterDefaultValue]["," ...parameters]"]"[ "=" defaultValue]`, value);
    }

    constructor(destructuringExpression, defaultValue) {
        super(null, FunctionParameterType.Destructuring, defaultValue, destructuringExpression);
    }
}

const FUNCTION_PARAM_PATTERN = `(${FUNCTION_SIMPLE_PARAMETER_PATTERN})|(${FUNCTION_SPREAD_PARAMETER_PATTERN})|(${FUNCTION_DESTRUCT_PARAM_PATTERN})`;
const FUNCTION_PARAMS_PATTERN = `(${FUNCTION_PARAM_PATTERN}${OPTIONAL_SEPARATOR_PATTERN})*`;
const FUNCTION_PATTERN = `(function${WHITESPACE_PATTERN})?(?<functionName>${IDENTIFIER_PATTERN})\\((?<functionParams>${FUNCTION_PARAMS_PATTERN})\\)${WHITESPACE_PATTERN}{(?<body>.*)}`;

class FunctionModelClosure extends Closure {
    static parseFromString(value) {
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

        value = treatString(value);

        let matches = new getWholeRegex(FUNCTION_PATTERN).exec(value);
        if (matches) {
            const parametersStr = matches.groups["parameters"];
            const parameters = [...parseFunctionParameters(parametersStr)];

            const bodyStr = matches.groups["body"];
            const body = parseFunctionBody(bodyStr);

            return new FunctionModel(name, body, ...parameters);
        }

        throw new FormatException(`["function" ]name "("[parameter][, ...parameters]")" "{" body "}"`, value);
    }

    initialize(name, body, ...parameters) {
        this.name = name;
        this.body = body;
        this.parameters = parameters;
    }
}

export class FunctionModel extends Shell {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        return FunctionModelClosure.parseFromString(value);
    }

    constructor(name, body, ...parameters) {
        super(FunctionModelClosure, name, body, ...parameters);
    }

    getInvokable() {
        return Closure.doIfExists(this, c => c.getInvokable());
    }

    get parameters() {
        return Closure.doIfExists(this, c => c.parameters);
    }
}
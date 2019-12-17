export const ScriptUtils = {
    getRunningScriptTag() {
        return [...document.scripts].slice(-1)[0];
    }
};
export function debounce(func, delay) {
    let timeout;

    return function () {
        const functionCall = function () {
            return func.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, delay);
    }
}
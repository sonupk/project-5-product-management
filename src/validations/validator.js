const isValidBody = function (data) {
    return Object.keys(data).length > 0;
};




const isValid = function (value) {
    if (typeof value !== "string") return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};
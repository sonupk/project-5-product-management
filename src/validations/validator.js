const isValidBody = function (data) {
    return Object.keys(data).length > 0;
};




const isValid = function (value) {
    if (typeof value !== "string") return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

let isValidEmail = function(email){
    let emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

let isValidPassword=function(password){
    let passwordRegex=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}


module.exports={isValid,isValidBody,isValidEmail,isValidPassword}
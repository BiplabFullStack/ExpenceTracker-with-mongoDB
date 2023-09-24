const isEmpty = function(value){
    if(typeof value === 'undefined' || typeof value === null) return false;
    if(typeof value ==='string'&& value.trim.length ===0) return false;
    return true;
}

const isValidName = function(name){
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
}

const isValidEmail = function(email){
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
    return emailRegex.test(email);
}

const isValidPassword = function(password){
    const passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
    return passwordRegex.test(password);
}

const isValidPhoneNumber = function(number){
    const validPhoneNumber = /^\+?[1-9][0-9]{9,9}$/;
    return validPhoneNumber.test(number);
}

const isValidInteger = function(value){
    const validInteger = /^[1-9]\d*(\.\d+)?$/;
    return validInteger.test(value);
 
}
module.exports = { isEmpty, isValidName,isValidPhoneNumber, isValidEmail, isValidPassword, isValidInteger }
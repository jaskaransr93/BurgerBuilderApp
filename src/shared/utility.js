export const checkValidity = (value, rules) => {
    let isValid = true;
    let errorMessages = [];

    if (!rules) {
        return true;
    }

    if (rules.required) {
        let required = value.trim() !== '';
        isValid = required && isValid;
        if (!required) errorMessages.push('This field is required.');
    }

    if (rules.minLength) {
        let isMinLength = value.length >= rules.minLength;
        isValid = isMinLength && isValid;
        if (!isMinLength) errorMessages.push(`Minimum Length is ${rules.minLength}.`);
    }

    if (rules.maxLength) {
        let isMaxLength = value.length <= rules.maxLength 
        isValid = isMaxLength && isValid;
        if (!isMaxLength) errorMessages.push(`Maximum Length is ${rules.maxLength}.`);
    }

    if (rules.isEmail) {
        
        let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        let isEmail = re.test(value);
        isValid = isEmail && isValid;
        if (!isEmail) errorMessages.push(`Invalid Email.`);
    }
    
    return {
        isValid,
        errorMessages
    };
}
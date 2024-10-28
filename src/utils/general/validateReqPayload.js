const validateReqPayload = (objectRequest, mandatoryParameter) => {
    let isValid;
    try {
        if(typeof objectRequest === "undefined") {
            isValid = false;
        } else {
            isValid = true;
            for(let i of mandatoryParameter) {
                if(!objectRequest[i]){
                    isValid = false;
                    break;
                }
            }
        }
    } catch (error) {
        isValid = false;
    }
    
    return isValid
}

module.exports = {
    validateReqPayload
}
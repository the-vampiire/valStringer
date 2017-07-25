valStringer = (valueObject, key, value) => {

// on the first call of valStringer the valueObject is an object. However on subsequent calls
// it will be returned in the payload as a string and must be converted before being processed;
    if(typeof valueObject === 'string') valueObject = JSON.parse(valueObject);

    valueObject[key] = value;
    return JSON.stringify(valueObject);
};

valOptions = (dataArray, key, valueObject) => {
    let options = [];

    dataArray.forEach( e => {
        let textValuePair = {};
        textValuePair.text = e;
        textValuePair.value = valStringer(valueObject, key, e);

        options.push(textValuePair);
    });

    return options;
};

verifyKeys = (object, expectedKeys) => {
    let error;

    expectedKeys.forEach( e => {
        if(!object.hasOwnProperty(e)){
            error = `invalid object, missing the key ${e}`;
        }
    });

    return error ? error : false;
};

valAttacher = (valueObject, attachmentFields, optionsTextArray = null) => {

// verify the attachment fields object is correctly formatted
    // return helpful details about the error encountered
    const expectedKeys = ['text', 'callback_id', 'actions'];
    const keysError = verifyKeys(attachmentFields, expectedKeys);

    if(keysError){
        return keysError;
    }else {
        const actions = attachmentFields.actions[0];
        switch(true){
            case actions.type !== 'select':
                return `invalid action type, must be 'select'`;
            case actions.data_source !== 'static':
                return `invalid action data_source, must be 'static'`;
        }
    }

// handle attachment fields
    let attachment = {};
    let keys = Object.keys(attachmentFields);
    keys.forEach( key => attachment[key] = attachmentFields[key] );

// handle "select" options
    // Default is used in the case of an external source array failing
    let Default = [ / hardcode a default array of text strings here / ];
    let textArray;
    optionsTextArray ? textArray = optionsTextArray : textArray = Default;

    attachment.options = valOptions(textArray, attachmentFields.name, valueObject);
    return attachment;
};

module.exports = {
    stringer : valStringer,
    options : valOptions,
    attachment : valAttacher
};
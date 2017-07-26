
// builds or extends and returns the value object
valStringer = (valueObject, key, value) => {

    if(typeof valueObject === 'string') valueObject = JSON.parse(valueObject);

    valueObject[key] = value;
    return JSON.stringify(valueObject);
};

// builds and returns the options array for message menus
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

// builds and returns an attachment object
valAttacher = (attachmentType, menuName = null, menuDescription = null, callbackID = null,
               valueObject, menuItemsArray = null, attachmentFields = null) => {

    const defaultMenuItems = [ /* populate with default labels as a fallback */];
    let attachment, menuItems;

    if(attachmentFields) if(errorScan(attachmentFields)) return errorScan(attachmentFields);

    attachmentFields ? attachment = attachmentFields : attachment =
        attachmentType === 'menu'
            ? menuAttachment(menuName, menuDescription, callbackID)
            : buttonAttachment(menuName, menuDescription, callbackID);

    menuItemsArray ? menuItems = menuItemsArray : menuItems = defaultMenuItems;

    const actions = attachment.actions[0];
    actions.options = valOptions(menuItems, actions.name, valueObject);

    return attachment;
};

// builds the shell of a menu attachment
menuAttachment = (menuName, menuDescription, callbackID) => {
    return {
        text: menuDescription,
        callback_id: callbackID,
        actions: [{
            name: menuName,
            type: 'select',
            data_source: 'static'
        }]
    }

};

// builds the shell of a button attachment
buttonAttachment = (menuName, menuDescription, callbackID) => {

};

// scans a custom attachment object for errors
errorScan = (attachmentFields) => {
    const expectedKeys = ['text', 'callback_id', 'actions'];

    const keysError = verifyKeys(attachmentFields, expectedKeys);

    if(keysError){
        return keysError;
    }else {
        const actions = attachmentFields.actions[0];
        switch(true){
            case actions.type !== 'select' || actions.type !== 'button':
                return `invalid action type, must be 'select' for menu or 'button' for button`;
            case actions.data_source !== 'static':
                return `invalid action data_source, must be 'static'`;
        }
    }
};


// verifies the keys of a custom attachment object
verifyKeys = (object, expectedKeys) => {
    let error;

    expectedKeys.forEach( e => {
        if(!object.hasOwnProperty(e)){
            error = `invalid object, missing the key ${e}`;
        }
    });

    return error ? error : false;
};

module.exports = {
    stringer : valStringer,
    options : valOptions,
    attachment : valAttacher
};
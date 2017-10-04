function valStringer(valueObject, key, value) {
  
      if(typeof valueObject === 'string') valueObject = JSON.parse(valueObject);
  
      valueObject[key] = value;
      return JSON.stringify(valueObject);
  };

function valOptions(dataArray, key, valueObject) {
  const options = [];
  dataArray.forEach( e => {
    const textValuePair = {};
    let value;
    let text;
    
    if (typeof e === 'string') value = text = e;
    else {
      value = Object.keys(e)[0];
      text = e[value];
    }
    
    textValuePair.text = text;
    textValuePair.value = valStringer(valueObject, key, value);
    options.push(textValuePair);
  });

  return options;
};
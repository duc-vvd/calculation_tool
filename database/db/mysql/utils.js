
export function splitArray(array, count) {
    if (array.length <= count) return [array];
    const arrayReturn = [];
    while (array.length >= count) {
        const arrayTemp = array.splice(0, count);
        arrayReturn.push(arrayTemp);
    }
    if (array.length > 0) {
        arrayReturn.push(array);
    }
    return arrayReturn;
};


export function formatStringFullTextSearch(stringInput) {
    const stringSplit = stringInput.split(new RegExp('[^a-zA-Z0-9]', 'g'));

    return stringSplit.reduce((stringValue, item) => {
        let value = stringValue;
        if (item) {
            value += `+${item}* `;
        }

        return value;
    }, '');
};
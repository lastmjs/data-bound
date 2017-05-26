const DataBound = function(strings) {
    console.log(arguments);

    const dataBoundArguments = arguments;

    return strings.reduce((result, string, index) => {
        return result + string + (dataBoundArguments[index + 1] ? dataBoundArguments[index + 1] : '');
    }, '');
};

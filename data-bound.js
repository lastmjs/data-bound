// create a mapping of uuids to expressions
// create a string with all of the expressions replaced with uuids
// for each element, loop through all attributes. If the attribute value contains the uuid, store that element and that attribute name to the mapping

let dataBindings;

const DataBound = function(strings) {
    const originalArguments = arguments;
    return function(component) {
        const expressions = Array.from(originalArguments).slice(1);

        if (!dataBindings) {
            console.log('if')
            const elementInfos = expressions.map((expression) => {
                const uuid = createUUID();
                return {
                    uuid,
                    expression
                };
            });

            // const div = document.createElement('div');
            // div.innerHTML = strings.reduce((result, string, index) => {
            //     return result + string + (elementInfos[index] ? elementInfos[index].uuid : '');
            // }, '');
            // component.appendChild(div);

            component.innerHTML = strings.reduce((result, string, index) => {
                return result + string + (elementInfos[index] ? elementInfos[index].uuid : '');
            }, '');

            dataBindings = elementInfos.map((elementInfo) => {
                const {element, attributeName} = Array.from(component.children).reduce((result, child) => {
                    const {uuidPresent, attributeName} = Array.from(child.attributes).reduce((result, attribute) => {
                        const uuidPresent = attribute.value.includes(elementInfo.uuid);
                        const attributeName = attribute.name;

                        console.dir(attribute)

                        return Object.assign({}, result, {
                            uuidPresent: uuidPresent ? uuidPresent : result.uuidPresent,
                            attributeName: uuidPresent ? attributeName : result.attributeName
                        });
                    }, {
                        uuidPresent: null,
                        attributeName: null
                    });

                    return Object.assign({}, result, {
                        element: uuidPresent ? child : result.element,
                        attributeName: uuidPresent ? attributeName : result.attributeName
                    });
                }, {
                    element: null,
                    attributeName: null
                });

                return Object.assign({}, elementInfo, {
                    element,
                    attributeName
                });
            });
        }
        else {
            console.log('else')
            dataBindings = dataBindings.map((dataBinding, index) => {
                return Object.assign({}, dataBinding, {
                    expression: expressions[index]
                });
            });
        }

        console.log('about to set properties again');

        // this is where the actual data binding occurs
        dataBindings.forEach((dataBinding) => {
            dataBinding.element.setAttribute(dataBinding.attributeName, dataBinding.expression); // we set the attribute to get rid of the uuid that we set earlier
            // dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
            // console.log(dataBinding.element);
            // setTimeout(() => {
            //     dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
            // }, 50);
            console.log(dataBinding.attributeName);
            console.log(dataBinding.element.attributeName);
            console.log(dataBinding.element);
            dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
            dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
            //TODO the property setters are not firing correctly it seems when I set the properties here
        });
    };
};

function createUUID() {
    //From persistence.js; Copyright (c) 2010 Zef Hemel <zef@zef.me> * * Permission is hereby granted, free of charge, to any person * obtaining a copy of this software and associated documentation * files (the "Software"), to deal in the Software without * restriction, including without limitation the rights to use, * copy, modify, merge, publish, distribute, sublicense, and/or sell * copies of the Software, and to permit persons to whom the * Software is furnished to do so, subject to the following * conditions: * * The above copyright notice and this permission notice shall be * included in all copies or substantial portions of the Software. * * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR * OTHER DEALINGS IN THE SOFTWARE.
	var s = [];
	var hexDigits = "0123456789ABCDEF";
	for ( var i = 0; i < 32; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[12] = "4";
	s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);

	var uuid = s.join("");
	return uuid;
}

// create a mapping of uuids to expressions
// create a string with all of the expressions replaced with uuids
// for each element, loop through all attributes. If the attribute value contains the uuid, store that element and that attribute name to the mapping

const DataBound = function(strings) {
    const originalArguments = arguments;
    const expressions = Array.from(arguments).slice(1)
    console.log(expressions);

    const elementInfo = expressions.reduce((result, expression) => {
        const uuid = createUUID();
        return Object.assign({}, result, {
            [uuid]: {
                uuid,
                expression
            }
        });
    }, {});

    const elementInfos = expressions.map((expression) => {
        const uuid = createUUID();
        return {
            uuid,
            expression
        };
    });

    console.log(elementInfo)

    const div = document.createElement('div');

    div.innerHTML = strings.reduce((result, string, index) => {
        return result + string + (elementInfos[index] ? elementInfos[index].uuid : '');
    }, '');

    const dataBindings = elementInfos.map((elementInfo) => {
        const {element, attributeName} = Array.from(div.children).reduce((result, child) => {
            const {uuidPresent, attributeName} = Array.from(child.attributes).reduce((result, attribute) => {
                const uuidPresent = attribute.value.includes(elementInfo.uuid);
                const attributeName = attribute.name;

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

    console.log(dataBindings);

    // this is where the actual data binding occurs
    dataBindings.forEach((dataBinding) => {
        dataBinding.element.setAttribute(dataBinding.attributeName, dataBinding.expression); // we set the attribute to get rid of the uuid that we set earlier
        dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
    });

    console.dir(div);

    //
    // const div = document.createElement('div');
    //
    // div.innerHTML = strings.join('');
    //
    // Array.from(div.children).forEach((child) => {
    //     console.log(child.attributes);
    // });
    //
    // // console.log(template.querySelector('div'));
    //
    // const dataBoundArguments = arguments;

    // return strings.reduce((result, string, index) => {
    //     return result + string + (dataBoundArguments[index + 1] ? dataBoundArguments[index + 1] : '');
    // }, '');
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

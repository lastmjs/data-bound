// create a mapping of uuids to expressions
// create a string with all of the expressions replaced with uuids
// for each element, loop through all attributes. If the attribute value contains the uuid, store that element and that attribute name to the mapping

const DataBound = function(strings) {
    let dataBindings;
    const originalArguments = arguments;
    return function(component) {
        const expressions = Array.from(originalArguments).slice(1);

        if (!dataBindings) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation.type);
                });
            });
            observer.observe(component, {
                characterData: true
            });

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
                const {
                    element,
                    attributeName,
                    textNode,
                    eventName
                } = Array.from(getAllChildren(component)).reduce((result, child) => {
                    const {
                        attributeName
                    } = Array.from(child.attributes).reduce((result, attribute) => {
                        const uuidPresent = attribute.value.includes(elementInfo.uuid);
                        const attributeName = attribute.name;

                        return Object.assign({}, result, {
                            attributeName: uuidPresent ? attributeName : result.attributeName
                        });
                    }, {
                        attributeName: null
                    });

                    // We must find out if any childNodes are text nodes, and bind to the textContent property of the childNode
                    const {textNode} = Array.from(child.childNodes).reduce((result, childNode) => {
                        return Object.assign({}, result, {
                            textNode: childNode.nodeName === '#text' && childNode.textContent.includes(elementInfo.uuid) ? childNode : result.textNode
                        });
                    }, {
                        textNode: null
                    });

                    return Object.assign({}, result, {
                        element: attributeName || textNode ? child : result.element,
                        attributeName: attributeName || result.attributeName,
                        textNode: textNode || result.textNode
                    });
                }, {
                    element: null,
                    attributeName: null,
                    textNode: null,
                    eventName: null
                });

                return Object.assign({}, elementInfo, {
                    element,
                    attributeName,
                    textNode,
                    eventName
                });
            });
        }
        else {
            dataBindings = dataBindings.map((dataBinding, index) => {
                return Object.assign({}, dataBinding, {
                    expression: expressions[index]
                });
            });
        }

        // this is where the actual data binding occurs
        dataBindings.forEach(async (dataBinding) => {
            //TODO how to figure out a better way to handle passing in non-custom-element names
            try {
                await window.customElements.whenDefined(dataBinding.element.localName);
            }
            catch(error) {
                // console.log(error)
            }

            switch(dataBinding.attributeName) {
                case 'style': {
                    dataBinding.element.setAttribute(dataBinding.attributeName, dataBinding.element.getAttribute('style').replace(dataBinding.uuid, dataBinding.expression));
                    break;
                }
                case 'class': {
                    dataBinding.element.setAttribute(dataBinding.attributeName, dataBinding.element.getAttribute('class').replace(dataBinding.uuid, dataBinding.expression));
                    break;
                }
                default: {
                    if (dataBinding.textNode) {
                        dataBinding.textNode.textContent = dataBinding.textNode.textContent.replace(dataBinding.uuid, dataBinding.expression);
                    }
                    else {
                        dataBinding.element.setAttribute(dataBinding.attributeName, dataBinding.expression); // we set the attribute to get rid of the uuid that we set earlier
                        dataBinding.element[dataBinding.attributeName] = dataBinding.expression; // now we set the property
                    }

                    break;
                }
            }
        });
    };
};

//TODO make this more functional
function getAllChildren(element) {
    const immediateChildren = Array.from(element.children);
    let allChildren = [...immediateChildren];
    immediateChildren.forEach((child) => {
        allChildren.push(...getAllChildren(child));
    });
    return allChildren;
}

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


const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAstSync } = require('@babel/core');
const t = require('@babel/types');
let randomSet = new Set();

function UpdateAssets(asset) {
  let code = asset
  try {
    const ast = parser.parse(asset, {
      sourceType: 'module',
      plugins: [
        'flow',
        'jsx'
      ]
    });
    traverse(ast, {
      JSXElement(nodePath) {
        if (nodePath.node.type === 'JSXElement' && nodePath.node.openingElement.name.name === 'img') {
          // console.log(nodePath.node)
          return
        }
        updateAttr(nodePath.node);
      }
    })
    code = transformFromAstSync(ast).code;
  } catch(e) {
    console.log(e)
  }
  return code;
}

function updateAttr(node) {
  if (node.type === 'JSXElement') {
    let { openingElement, children } = node;
    let name = openingElement.name.name || openingElement.type
    let className = openingElement.attributes.some(attr => {
      if (attr.type === 'JSXSpreadAttribute') return false
      return /class(Name)?/.test(attr.name.name)
    })
    if (className) {
      name = className[0].value.value
    }
    if (!openingElement) return
    const elementtimingList = openingElement.attributes.some(attr => {
      if (attr.type !== 'JSXSpreadAttribute' && attr.name.name === 'elementtiming') {
        return true
      }
    })
    if (!elementtimingList) {
      openingElement.attributes.push(addElementttiming(name + '-' + Math.ceil(Math.random() * 100000)));
    }
    const markList = openingElement.attributes.some(attr => {
      if (attr.type !== 'JSXSpreadAttribute' && attr.name.name === 'data-mark') {
        return true
      }
    })
    if (!markList) {
      openingElement.attributes.push(addMark());
    }
    children.map(childNode => updateAttr(childNode));
  }
}

function addElementttiming(name) {
  return t.jsxAttribute(t.jsxIdentifier('elementtiming'), t.stringLiteral(name));
}

function addMark() {
  let randomStatus = true;
  let markRandom = 0;
  while(randomStatus) {
    markRandom = Math.ceil(Math.random() * 100000);
    randomStatus = randomSet.has(markRandom);
    if (!randomStatus) {
      randomSet.add(markRandom);
    }
  }
  return t.jsxAttribute(t.jsxIdentifier('data-mark'), t.stringLiteral(markRandom + ''));
}

module.exports = UpdateAssets;
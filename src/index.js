
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAstSync } = require('@babel/core')
const t = require('@babel/types')
let randomSet = new Set()

function UpdateAssets(asset) {
  const ast = parser.parse(asset, {
    sourceType: 'module',
    plugins: [
      'flow',
      'jsx'
    ]
  })
  traverse(ast, {
    FunctionDeclaration(nodePath) {
      nodePath.node.body.body.map(node => {
        if (node.type === 'ReturnStatement') {
          if (node.argument.type === 'JSXElement') {
            updateAttr(node.argument, nodePath.node.id.name)
          }
        }
      })
    }
  })
  const { code } = transformFromAstSync(ast)
  return code
}

function updateAttr(node, name) {
  if (node.type === 'JSXElement') {
    // console.log(node.argument)
    const { openingElement, children } = node
    let OEName = name
    if (!OEName || OEName === null) {
      OEName = openingElement.name.name
    }
    if (OEName === 'SCRIPT') return
    openingElement.attributes.push(addElementttiming(OEName))
    openingElement.attributes.push(addMark())
    children.map(childNode => updateAttr(childNode))
  }
}

function addElementttiming(name) {
  return t.jsxAttribute(t.jsxIdentifier('elementtiming'), t.stringLiteral(name))
}

function addMark() {
  let randomStatus = true
  let markRandom = 0
  while(randomStatus) {
    markRandom = Math.ceil(Math.random() * 100000)
    randomStatus = randomSet.has(markRandom)
    if (!randomStatus) {
      randomSet.add(markRandom)
    }
  }
  return t.jsxAttribute(t.jsxIdentifier('data-mark'), t.stringLiteral(markRandom + ''))
}

module.exports = UpdateAssets
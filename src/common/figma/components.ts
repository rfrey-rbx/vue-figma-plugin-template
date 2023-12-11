export function findChildByName<T>(node: BaseNode, name: string, type: NodeType) {
    if (!('findChild' in node)) throw new Error(`"${node.name}" has no children`)
    const found = node.findChild(n => n.name === name)
    if (found === null) throw new Error(`Couldn't find "${name}"`)
    if (found && found.type != type) throw new Error(`Type of node didn't match. Found ${found.type}; Needed ${type}.`)
    return found as T
}

export function tryFindChildByName<T>(node: BaseNode, name: string, type: NodeType) {
    if (!('findChild' in node)) throw new Error(`"${node.name}" has no children`)
    const found = node.findChild(n => n.name === name)
    if (found && found.type != type) throw new Error(`Type of node didn't match. Found ${found.type}; Wanted ${type}.`)
    return found as T
}

export function findOneByName(node: BaseNode, name: string, type: NodeType) {
    if (!('findChild' in node)) throw new Error(`"${node.name}" has no children`)
    const found = node.findOne(n => n.name === name)
    if (found === null) throw new Error(`Couldn't find "${name}"`)
    if (found && found.type != type) throw new Error(`Type of node didn't match. Found ${found.type}; Needed ${type}.`)
    return found
}

export function findAllByName(node: BaseNode, name: string) {
    if (!('findChild' in node)) throw new Error(`"${node.name}" has no children`)
    const found = node.findAll(n => n.name === name)
    return found
}

export function findPageByName(name: string) {
    const found = figma.root.findChild(n => n.name === name)
    if (found === null) throw new Error(`Couldn't find "${name}"`)
    return found
}

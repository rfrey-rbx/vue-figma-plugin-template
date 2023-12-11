interface CachedCollection {
    collection: VariableCollection,
    cachedVariables: Record<string, Variable>
}

const cachedCollections: Record<string, CachedCollection> = {}

export function getVarCollection(collectionName: string, createIfMissing = false) {
    if (cachedCollections[collectionName] === undefined) {
        // console.log(`Looking up collection "${collectionName}" in Roblox`)
        const collection = figma.variables.getLocalVariableCollections().find(c => c.name === collectionName)
        if (collection === undefined) {
            // console.log(`Collection "${collectionName}" is not found`)
            if (createIfMissing) {
                // console.log(`Creating collection "${collectionName}"`)
                cachedCollections[collectionName] = {
                    collection: figma.variables.createVariableCollection(collectionName),
                    cachedVariables: {}
                }
            }
        } else {
            // console.log(`Caching collection "${collectionName}"`)
            cachedCollections[collectionName] = {
                collection,
                cachedVariables: {}
            }
        }
    }
    return cachedCollections[collectionName]
}

export function getVar(collection: string | CachedCollection, variableName: string, createIfMissing = false, type: VariableResolvedDataType = 'STRING') {
    // defaultValue?: string | boolean | number, mode?: string
    // its not clear when its been set vs defaulted by Figma, so leaning towards explicit sets instead.

    const cachedCollection = (typeof collection == 'string') ? getVarCollection(collection, createIfMissing) : collection;

    if (cachedCollection.cachedVariables[variableName] === undefined) {
        // console.log(`looking up variable "${variableName}"`)

        // lookup variable
        let foundVariable: Variable | undefined = undefined;
        cachedCollection.collection.variableIds.some(id => {
            const variable = figma.variables.getVariableById(id)
            const found = variable?.name === variableName
            if (found) { foundVariable = variable }
            return found
        })

        if (foundVariable === undefined) {
            // console.log(`creating variable "${variableName}"`)
            cachedCollection.cachedVariables[variableName] =
                figma.variables.createVariable(
                    variableName,
                    cachedCollection.collection.id,
                    type
                )
            /*
            if (defaultValue !== undefined) {
                let modeId = getModeId(cachedCollection, mode)
                cachedCollection.cachedVariables[variableName].valuesByMode(modeId)
                cachedCollection.cachedVariables[variableName].setValueForMode(modeId, defaultValue)
            }
            */
        } else {
            // console.log(`caching variable "${variableName}"`)
            cachedCollection.cachedVariables[variableName] = foundVariable
        }
    }

    return cachedCollection.cachedVariables[variableName]
}

function getModeId(cachedCollection: CachedCollection, mode?: string) {
    let modeId = cachedCollection.collection.defaultModeId
    if (mode !== undefined) {
        let _mode = cachedCollection.collection.modes.find(m => m.name === mode)
        modeId = _mode?.modeId || modeId
    }
    return modeId
}

export function setVar(collectionName: string, variableName: string, value: any, mode?: string, createIfMissing = true, type: VariableResolvedDataType = 'STRING') {
    // console.log(`setting var "${collectionName} / ${variableName}"`)

    let variableType: VariableResolvedDataType = type || 'STRING'
    if (typeof value === 'string') variableType = 'STRING'
    else if (typeof value === 'number') variableType = 'FLOAT'
    else if (typeof value === 'boolean') variableType = 'BOOLEAN'
    // TODO: 'COLOR' ?

    const cachedCollection = getVarCollection(collectionName, createIfMissing)
    const cachedVariable = getVar(cachedCollection, variableName, createIfMissing, variableType)

    // console.log(`preparing mode`)
    let modeId = getModeId(cachedCollection, mode)

    // console.log(`setting value to `, value)
    cachedVariable.setValueForMode(modeId, value)
    return cachedVariable
}

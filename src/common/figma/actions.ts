function hackyClone(obj: Object | Array<any>) {
    return JSON.parse(JSON.stringify(obj))
}

export function mergeToTrigger(reactions: ReadonlyArray<Reaction>, trigger: Trigger, actions: Action[]): ReadonlyArray<Reaction> {
    let foundTrigger = false
    const mergedReactions = reactions.map(reaction => {
        if (reaction.trigger?.type === trigger.type) {
            foundTrigger = true
            const mergedActions = reaction.actions ? hackyClone(reaction.actions) : []
            if (reaction.action) mergedActions.push(hackyClone(reaction.action))
            mergedActions.concat(actions)
            return {
                trigger: reaction.trigger,
                actions: mergedActions
            }
        }
        return reaction
    })
    if (!foundTrigger) {
        mergedReactions.push({ trigger, actions })
    }
    return mergedReactions
}

export function mergeReactions(originalReactions: ReadonlyArray<Reaction>, addingReactions: ReadonlyArray<Reaction>) {
    let mergedReactions = originalReactions
    addingReactions.forEach((newReaction) => {
        if (newReaction.trigger === null || newReaction.actions === undefined) throw new Error('Reactions must have triggers and actions to be added')
        mergedReactions = mergeToTrigger(mergedReactions, newReaction.trigger, newReaction.actions)
    })
}


export function conditional(condition: VariableData, conditionTrue: Action[], conditionFalse?: Action[]): Action {
    return {
        type: 'CONDITIONAL',
        conditionalBlocks: conditionFalse ? [
            {
                condition,
                actions: conditionTrue
            },
            {
                actions: conditionFalse
            }
        ] : [
            {
                condition,
                actions: conditionTrue
            }
        ]
    }
}


export type VariableOrValue = Variable | string | number | boolean

export function valueOf(value: VariableOrValue): VariableData {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        let type: VariableResolvedDataType = 'STRING'
        if (typeof value === 'number') type = 'FLOAT'
        else if (typeof value === 'boolean') type = 'BOOLEAN'
        return {
            resolvedType: type,
            type,
            value,
        }
    } else {
        return {
            resolvedType: value.resolvedType,
            type: "VARIABLE_ALIAS",
            value: {
                type: 'VARIABLE_ALIAS',
                id: value.id
            },
        }
    }
}

// TODO: must take variables and values
export function areEqual(a: VariableOrValue, b: VariableOrValue): VariableData {
    return {
        resolvedType: "BOOLEAN",
        type: "EXPRESSION",
        value: {
            expressionArguments: [
                valueOf(a),
                valueOf(b)
            ],
            expressionFunction: "EQUALS"
        }
    }
}

export function notEqual(a: VariableOrValue, b: VariableOrValue): VariableData {
    return {
        resolvedType: "BOOLEAN",
        type: "EXPRESSION",
        value: {
            expressionArguments: [
                valueOf(a),
                valueOf(b)
            ],
            expressionFunction: "NOT_EQUAL"
        }
    }
}

export function bothTrue(a: VariableData, b: VariableData): VariableData {
    return {
        type: 'EXPRESSION',
        resolvedType: "BOOLEAN",
        value: {
            expressionArguments: [a, b],
            expressionFunction: 'AND'
        }
    }
}

export function setVarAction(variable: Variable, value: VariableOrValue): Action {
    return {
        type: 'SET_VARIABLE',
        variableId: variable.id,
        variableValue: valueOf(value),
    }
}

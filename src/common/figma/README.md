These were a set of helpers
I wrote to make interfacing with
the Figma API easier.

## Actions
Actions are built out of verbose JSON structures.
These helpers are setup to allow defining them
via functions.

```js
const example = {
    actions: [
        // if var is 'Default' -> set to 'Hovered'
        conditional(
            areEqual(
                getVar('example_collection', 'example_var'),
                'Default'
            ),
            [
                setVarAction('example_collection', 'example_var'), 'Hovered'),
            ]
        )
    ]
}
```

which looks like this much less readable tree in JSON:
```json
{
    "actions": [
        {
            "type": "CONDITIONAL",
            "conditionalBlocks": [
                {
                    {
                        "resolvedType": "BOOLEAN",
                        "type": "EXPRESSION",
                        "value": {
                            "expressionArguments": [
                                {
                                    "resolvedType": "STRING",
                                    "type": "VARIABLE_ALIAS",
                                    "value": {
                                        "type": "VARIABLE_ALIAS",
                                        "id": "example_var#12"
                                    },
                                },
                                {
                                    "resolvedType": "STRING",
                                    "type": "STRING",
                                    "value": "Default",
                                }
                            ],
                            "expressionFunction": "EQUALS"
                        }
                    },
                    "actions": [
                        {
                            "type": "SET_VARIABLE",
                            "variableId": "example_var#12",
                            "variableValue": {
                                "resolvedType": "STRING",
                                "type": "STRING",
                                "value": "Hovered",
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

```

## Component

These helpers are for finding elements in the document.
Mainly just building in the filter function and error handling
I was finding I kept repeating in my codebase.

## Component Properties

This helper just avoids sets on properties that don't exist instead of erroring.

## Variables

Variables actually caches looking up variables and trys to map between
their friendly string names and internal representations.

This was added to allow me to use the friendly names more easily and also
because my variable lookups and sets were slowing down and timing out my plugin.

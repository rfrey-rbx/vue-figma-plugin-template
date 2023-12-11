/***
 * Wrap setProperties with key lookups.
 */
export function setProperties(instance: InstanceNode, properties: Record<string, any>) {
    const mappedProperties: Record<string, string> = {} // [original readable key]: figma internal key
    Object.keys(properties).forEach(readableKey => {
        const foundInternalKey = Object.keys(instance.componentProperties).find(internalKey => internalKey.startsWith(readableKey))
        if (foundInternalKey) mappedProperties[foundInternalKey] = properties[readableKey]
        else throw new Error(`Couldn't map property "${readableKey}"`);
    })
    instance.setProperties(mappedProperties)
}
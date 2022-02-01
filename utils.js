const getPathFromArgs = (args) => {
    if (!args || args.length !== 3)
        throw new Error("You must specify a path")
    const [path] = args.slice(2)
    return path
}

const isStateMachineResource = (resource) => {
    const STATE_MACHINE_RESOURCE_TYE = 'AWS::StepFunctions::StateMachine';

    if (!resource.hasOwnProperty('Type'))
        return false;
    return resource.Type === STATE_MACHINE_RESOURCE_TYE
}

const createResourceArray = (cfnStackJson, condition) => {
    if (!cfnStackJson.hasOwnProperty('Resources'))
        throw new Error("Missing 'Resources' property")

    const {Resources: resources} = cfnStackJson;

    return Object.keys(resources)
        .filter(resource => condition(resources[resource]))
        .map(resource => resources[resource])
}

module.exports = {
    getPathFromArgs,
    isStateMachineResource,
    createResourceArray
}
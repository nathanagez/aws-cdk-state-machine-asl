const fs = require('fs');
const {getPathFromArgs, createResourceArray, isStateMachineResource} = require("./utils");

const parse = (path) => {
    const cfnStackJson = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const stateMachineResources = createResourceArray(cfnStackJson, isStateMachineResource)
    console.log(stateMachineResources)
}

parse(getPathFromArgs(process.argv))
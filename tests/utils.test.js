const {getPathFromArgs, isStateMachineResource, createResourceArray} = require('../utils')
const fs = require("fs");
const path = require('path');

describe('getPathFromArgs', () => {
    const EXPECTED_ERROR = 'You must specify a path'

    it('Should return the path from process.argv', () => {
        // Arrange
        const args = ['node', '/home/nathan/argv.js', 'the/path']

        // Act
        const path = getPathFromArgs(args)

        // Assert
        expect(path).toEqual('the/path')
    })

    it('Should throw an error if the number of arguments is different of 3', () => {
        const args = ['node', '/home/nathan/argv.js']

        expect(() => getPathFromArgs(args)).toThrow(EXPECTED_ERROR)
        expect(getPathFromArgs).toThrow(EXPECTED_ERROR)
    })
})

describe('isStateMachineResource', () => {
    it('should return true if it matches the AWS::StepFunctions::StateMachine type', () => {
        const resource = {
            Type: 'AWS::StepFunctions::StateMachine',
            Properties: {},
            Metadata: {}
        }

        const result = isStateMachineResource(resource);

        expect(result).toBe(true)
    })

    it('should return false if it doesn\'t the AWS::StepFunctions::StateMachine type', () => {
        const resource = {
            Type: 'AWS::IAM::Policy',
            Properties: {},
            Metadata: {}
        }

        const result = isStateMachineResource(resource);

        expect(result).toBe(false)
    })

    it("should return false if it doesn't contain Type property", () => {
        const resource = {
            Properties: {},
            Metadata: {}
        }

        const result = isStateMachineResource(resource);

        expect(result).toBe(false)
    })
})

describe('createResourceArray', () => {
    it('Should return an array of State Machine resources', () => {
        const cfStackJson = JSON.parse(fs.readFileSync(path.join(__dirname, './sample-cloudformation.json'), 'utf-8'));

        const result = createResourceArray(cfStackJson, isStateMachineResource)

        expect(result.length).toEqual(2)
        expect(result[0]).toHaveProperty('Properties.DefinitionString')
        expect(result[1]).toHaveProperty('Properties.DefinitionString')
    })
})
const {fnJoin, resolveExpressions} = require("../parser");
const fs = require("fs");
const {createResourceArray, isStateMachineResource} = require("../utils");
const path = require("path");

describe('FnJoin', () => {
    it('Should return "a:b:c"', () => {
        const expression = [':', ["a", "b", "c"]]

        const result = fnJoin(expression);

        expect(result).toEqual("a:b:c")

    })

    it('Should return recursively resolve expressions', () => {
        const cfnStackJson = JSON.parse(fs.readFileSync(path.join(__dirname, './sample-cloudformation.json'), 'utf-8'));
        const resourceArray = createResourceArray(cfnStackJson, isStateMachineResource)
        const parsedASL = "{\"StartAt\":\"Submit Job\",\"States\":{\"Submit Job\":{\"Next\":\"Wait X Seconds\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"OutputPath\":\"$.Payload\",\"Resource\":\"arn:aws:states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"SubmitLambda8054545EArn\",\"Payload.$\":\"$\"}},\"Wait X Seconds\":{\"Type\":\"Wait\",\"Seconds\":30,\"Next\":\"Get Job Status\"},\"Get Job Status\":{\"Next\":\"Job Complete?\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"OutputPath\":\"$.Payload\",\"Resource\":\"arn:aws:states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"CheckLambda9CBBF9BAArn\",\"Payload.$\":\"$\"}},\"Job Complete?\":{\"Type\":\"Choice\",\"Choices\":[{\"Variable\":\"$.status\",\"StringEquals\":\"FAILED\",\"Next\":\"Job Failed\"},{\"Variable\":\"$.status\",\"StringEquals\":\"SUCCEEDED\",\"Next\":\"Get Final Job Status\"}],\"Default\":\"Wait X Seconds\"},\"Job Failed\":{\"Type\":\"Fail\",\"Error\":\"DescribeJob returned FAILED\",\"Cause\":\"AWS Batch Job Failed\"},\"Get Final Job Status\":{\"End\":true,\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"OutputPath\":\"$.Payload\",\"Resource\":\"arn:aws:states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"CheckLambda9CBBF9BAArn\",\"Payload.$\":\"$\"}}},\"TimeoutSeconds\":300}"

        const definition = resourceArray[0].Properties.DefinitionString;

        const result = fnJoin(definition["Fn::Join"])

        expect(result).toEqual(parsedASL)
    })
})

describe('resolveExpressions', () => {
    it('should find other intrinsic functions', () => {
        const expression = [
            "{\"StartAt\":\"Submit Job\",\"States\":{\"Submit Job\":{\"Next\":\"Wait X Seconds\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"OutputPath\":\"$.Payload\",\"Resource\":\"arn:",
            {
                "Ref": "AWS::Partition"
            },
            ":states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"",
            {
                "Fn::GetAtt": [
                    "SubmitLambda8054545E",
                    "Arn"
                ]
            },
            ":states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"",
            {
                "Fn::Join": [
                    "/",
                    ["Arn", "B"]
                ]
            }
        ]
        const parsed = ["{\"StartAt\":\"Submit Job\",\"States\":{\"Submit Job\":{\"Next\":\"Wait X Seconds\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"OutputPath\":\"$.Payload\",\"Resource\":\"arn:", "aws", ":states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"", "SubmitLambda8054545EArn", ":states:::lambda:invoke\",\"Parameters\":{\"FunctionName\":\"", "Arn/B"]

        const result = resolveExpressions(expression)

        expect(result).toEqual(parsed)
    })
});
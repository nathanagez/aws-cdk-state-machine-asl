# CDK state machine to ASL definition 🔥
Convert your CDK state machine to an ASL file.

This tool only works with synthesized CDK's CloudFormation stacks.

It parses the `DefinitionString` property of a `AWS::StepFunctions::StateMachine`, resolves intrinsic functions and generate an ASL definition file. 

Don't forget to star ⭐

### How to use ? 🧑‍🏫
Synthesize your AWS CloudFormation template
```
cdk synth
```

Locate the synthesized CloudFormation template (inside `cdk.out` directory) and generate the ASL definition.
```sh
node ./index.js <path-to-your-cloudformation-json-file>
```

Example with the sample CloudFormation stack
```sh
node ./index.js ./tests/sample-cloudformation.json
```

### Tests 🧪
```
yarn test
```

### Watch mode 👁️
```
yarn test --watch
```
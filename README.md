# AWS CDK state machine to ASL definition ๐ฅ
Convert your AWS CDK state machine to an ASL file.

This tool only works with synthesized AWS CDK's CloudFormation stacks.

It parses the `DefinitionString` property of a `AWS::StepFunctions::StateMachine`, resolves intrinsic functions and generates an ASL definition file. 

Don't forget to star โญ

### How to use ? ๐งโ๐ซ
```
npm install -g cdk-asl-extractor
```

Synthesize your AWS CloudFormation template
```
cdk synth
```

Locate the synthesized CloudFormation template (inside `cdk.out` directory) and generate the ASL definition.
```sh
cdk-asl-extractor <path-to-your-cloudformation-json-file>
```

Example with the sample CloudFormation stack
```sh
cdk-asl-extractor ./tests/sample-cloudformation.json
```

### Tests ๐งช
```
yarn test
```

### Watch mode ๐๏ธ
```
yarn test --watch
```
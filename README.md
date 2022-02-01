# cdk-asl-extractor
Convert your CDK state machine to an ASL file.
This tool only works with CloudFormation stacks 

### How to use
Synthesize your AWS CloudFormation template
```
cdk synth
```

Locate the CloudFormation template and generate ASL definition
```sh
node ./index.js <path-to-your-cloudformation-json-file>
```

Example with the sample CloudFormation stack
```sh
node ./index.js ./tests/sample-cloudformation.json
```

### Tests
```
yarn test
```

### Watch mode
```
yarn test --watch
```
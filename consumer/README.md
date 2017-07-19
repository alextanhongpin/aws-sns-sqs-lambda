# Kinesis Lambda
    
>    Scaling serverless


Simple setup of AWS Lambda with Kinesis and SNS.

## Installing / Getting started

Serverless templates are created with the following command:

```bash
$ serverless create --template aws-nodejs --path service-name
```

## Developing

```bash
$ cd service-name
```

## Building

```bash
$ npm install
```

## Deploying

```bash
$ serverless deploy
```


## Features

## Configuration

## Contributing

## Licensing

Always create a license


## Learning point

1. SQS cannot trigger lambda, SNS can
2. If an event fail from SNS to lambda, there is not retry
3. Use SNS->SQS->Lambda for consistent delivery
4. Lambda can pool SQS
5. It's possible to replace SQS with Amazon Kinesis Streams
6. Kinesis Stream can drive AWS Lambda functions
7. Kinesis Stream guarantee ordering of the delivered message for any given key (nice for ordered database operations)
8. Kinesis Stream let you specify how many AWS Lambda functions can be run in parallel (one per partition)
9. Kinesis streams can pass multiple available messages in one AWS lambda function invocation
10. Lambda will be reading from AWS Kinesis stream, not the Kinesis Stream invoking AWS Lambda
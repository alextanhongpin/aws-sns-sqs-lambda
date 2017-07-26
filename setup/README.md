# setup

Automates the creation of AWS SNS Topic, AWS SQS queue and dead-letter queue, links them together and writes the output as a config file.

## Steps

1. [Create a new SNS Topic](#create-a-new-sns-topic)
2. [Create an SQS Queue](#create-an-sqs-queue)
3. [Get Queue Attributes](#get-queue-attributes)
4. [Subscribe to Topic](#subscribe-to-topic)


## Create a new SNS Topic

Create a topic with a name first which will return the topic arn:

```bash
$ aws sns create-topic --name my-topic
# output
{
    "ResponseMetadata": {
        "RequestId": "1469e8d7-1642-564e-b85d-a19b4b341f83"
    },
    "TopicArn": "arn:aws:sns:us-west-2:0123456789012:my-topic"
}
```

## Create an SQS Queue

Creates a new queue and returns the queue url:

```bash
$ aws sqs create-queue --queue-name MyQueue
# Output
{
  "QueueUrl": "https://queue.amazonaws.com/80398EXAMPLE/MyQueue"
}
```

## Get Queue Attributes

Get the queue ARN from the queue attributes:
```bash
$ aws sqs get-queue-attributes --queue-url https://sqs.us-east-1.amazonaws.com/80398EXAMPLE/MyQueue --attribute-names All
# Output
{
  "Attributes": {
    "ApproximateNumberOfMessagesNotVisible": "0",
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:80398EXAMPLE:MyDeadLetterQueue\",\"maxReceiveCount\":1000}",
    "MessageRetentionPeriod": "345600",
    "ApproximateNumberOfMessagesDelayed": "0",
    "MaximumMessageSize": "262144",
    "CreatedTimestamp": "1442426968",
    "ApproximateNumberOfMessages": "0",
    "ReceiveMessageWaitTimeSeconds": "0",
    "DelaySeconds": "0",
    "VisibilityTimeout": "30",
    "LastModifiedTimestamp": "1442426968",
    "QueueArn": "arn:aws:sqs:us-east-1:80398EXAMPLE:MyNewQueue"
  }
}
```

## Subscribe to Topic

Subscribes to the topic and queue arn:
```bash
$ aws sns subscribe --topic-arn arn:aws:sns:us-west-2:0123456789012:my-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:80398EXAMPLE:MyNewQueue
```

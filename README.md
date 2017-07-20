# Lambda architecture

![Sample](./SNS-SQS.png)

SNS -> SQS -> Lambda

## Automate the following


1. sns createTopic. Create a topic with a name first which will return the topic arn
2. sqs createQueue, which will return a queue url
3. sqs getQueueAttr, which will return the queue arn from the given queue url
4. snsSubscribe will subscribe to the topic and queue arn
5. sqs setQueueAttr


1. Create a new SNS Topic

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

2. Create an SQS Queue
```bash
$ aws sqs create-queue --queue-name MyQueue
# Output
{
  "QueueUrl": "https://queue.amazonaws.com/80398EXAMPLE/MyQueue"
}
```

3. Get Queue URL

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

4. SNS Subscribe

```bash
$ aws sns subscribe --topic-arn arn:aws:sns:us-west-2:0123456789012:my-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:80398EXAMPLE:MyNewQueue
```

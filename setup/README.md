# setup

Create a topic and sqs queue automatically. You can run it multiple time - it will not replace if the queue already exists.
```javascript
const SNS_TOPIC = 'poc-demo'
const QUEUE_NAME = 'poc-demo'
const AWS_REGION = 'ap-southeast-1'
const AWS_PROFILE = 'poc-delivery'
```
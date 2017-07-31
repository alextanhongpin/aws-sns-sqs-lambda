'use strict'

module.exports.consumer = (event, context, callback) => {
  console.log('Calling subscriber', JSON.stringify(event, null, 2))
}
// Sample payload
// {
//   "Records": [
//     {
//       "EventSource": "aws:sns",
//       "EventVersion": "1.0",
//       "EventSubscriptionArn": "arn:aws:sns:ap-southeast-1:778203360779:sns-poc:34ac0cb7-e9f6-4769-96b8-6eb8d9078f39",
//       "Sns": {
//         "Type": "Notification",
//         "MessageId": "85ac34c3-76d9-5a72-92fe-653ba0dd3902",
//         "TopicArn": "arn:aws:sns:ap-southeast-1:778203360779:sns-poc",
//         "Subject": "Text SNS from Lambda",
//         "Message": "{\"message\":\"Hello world\"}",
//         "Timestamp": "2017-07-31T06:52:52.589Z",
//         "SignatureVersion": "1",
//         "Signature": "Jzr86u2CA/00UQ+89Gbj2Bc8CJbeOW/m1jGZ2KEymucop2jg2U5HdcfwcFI/k1ILnBovWLvRlgozCL6IxblXxBq4897tKrKb8/RnkgbY0r8m1uLzyUb5/DuhK6aQpnWwT0urgyn90V8U5nplp1WTwaWltpLe2Soud5B8Ul65lFkzMchqVvl1HgNynjemFfF7Wd3IzyPiyiN2e55BDhaBrsQVBTPfECo0qC4vt2E6ds5YPuVZGLx0Wh473yskVI2PRN7s/VQvXqfb+QxfpxKWZqZSYj9+37hFU8h4JqoCSASUWGO7h8FwYmht3DnpunlP/aruS3dzhtiaJB/tvFXB7A==",
//         "SigningCertUrl": "https://sns.ap-southeast-1.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a046b3aafc7f4149a.pem",
//         "UnsubscribeUrl": "https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:778203360779:sns-poc:34ac0cb7-e9f6-4769-96b8-6eb8d9078f39",
//         "MessageAttributes": {}
//       }
//     }
//   ]
// }

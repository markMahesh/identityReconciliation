# identityReconciliation
microservice for bitespeed

# Endpoint
1. service health check api: GET https://identityreconciliation-v4l6.onrender.com  
                    resp: Hello, world!  

2. identity endpoint:[ https://bitespeedidentityreconciliation.onrender.com/identify](https://identityreconciliation-v4l6.onrender.com/identify)  
   2.1 ReqBody: ```{
    "phoneNumber": "2",
    "email": "1"
}```  
   2.2 Response: 
```
{"contact":{"primaryContatctId":5,"emails":["1"],"phoneNumbers":["2"],"secondaryContactIds":[]}}
```  
                    
2.3 Curl command to hit the api: `curl --location 'https://identityreconciliation-v4l6.onrender.com/identify' \
--header 'Content-Type: application/json' \
--data '{
    "phoneNumber": "2",
    "email": "1"
}'`


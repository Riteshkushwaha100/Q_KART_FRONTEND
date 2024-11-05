For adding the Product in the Cart 

curl 'http://localhost:8082/api/v1/cart'   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNoZW5uYWkiLCJpYXQiOjE3Mjk1OTMxNTIsImV4cCI6MTcyOTYxNDc1Mn0.hlTh9vlJiNNjhKScPMudyv6hxFLKN7b5Ex8YHuyFiVs'   -H 'Content-Type: application/json'   --data-raw '{"productId":"BW0jAAeDJmlZCF8i","qty":1}'



#For Checking the  Product in the Cart 

curl 'http://localhost:8082/api/v1/cart'   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNoZW5uYWkiLCJpYXQiOjE3Mjk1MzU3MDYsImV4cCI6MTcyOTU1NzMwNn0.2KpLSbAOWw8mUWlzf8hWgJJhP8e1MLEQhV1wTuie40w'

working 

curl 'http://localhost:8082/api/v1/cart'
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNoZW5uYWkiLCJpYXQiOjE3Mjk3MTA2MjQsImV4cCI6MTcyOTczMjIyNH0.aE6gp2M8QExxedQsW0vh9VlJ9RGl0PxnRRmdvTWrYR0'

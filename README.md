Created as response to a test. 

# API Proxy

## Aim

To provide API that returns the second result from a google search in JSON

## Implementation

Written with node and express
Integrates with Google custom search engine using google API.

## Build and deploy

Docker is used manage the build, test and runtime environments

Test with: `docker-compose run --service-ports -e google_cse_id={yourcse} -e google_api_key={yourkey} node test`

Run with:
'''
export google_cse_id={yourcse}
export google_api_key={yourkey}
docker-compose up
'''

## Usage

`curl http://localhost:3000/api/v1/searchproxy/?q=acrobatics`

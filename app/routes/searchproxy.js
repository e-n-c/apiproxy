var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var _ = require('lodash')

var query_response_title = "body.items[0].title"
var query_response_link = "body.items[0].link"

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!_.has(req, 'query.q')) {
      var error = {
        message : "Missing required q query parameter"
      }
      console.log(error)
      res.status(400).send(error)
  } else {
    superagent.get("https://www.googleapis.com/customsearch/v1")
    .accept('application/json')
    .query({q : req.query.q})
    .query({start : 2})
    .query({num : 1})
    .query({cx : process.env.google_cse_id})
    .query({key : process.env.google_api_key})
    .then(function(query_result) {
      if(query_result.status == 200 &&
         _.has(query_result, query_response_title) && 
         _.has(query_result, query_response_link)) {
        res.status(200)
           .contentType('application/json')
           .send({title : _.get(query_result, query_response_title),
                  link : _.get(query_result, query_response_link)})
      } else {
      console.log("else")
        var error = {
          message : "Unhandled result from query API",
          query_status : _.get(query_result, 'status', "Missing"),
          title : _.get(query_result, query_response_title, "Missing"),
          link : _.get(query_result, query_response_link, "Missing"),
        }
        console.log(error)
        res.status(500).send(error)
      }
    })
    .catch(function (query_error) {
      var errors = JSON.parse(_.get(query_error, 'response.text', '{"error":{"errors":["unknown"]}'))
      var error = {
        message : "Error occured calling query API",
        errors : _.get(errors, 'error.errors', "unknown"),
        query_status : _.get(query_error, 'status', "unknown") 
      }
      console.log(error)
      res.status(500).send(error)
    })
  }
});

module.exports = router;

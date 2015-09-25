#! /usr/bin/env node

var userArgs = process.argv.slice(2);

var url = userArgs[0];
var dest = userArgs[1];
var className = userArgs[2];
var type = userArgs[3];
if (!type) type = 'angular';

if (!url || !dest || !className) {
    console.error("You must supply url and dest path. Ex:");
    console.error("swagger-generator http://localhost:8080/api/api-docs.json/api fileName className");
    return;
}

var fs = require('fs');
var CodeGen = require('swagger-js-codegen').CodeGen;

var request = require('request');
request(url, function (error, response, body) {
    if (error) {
        console.error("Error fetching "+url);
        console.error(error);
        return;
    }

    if (!error && response.statusCode == 200) {
        //console.log(body);
        var swagger = JSON.parse(body);
        var code = null;
        if (type=='angular') {
            code = CodeGen.getAngularCode({ className: className, swagger: swagger });
        } else {
            code = CodeGen.getNodeCode({ className: className, swagger: swagger });
        }

        fs.writeFile(dest, code, function(err) {
            if(err) {
                return console.error(err);
            }
        });

    }



});

require('date-utils');
var request = require('request');
var crypto = require('crypto');
var dateStr = (new Date()).toFormat("YYYYMMDD");
var Q = require("q");

function getBasicToken(type) {
	var salt = 'restyougouwxg1qw23er4',
		shasum = crypto.createHash('md5');

	switch(type) {
	case "basic-none":
	token = {};
	break;

	case "basic-invalid":
	token = {"wexkey": "1234", "wextoken": "321"}
	break;

	case "basic-expired":
	var key = (new Date()).getTime() - 12 * 60 * 60 * 1000, token;
	shasum.update(key + salt + dateStr);
	token = {"wexkey": key, "wextoken": shasum.digest('hex')}
	break;

	case "basic-valid":
	var key = (new Date()).getTime(), token;
	shasum.update(key + salt + dateStr);
	token = {"wexkey": key, "wextoken": shasum.digest('hex')}
	break;
	}
	//console.info(token);
	return token;
}

function getUserToken(user) {
    var salt = 'restyougouwxg1qw23er4',
        shasum = crypto.createHash('md5');

    var key = (new Date()).getTime();
    shasum.update(key + salt + user);
    return {
        "wexuser": user,
        "wexkey": key,
        "wextoken": shasum.digest('hex')
    };
}
function getToken(opts) {
    return opts.user ? getUserToken(opts.user) : getBasicToken(opts.token);
}
module.exports.getBasicToken = getBasicToken;
module.exports.getToken = getToken;


var SERVER = "http://localhost:8081";

module.exports.config = function() {
	return {
		SERVER: SERVER
	};
};
module.exports.auth = function(url, data, options) {
    var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'POST',
        form: data
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.queryPaging = function(url, options) {
    var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.queryPagingList = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.result);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.queryAll = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.create = function(url, data, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'POST',
        headers: getToken(options),
        form: data
    }, function callback(error, response, body) {
    	//console.info(body);
        if (!error && response.statusCode == 201) {
        	var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.message);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.get = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonitem = JSON.parse(body);
            deferred.resolve(jsonitem);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.update = function(url, data, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'POST',
        headers: getToken(options),
        form: data
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
        	var jsondata = JSON.parse(body);
            deferred.resolve(jsondata);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.remove = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'DELETE',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(true);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.run = function(url, options) {
    var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getToken(options)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve({});
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
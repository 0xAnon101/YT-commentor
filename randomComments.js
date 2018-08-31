var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var comment = function (videoId) {


    return new Promise((resolve, reject) => {
        var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
        var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
            process.env.USERPROFILE) + '/.credentials/';
        var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }

            authorize(JSON.parse(content), {
                'params': {
                    'part': 'snippet',
                    'videoId': videoId
                }
            }, commentThreadsListByVideoId);

        });


        function authorize(credentials, requestData, callback) {
            var clientSecret = credentials.installed.client_secret;
            var clientId = credentials.installed.client_id;
            var redirectUrl = credentials.installed.redirect_uris[0];
            var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);


            fs.readFile(TOKEN_PATH, function (err, token) {
                if (err) {
                    getNewToken(oauth2Client, requestData, callback);
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    callback(oauth2Client, requestData);
                }
            });
        }


        function getNewToken(oauth2Client, requestData, callback) {
            var authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            console.log('Authorize this app by visiting this url: ', authUrl);
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter the code from that page here: ', function (code) {
                rl.close();
                oauth2Client.getToken(code, function (err, token) {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        return;
                    }
                    oauth2Client.credentials = token;
                    storeToken(token);
                    callback(oauth2Client, requestData);
                });
            });
        }

    
        function storeToken(token) {
            try {
              fs.mkdirSync(TOKEN_DIR);
            } catch (err) {
              if (err.code != 'EEXIST') {
                throw err;
              }
            }
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) throw err;
              console.log('Token stored to ' + TOKEN_PATH);
            });
            console.log('Token stored to ' + TOKEN_PATH);
          }
          

        function removeEmptyParameters(params) {
            for (var p in params) {
                if (!params[p] || params[p] == 'undefined') {
                    delete params[p];
                }
            }
            return params;
        }

        function createResource(properties) {
            var resource = {};
            var normalizedProps = properties;
            for (var p in properties) {
                var value = properties[p];
                if (p && p.substr(-2, 2) == '[]') {
                    var adjustedName = p.replace('[]', '');
                    if (value) {
                        normalizedProps[adjustedName] = value.split(',');
                    }
                    delete normalizedProps[p];
                }
            }
            for (var p in normalizedProps) {
                if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
                    var propArray = p.split('.');
                    var ref = resource;
                    for (var pa = 0; pa < propArray.length; pa++) {
                        var key = propArray[pa];
                        if (pa == propArray.length - 1) {
                            ref[key] = normalizedProps[p];
                        } else {
                            ref = ref[key] = ref[key] || {};
                        }
                    }
                };
            }
            return resource;
        }


        function commentThreadsListByVideoId(auth, requestData) {
            var service = google.youtube('v3');
            var parameters = removeEmptyParameters(requestData['params']);
            parameters['auth'] = auth;
            service.commentThreads.list(parameters, function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject("No Comments found")
                 
                }
               else 
                resolve(response);
            });
        }

    });
}

module.exports.comment = comment;
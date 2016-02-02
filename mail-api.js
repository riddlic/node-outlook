// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var base = require('./version-2.js');
var utilities = require('./utilities.js');

module.exports = {
  /**
   * Used to get messages from a folder.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.folderId] {string} The folder id. If absent, the API calls the `/User/Messages` endpoint. Valid values of this parameter are:
   * 
   * - The `Id` property of a `MailFolder` entity
   * - `Inbox`
   * - `Drafts`
   * - `SentItems`
   * - `DeletedItems`
   * 
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * 
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  getMessages: function(parameters, callback){
    var userSpec = utilities.getUserSegment(parameters);
    var folderSpec = parameters.folderId === undefined ? '' : getFolderSegment() + parameters.folderId;
    
    var requestUrl = base.apiEndpoint() + userSpec + folderSpec + '/Messages';
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Used to get a specific message.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.messageId {string} The Id of the message.
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  getMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Messages/' + parameters.messageId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Create a new message
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.message {object}: The JSON-serializable message 
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.folderId] {string} The folder id. If absent, the API calls the `/User/Messages` endpoint.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  createMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    var folderSpec = parameters.folderId === undefined ? '' : getFolderSegment() + parameters.folderId;
    
    var requestUrl = base.apiEndpoint() + userSpec + folderSpec + '/Messages';
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      payload: parameters.message,
      method: 'POST'
    };
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 201) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Update a specific message.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.messageId {string} The Id of the message.
   * @param parameters.update {object}: The JSON-serializable update payload 
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  updateMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Messages/' + parameters.messageId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      payload: parameters.update,
      method: 'PATCH'
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Delete a specific message.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.messageId {string} The Id of the message.
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  deleteMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Messages/' + parameters.messageId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      method: 'DELETE'
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 204) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Sends a new message
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.message {object}: The JSON-serializable message 
   * @param [parameters.saveToSentItems] {boolean}: Set to false to bypass saving a copy to the Sent Items folder. Default is true.
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  sendNewMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/sendmail';
    
    var payload = {
      Message: parameters.message,
      SaveToSentItems: parameters.saveToSentItems !== undefined ? parameters.saveToSentItems : 'true'
    };
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      payload: payload,
      method: 'POST'
    };
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 202) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Sends a draft message.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.messageId {string} The Id of the message.
   * @param [parameters.useMe] {boolean} If true, use the /Me segment instead of the /Users/<email> segment. This parameter defaults to false and is ignored if the parameters.user.email parameter isn't provided (the /Me segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the '/Me' segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   */
  sendDraftMessage: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Messages/' + parameters.messageId + '/send';
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      method: 'POST'
    };
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 202) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
};

/**
 * Helper function to return the correct name for the folders segment
 * of the request URL. /Me/Folders became /Me/MailFolders in the beta and
 * 2.0 endpoints.
 */
var getFolderSegment = function() {
  if (base.apiEndpoint().toLowerCase().indexOf('/api/v1.0') > 0){
    return '/Folders/';
  }
  
  return '/MailFolders/'
}

/*
  MIT License: 

  Permission is hereby granted, free of charge, to any person obtaining 
  a copy of this software and associated documentation files (the 
  ""Software""), to deal in the Software without restriction, including 
  without limitation the rights to use, copy, modify, merge, publish, 
  distribute, sublicense, and/or sell copies of the Software, and to 
  permit persons to whom the Software is furnished to do so, subject to 
  the following conditions: 

  The above copyright notice and this permission notice shall be 
  included in all copies or substantial portions of the Software. 

  THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, 
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
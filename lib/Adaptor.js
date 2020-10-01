"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.post = post;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("language-common");

var _axios = _interopRequireDefault(require("axios"));

var _url = require("url");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
function execute() {
  for (var _len = arguments.length, operations = new Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };
  return function (state) {
    return _languageCommon.execute.apply(void 0, operations)(_objectSpread(_objectSpread({}, initialState), state));
  };
}
/**
 * Make a POST request
 * @example
 * execute(
 *   post(params)
 * )(state)
 * @constructor
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */


function post(params, callback) {
  return function (state) {
    var _state$configuration = state.configuration,
        baseUrl = _state$configuration.baseUrl,
        username = _state$configuration.username,
        password = _state$configuration.password;

    var _expandReferences = (0, _languageCommon.expandReferences)(params)(state),
        url = _expandReferences.url,
        body = _expandReferences.body,
        headers = _expandReferences.headers;

    return (0, _axios["default"])({
      method: 'post',
      headers: {},
      params: {},
      baseURL: baseURL,
      url: url,
      data: body,
      auth: {
        username: username,
        password: password
      }
    }).then(function (response) {
      console.log('Printing response...\n', JSON.stringify(response, null, 4) + '\n', 'POST succeeded.');
      var nextState = (0, _languageCommon.composeNextState)(state, response);
      if (callback) (0, _path.resolve)(callback(nextState));
      (0, _path.resolve)(nextState);
    })["catch"](function (error) {
      console.log(error);
      reject(error);
    });
  };
} // Note that we expose the entire axios package to the user here.


exports.axios = _axios["default"]; // What functions do you want from the common adaptor?

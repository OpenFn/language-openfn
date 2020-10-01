"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.request = request;
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
    return _languageCommon.execute.apply(void 0, [login].concat(operations))(_objectSpread(_objectSpread({}, initialState), state)); // .catch(e => {
    //   console.error(e);
    //   logout;
    //   process.exit(1);
    // });
  };
}

function login(state) {
  var _state$configuration = state.configuration,
      host = _state$configuration.host,
      password = _state$configuration.password,
      username = _state$configuration.username;
  return (0, _axios["default"])({
    method: 'post',
    url: "".concat(host, "/api/login"),
    data: {
      session: {
        email: username,
        password: password
      }
    }
  }).then(function (response) {
    console.log('Authentication succeeded.');
    var jwt = response.data.jwt;
    return _objectSpread(_objectSpread({}, state), {}, {
      configuration: {
        host: host,
        jwt: jwt
      }
    });
  });
}

function logout(state) {
  var jwt = state.jwt;
  var host = state.configuration.host;
  return (0, _axios["default"])({
    method: 'post',
    url: "".concat(host, "/api/logout"),
    headers: {
      Authorization: "Bearer ".concat(jwt)
    }
  }).then(function () {
    delete state.configuration;
    (0, _path.resolve)(state);
  });
}
/**
 * Make a request to the api
 * @example
 * execute(
 *   request({ method: get, path: '/jobs' })
 * )(state)
 * @constructor
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */


function request(options, callback) {
  return function (state) {
    var _state$configuration2 = state.configuration,
        host = _state$configuration2.host,
        jwt = _state$configuration2.jwt;

    var _expandReferences = (0, _languageCommon.expandReferences)(options)(state),
        method = _expandReferences.method,
        path = _expandReferences.path,
        params = _expandReferences.params,
        data = _expandReferences.data;

    return (0, _axios["default"])({
      method: method,
      headers: {
        Authorization: "Bearer ".concat(jwt)
      },
      url: "".concat(host, "/api/").concat(path),
      params: params,
      data: data
    }).then(function (response) {
      var data = response.data;
      var nextState = (0, _languageCommon.composeNextState)(state, data);

      if (callback) {
        return callback(nextState);
      }

      return nextState;
    });
  };
}

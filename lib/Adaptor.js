"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.request = request;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "beta", {
  enumerable: true,
  get: function () {
    return _languageCommon.beta;
  }
});
Object.defineProperty(exports, "combine", {
  enumerable: true,
  get: function () {
    return _languageCommon.combine;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fn", {
  enumerable: true,
  get: function () {
    return _languageCommon.fn;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

var _axios = _interopRequireDefault(require("axios"));

var _url = require("url");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  };
  return state => {
    return (0, _languageCommon.execute)(login, ...operations // logout
    )({ ...initialState,
      ...state
    }); // .catch(e => {
    //   console.error(e);
    //   logout;
    //   process.exit(1);
    // });
  };
}

function login(state) {
  const {
    configuration
  } = state;
  const {
    host,
    password,
    username
  } = configuration;
  return (0, _axios.default)({
    method: 'post',
    url: `${host}/api/login`,
    data: {
      session: {
        email: username,
        password: password
      }
    }
  }).then(response => {
    console.log('Authentication succeeded.');
    const {
      jwt
    } = response.data;
    return { ...state,
      configuration: { ...configuration,
        host,
        jwt
      }
    };
  });
}

function logout(state) {
  const {
    jwt
  } = state;
  const {
    host
  } = state.configuration;
  return (0, _axios.default)({
    method: 'post',
    url: `${host}/api/logout`,
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  }).then(() => {
    delete state.configuration;
    (0, _path.resolve)(state);
  });
}
/**
 * Make a POST request
 * @public
 * @example
 *  request({method: 'get', path: '/jobs/});
 * @constructor
 * @param {object} options - Body, Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */


function request(options, callback) {
  return state => {
    const {
      host,
      jwt
    } = state.configuration;
    const {
      method,
      path,
      params,
      data
    } = (0, _languageCommon.expandReferences)(options)(state);
    return (0, _axios.default)({
      method,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      url: `${host}/api/${path}`,
      params,
      data
    }).then(response => {
      const {
        data
      } = response;
      const nextState = (0, _languageCommon.composeNextState)(state, data);

      if (callback) {
        return callback(nextState);
      }

      return nextState;
    });
  };
}
import {
  execute as commonExecute,
  composeNextState,
  expandReferences,
} from 'language-common';
import axios from 'axios';
import { resolve as resolveUrl } from 'url';
import { resolve } from 'path';

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
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return state => {
    return commonExecute(
      login,
      ...operations
      // logout
    )({ ...initialState, ...state });
    // .catch(e => {
    //   console.error(e);
    //   logout;
    //   process.exit(1);
    // });
  };
}

function login(state) {
  const { host, password, username } = state.configuration;

  return axios({
    method: 'post',
    url: `${host}/api/login`,
    data: {
      session: {
        email: username,
        password: password,
      },
    },
  }).then(response => {
    console.log('Authentication succeeded.');
    const { jwt } = response.data;
    return { ...state, configuration: { host, jwt } };
  });
}

function logout(state) {
  const { jwt } = state;
  const { host } = state.configuration;
  return axios({
    method: 'post',
    url: `${host}/api/logout`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  }).then(() => {
    delete state.configuration;
    resolve(state);
  });
}

/**
 * Make a request to the api
 * @example
 * request({ method: get, path: '/jobs' })
 * @constructor
 * @param {object} params - data to make the request
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function request(options, callback) {
  return state => {
    const { host, jwt } = state.configuration;
    const { method, path, params, data } = expandReferences(options)(state);

    return axios({
      method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      url: `${host}/api/${path}`,
      params,
      data,
    }).then(response => {
      const { data } = response;
      const nextState = composeNextState(state, data);
      if (callback) {
        return callback(nextState);
      }
      return nextState;
    });
  };
}

export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  lastReferenceValue,
  merge,
  sourceValue,
} from 'language-common';

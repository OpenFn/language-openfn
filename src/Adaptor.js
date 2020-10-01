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
    return commonExecute(...operations)({
      ...initialState,
      ...state,
    });
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
export function post(params, callback) {
  return state => {
    const { baseUrl, username, password } = state.configuration;
    const { url, body, headers } = expandReferences(params)(state);

    return axios({
      method: 'post',
      headers: {},
      params: {},
      baseURL,
      url,
      data: body,
      auth: { username, password },
    })
      .then(response => {
        console.log(
          'Printing response...\n',
          JSON.stringify(response, null, 4) + '\n',
          'POST succeeded.'
        );

        const nextState = composeNextState(state, response);
        if (callback) resolve(callback(nextState));
        resolve(nextState);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  };
}

// Note that we expose the entire axios package to the user here.
exports.axios = axios;

// What functions do you want from the common adaptor?
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

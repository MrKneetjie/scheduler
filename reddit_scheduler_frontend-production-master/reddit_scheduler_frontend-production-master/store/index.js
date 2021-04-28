import { makeAuthPlugin, initAuth, hydrateApi, models } from '~/plugins/feathers'

const auth = makeAuthPlugin({

  userService: 'users',
  entityIdField: 'id',
  state: {
    publicPages: [
      'login',
      'signup',
      'password',
      'reset',
      'verify'
    ],
  },

  actions: {
    onInitAuth ({ state, commit, dispatch }, payload) {
      if (payload) {
        dispatch('authenticate', { strategy: 'jwt', accessToken: state.accessToken })
          .then((result) => {
            // handle success like a boss
            console.log('logged in',result)
          })
          .catch((error) => {
            // handle error like a boss
            console.log(error)
          });
      }
    }
  }
});

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);

const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);

export const modules = {
  // Custom modules
};

export const state = () => ({
  // Custom state
  message: {}
});

export const mutations = {
  // Custom mutations
  showMessage(state, message){
    state.message = message;
  }
};

export const actions = {
  // Custom actions
  nuxtServerInit ({ commit, dispatch }, { req }) {
    return initAuth({
      commit,
      dispatch,
      req,
      moduleName: 'auth',
      cookieName: 'feathers-jwt'
    })
  },

  nuxtClientInit ({ state, dispatch, commit }, context) {
    hydrateApi({ api: models.api })
    if (state.auth.accessToken) {
      return dispatch('auth/onInitAuth', state.auth.payload)
    }
  }

};

export const getters = {
  // Custom getters
}

export const plugins = [ auth, ...servicePlugins ]

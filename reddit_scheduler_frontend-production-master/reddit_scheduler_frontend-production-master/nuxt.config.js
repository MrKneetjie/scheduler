module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'reddit_scheduler_frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'frontend for reddit scheduler' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  
  env: {
	  API_URL: process.env.API_URL || 'https://onlybands.xyz/reddit_api' 
  },

  router: {
    base: '/scheduler/',
    middleware: [
      'feathers'
    ]
  },

  plugins: [
    { src: '~/plugins/feathers-vuex.js' },
    { src: '~/plugins/persistedState.js' },
    { src: '~/plugins/papaparse.js' },
    { src: '~/plugins/date-time-picker.js', ssr: false },
    
  ],
  
  modules: [
    'nuxt-client-init-module',

  ],

  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    transpile: ['feathers-vuex','vue-papa-parse'],
    extractCSS: true
  },
  
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],

  vuetify: {
    theme: {
      dark: true
    },
    icons: {
      iconFont: 'mdi'
    }
  }
}


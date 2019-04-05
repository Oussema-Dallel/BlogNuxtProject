const pkg = require('./package')

const bodyParser = require('body-parser')


module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'WD Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'my first nuxt js app' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href : 'https://fonts.googleapis.com/css?family=Open+Sans'}
    ]
  },

 
  //store: 'vuex-simple-module', // default to `@nuxt/vue-app-store` 


  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f', height : '4px', duration : 5000 },
  loadingIndicator : {
    name : 'circle',
    color : 'fa923f'
  },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],

  axios : {
    baseURL : process.env.BASE_URL || "https://nuxt-blog-56ac1.firebaseio.com/",
    credentials : false
  },

  //store: 'vuex-simple-module', // default to `@nuxt/vue-app-store`

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },

  env : {
    baseUrl : process.env.BASE_URL || "https://nuxt-blog-56ac1.firebaseio.com/",
    fbAPIKey : 'AIzaSyCJSwbWZdlE3aJ2EowzhSjHU8f6hxIdfEo'
  },

  serverMiddleware : [
    bodyParser.json(),
    '~/api'
  ]
}

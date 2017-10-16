const noop = require('lodash/noop')

const Router = require('express/lib/router')

const promiseResolveArgs = (methodProvider) => function (...args) {
  const context = this

  for (const indexArg in args) {
    const arg = args[indexArg]
    if (typeof arg === 'function') {
      const fn = arg
      args[indexArg] = (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
    }
  }

  this[methodProvider](...args)
}

Router.getAsync = promiseResolveArgs('get')
Router.postAsync = promiseResolveArgs('post')
Router.headAsync = promiseResolveArgs('head')
Router.deleteAsync = promiseResolveArgs('delete')
Router.putAsync = promiseResolveArgs('put')
Router.useAsync = promiseResolveArgs('use')

module.exports = noop

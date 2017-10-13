const makeRefApp = (router, methodNameRef, method) => {
  router[methodNameRef] = (path, fn) => {

    router[method](path, (req, res, next) => {
      Promise
      .resolve(fn(req, res, next))
      .catch(next)
    })

  }
}

module.exports = (router) => {
  makeRefApp(router, 'getAsync', 'get')
  makeRefApp(router, 'postAsync', 'post')
  makeRefApp(router, 'putAsync', 'put')
  makeRefApp(router, 'deleteAsync', 'delete')
  makeRefApp(router, 'headAsync', 'head')
  makeRefApp(router, 'useAsync', 'use')
  return router
}

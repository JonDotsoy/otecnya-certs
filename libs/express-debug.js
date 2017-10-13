
/* Muestra un log del request */
module.exports = function (req, res, next) {
  console.log(`[${req.method}] ${req.path}`) // Ej. [GET] /hello/world

  next()
}

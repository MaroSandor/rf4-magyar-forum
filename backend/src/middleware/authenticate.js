// authenticate middleware
// Minden védett route elé kerül — ellenőrzi a JWT cookie-t.
//
// Ha érvényes: req.user = { id, username, role } → továbbenged
// Ha hiányzik vagy érvénytelen: 401 Unauthorized

const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  // A cookie-parser már parse-olta a cookie-kat, req.cookies-ban vannak
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ error: 'Bejelentkezés szükséges.' })
  }

  try {
    // jwt.verify() ellenőrzi az aláírást és a lejáratot egyszerre
    // Ha bármelyik hibás, kivételt dob → catch blokkba kerülünk
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // A dekódolt payload bekerül a request objektumba
    // Így bármely route handlerben elérhető: req.user.id, req.user.role stb.
    req.user = decoded

    next()
  } catch (err) {
    // TokenExpiredError = lejárt, JsonWebTokenError = manipulált/hibás
    const message = err.name === 'TokenExpiredError'
      ? 'A munkamenet lejárt, kérjük lépj be újra.'
      : 'Érvénytelen token.'

    return res.status(401).json({ error: message })
  }
}

module.exports = { authenticate }

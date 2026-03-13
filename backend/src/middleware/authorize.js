// authorize middleware — szerepkör ellenőrzés
// Mindig az authenticate UTÁN fut (szükség van req.user-re).
//
// Használat: authorize('moderator', 'admin')
// → csak moderátor és admin férhet hozzá

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Bejelentkezés szükséges.' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Ehhez ${roles.join(' vagy ')} jogosultság szükséges.`
      })
    }

    next()
  }
}

module.exports = { authorize }

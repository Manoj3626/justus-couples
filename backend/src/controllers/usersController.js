exports.me = async (req, res) => {
  try {
    const user = req.user.toObject()
    delete user.password
    return res.json({ user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

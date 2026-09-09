exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
    res.clearCookie('justus_token', cookieOptions)
    return res.json({ message: 'Logged out' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

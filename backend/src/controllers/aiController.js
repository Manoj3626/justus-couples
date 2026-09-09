exports.suggestDates = async (req, res) => {
  try {
    const { mood, budget, locationType } = req.body || {}
    const apiKey = process.env.GEMINI_API_KEY

    let dateIdeas = []

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Provide 4 creative couple date ideas based on: Mood=${mood || 'Romantic'}, Budget=${budget || 'Moderate'}, Location=${locationType || 'Indoor/Outdoor'}. Format response as a JSON array of objects with keys: title, description, category, estimatedCost. Output ONLY valid JSON array.`,
                    },
                  ],
                },
              ],
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            const cleanJson = text.replace(/```json|```/g, '').trim()
            dateIdeas = JSON.parse(cleanJson)
          }
        }
      } catch (e) {
        console.warn('Gemini API call warning:', e.message)
      }
    }

    // Fallback curated suggestions if API unconfigured or call fails
    if (!Array.isArray(dateIdeas) || dateIdeas.length === 0) {
      dateIdeas = [
        {
          title: 'Candlelight Cooking Challenge 🍝',
          description: 'Cook a 3-course dinner together using only ingredients you already have in the kitchen.',
          category: 'Cozy Indoor',
          estimatedCost: 'Free / Low',
        },
        {
          title: 'Sunset Stargazing Picnic 🌌',
          description: 'Pack warm blankets, hot cocoa, and your favorite playlist for a night under the stars.',
          category: 'Romantic Outdoor',
          estimatedCost: 'Low',
        },
        {
          title: 'DIY Private Arcade & Board Game Night 🎲',
          description: 'Create mini multiplayer gaming challenges with snacks, scores, and funny prizes.',
          category: 'Fun & Playful',
          estimatedCost: 'Low',
        },
        {
          title: 'Memory Lane Photo Hunt 📸',
          description: 'Recreate your favorite past photo memories together at home or around your neighborhood.',
          category: 'Nostalgic',
          estimatedCost: 'Free',
        },
      ]
    }

    return res.json({ suggestions: dateIdeas })
  } catch (err) {
    console.error('Error suggesting dates:', err)
    return res.status(500).json({ message: 'Server error generating date suggestions.' })
  }
}

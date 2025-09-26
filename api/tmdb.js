module.exports = async (req, res) => {
  try {
    const { list = "movie_popular", page = "1", language = "pt-BR" } = req.query;

    const MAP = {
      movie_popular: `https://api.themoviedb.org/3/movie/popular?language=${language}&page=${page}`,
      tv_popular:    `https://api.themoviedb.org/3/tv/popular?language=${language}&page=${page}`,
      trending_day:  `https://api.themoviedb.org/3/trending/all/day?language=${language}`,
      trending_week: `https://api.themoviedb.org/3/trending/all/week?language=${language}`
    };

    const url = MAP[list];
    if (!url) return res.status(400).json({ error: "invalid_list" });

    const token = process.env.TMDB_TOKEN; // TMDB v4 Read Access Token (Bearer)
    if (!token) return res.status(500).json({ error: "server_not_configured" });

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }

    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=600"); // CDN 15min
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "unexpected_error", detail: String(e) });
  }
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.shortapi.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SHORTAPI_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: 5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      video_url: data.video_url
    });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}

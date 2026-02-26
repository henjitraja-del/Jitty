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

    const text = await response.text();

    // Return raw response for debugging
    return res.status(response.status).json({
      status: response.status,
      raw_response: text
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server crash",
      details: error.message
    });
  }
}

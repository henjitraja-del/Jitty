export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.shortapi.ai/api/v1/job/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SHORTAPI_KEY}`
        },
        body: JSON.stringify({
          model: "google/veo-3.1/text-to-video",
          args: {
            mode: "quality",
            prompt: "A cat blinking"
          }
        })
      }
    );

    const text = await response.text();

    return res.status(response.status).send(text);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const createResponse = await fetch(
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
            prompt: prompt
          }
        })
      }
    );

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      return res.status(500).json({ step: "create job failed", data: createData });
    }

    const jobId = createData.job_id;

    await new Promise(resolve => setTimeout(resolve, 5000));

    const statusResponse = await fetch(
      `https://api.shortapi.ai/api/v1/job/query?id=${jobId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.SHORTAPI_KEY}`
        }
      }
    );

    const statusText = await statusResponse.text();

    return res.status(200).json({
      job_id: jobId,
      raw_status_response: statusText
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server crash",
      details: error.message
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    // STEP 1: Create Job
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
      return res.status(500).json({ error: createData });
    }

    const jobId = createData.job_id;

    // STEP 2: Poll for completion (max ~2 minutes)
    let videoUrl = null;

    for (let i = 0; i < 20; i++) {
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

      const statusData = await statusResponse.json();

      if (statusData.status === "completed") {
        videoUrl = statusData.output?.video_url;
        break;
      }

      if (statusData.status === "failed") {
        return res.status(500).json({ error: "Video generation failed." });
      }
    }

    if (!videoUrl) {
      return res.status(500).json({ error: "Video timed out." });
    }

    return res.status(200).json({ video_url: videoUrl });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}

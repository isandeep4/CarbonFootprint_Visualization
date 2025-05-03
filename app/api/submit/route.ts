export async function POST(req) {
  try {
    const body = await req.json();
    const apiEndpoint =
      "https://f4n690ljh0.execute-api.us-east-1.amazonaws.com/save-carbon-footprint";
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return Response.json({ success: true, message: "Data received." });
  } catch (error) {
    console.error("Error in API:", error);
  }
}

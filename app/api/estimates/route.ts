export async function POST(req, res) {
  try {
    const body = req.json();
    const response = await fetch("/data/v1/search?data_version=27.27&results_per_page=500&page=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
  } catch (error) {
    
  }
}
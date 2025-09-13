// api/download.js
export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL gambar tidak ada" });
    }

    const response = await fetch(url); // pakai fetch bawaan Node.js
    if (!response.ok) {
      return res.status(500).json({ error: "Gagal mengambil gambar" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "attachment; filename=quoted.png");
    res.status(200).end(buffer);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}

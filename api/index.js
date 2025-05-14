export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'Jacky-v2';
  const REPO_NAME = 'contohdb';
  const FILE_PATH = 'dtbs.json';

  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await getRes.json();
    const sha = json.sha;
    const data = JSON.parse(atob(json.content)).data || [];

    if (data.includes(phone)) return res.status(400).json({ message: 'Nomor sudah ada' });

    data.push(phone);
    const updated = JSON.stringify({ data }, null, 2);
    const base64 = Buffer.from(updated).toString('base64');

    const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Tambah nomor ${phone}`,
        content: base64,
        sha
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return res.status(500).json({ message: err.message });
    }

    return res.status(200).json({ message: 'Berhasil' });

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

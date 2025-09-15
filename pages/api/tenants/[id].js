import connect from '../../../lib/mongoose';
import Tenant from '../../../models/Tenant';

export default async function handler(req, res) {
  await connect();
  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    const t = await Tenant.findById(id);
    if (!t) return res.status(404).json({ success: false });
    return res.json({ success: true, data: t });
  }

  if (method === 'PUT') {
    const body = req.body;
    const t = await Tenant.findByIdAndUpdate(id, body, { new: true });
    return res.json({ success: true, data: t });
  }

  if (method === 'DELETE') {
    await Tenant.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
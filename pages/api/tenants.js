import connect from '../../lib/mongoose';
import Tenant from '../../models/Tenant';

export default async function handler(req, res) {
  await connect();
  if (req.method === 'GET') {
    const tenants = await Tenant.find().sort({ created_at: -1 });
    return res.json({ success: true, data: tenants });
  }

  if (req.method === 'POST') {
    const { name, phone, room, rent_amount, due_date } = req.body;
    if (!name || !phone || !due_date) return res.status(400).json({ success: false, message: 'name, phone, due_date required' });

    const t = await Tenant.create({ name, phone, room, rent_amount, due_date });
    return res.json({ success: true, data: t });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
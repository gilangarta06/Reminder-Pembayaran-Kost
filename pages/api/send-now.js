import connect from '../../lib/mongoose';
import Tenant from '../../models/Tenant';
import { sendMessage } from '../../cron/worker';

export default async function handler(req, res) {
  await connect();
  if (req.method !== 'POST') return res.status(405).end();
  const { tenantId } = req.body;
  if (!tenantId) return res.status(400).json({ success: false, message: 'tenantId required' });

  const t = await Tenant.findById(tenantId);
  if (!t) return res.status(404).json({ success: false, message: 'tenant not found' });

  const result = await sendMessage(t, 'manual');
  return res.json({ success: result.success, result });
}
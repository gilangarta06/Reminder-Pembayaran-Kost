const cron = require('node-cron');
const axios = require('axios');
const connect = require('../lib/mongoose');
const Tenant = require('../models/Tenant');
const Log = require('../models/Log');

require('dotenv').config();

const MULTICHAT_TOKEN = process.env.MULTICHAT_TOKEN;
const MULTICHAT_INSTANCE = process.env.MULTICHAT_INSTANCE;
const CRON_HOUR = process.env.CRON_HOUR || '8';

if (!MULTICHAT_TOKEN || !MULTICHAT_INSTANCE) {
  console.warn('Warning: MULTICHAT_TOKEN or MULTICHAT_INSTANCE not set. Reminders won\'t be sent.');
}

function formatJid(phone) {
  return `${phone}@s.whatsapp.net`;
}

function rupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

async function sendMessage(tenant, scheduleLabel) {
  if (!MULTICHAT_TOKEN || !MULTICHAT_INSTANCE) {
    return { success: false, error: 'multichat token/instance not set' };
  }

  const jid = formatJid(tenant.phone);
  const dueStr = tenant.due_date.toISOString().slice(0,10);
  const msg = `Halo ${tenant.name}, ini pengingat pembayaran kost kamar ${tenant.room} jatuh tempo ${dueStr}. Total Rp ${rupiah(tenant.rent_amount)}.`;

  const url = `https://app.multichat.id/api/v1/send-text`;
  try {
    const res = await axios.get(url, {
      params: {
        token: MULTICHAT_TOKEN,
        instance_id: MULTICHAT_INSTANCE,
        jid,
        msg
      },
      timeout: 10000
    });

    const success = res.data && (res.data.success === true || res.data.success === 'true');
    await Log.create({ tenant: tenant._id, schedule: scheduleLabel, status: success ? 'success' : 'failed', response: JSON.stringify(res.data) });
    return { success, data: res.data };
  } catch (err) {
    await Log.create({ tenant: tenant._id, schedule: scheduleLabel, status: 'failed', response: err.message });
    return { success: false, error: err.message };
  }
}

async function checkAndSend() {
  await connect();
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  const todayOnly = new Date(Date.UTC(y, m, d));
  const tenants = await Tenant.find();
  for (const t of tenants) {
    const due = new Date(t.due_date);
    const dueOnly = new Date(Date.UTC(due.getFullYear(), due.getMonth(), due.getDate()));
    const diffDays = Math.round((dueOnly - todayOnly) / (1000 * 60 * 60 * 24));

    if (diffDays === 3) {
      await sendMessage(t, '3_days_before');
    } else if (diffDays === 1) {
      await sendMessage(t, '1_day_before');
    } else if (diffDays === 0) {
      await sendMessage(t, 'day_of');
    }
  }
}

let started = false;

function initCron() {
  if (started) return;
  started = true;
  const hour = CRON_HOUR.toString();
  const cronExp = `0 0 ${hour} * * *`;
  console.log('Scheduling daily cron at hour', hour, 'cronExp', cronExp);

  cron.schedule(cronExp, () => {
    console.log('Running daily reminder job', new Date());
    checkAndSend().catch(err => console.error('cron error', err));
  });
}

module.exports = { initCron, checkAndSend, sendMessage };
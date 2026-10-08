import { DurableObject } from 'cloudflare:workers';

const ALLOWED_ORIGINS = [/^https:\/\/mako7200\.github\.io$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];
const PUSH_HOSTS = [/^web\.push\.apple\.com$/, /^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/];
const MAX_AHEAD = 3 * 60 * 60 * 1000;

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.some(re => re.test(origin || ''));
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function isValidId(id) {
  return typeof id === 'string' && /^[0-9a-f-]{36}$/.test(id);
}

function isValidSubscription(sub) {
  try {
    const url = new URL(sub.endpoint);
    return url.protocol === 'https:' && PUSH_HOSTS.some(re => re.test(url.hostname));
  } catch {
    return false;
  }
}

const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const textB64url = text => b64url(new TextEncoder().encode(text));

async function vapidAuth(endpoint, env) {
  const key = await crypto.subtle.importKey('jwk', JSON.parse(env.VAPID_PRIVATE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const header = textB64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const claims = textB64url(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUBJECT }));
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${header}.${claims}`));
  return `vapid t=${header}.${claims}.${b64url(signature)}, k=${env.VAPID_PUBLIC_KEY}`;
}

export class Reminder extends DurableObject {
  async schedule(subscription, endAt) {
    await this.ctx.storage.put('subscription', subscription);
    await this.ctx.storage.setAlarm(endAt);
  }

  async cancel() {
    await this.ctx.storage.deleteAlarm();
    await this.ctx.storage.deleteAll();
  }

  async alarm() {
    const subscription = await this.ctx.storage.get('subscription');
    await this.ctx.storage.deleteAll();
    if (!subscription) return;
    const res = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: { Authorization: await vapidAuth(subscription.endpoint, this.env), TTL: '600', Urgency: 'high', 'Content-Length': '0' }
    });
    if (!res.ok) console.log('push failed', res.status, await res.text());
  }
}

export default {
  async fetch(request, env) {
    const headers = cors(request.headers.get('Origin'));
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response('Not Found', { status: 404, headers });

    const { pathname } = new URL(request.url);
    const body = await request.json().catch(() => null);
    if (!body || !isValidId(body.id)) return new Response('Bad Request', { status: 400, headers });
    const reminder = env.REMINDER.get(env.REMINDER.idFromName(body.id));

    if (pathname === '/schedule') {
      const endAt = Number(body.endAt);
      if (!isValidSubscription(body.subscription) || !(endAt > Date.now() && endAt < Date.now() + MAX_AHEAD)) {
        return new Response('Bad Request', { status: 400, headers });
      }
      await reminder.schedule({ endpoint: body.subscription.endpoint }, endAt);
      return new Response('OK', { headers });
    }
    if (pathname === '/cancel') {
      await reminder.cancel();
      return new Response('OK', { headers });
    }
    return new Response('Not Found', { status: 404, headers });
  }
};

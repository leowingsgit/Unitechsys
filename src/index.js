export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/client-ip') {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ip = request.headers.get('cf-connecting-ip')
        || request.headers.get('x-real-ip')
        || (forwardedFor ? forwardedFor.split(',')[0].trim() : '');

      return Response.json({ ip: ip || null }, {
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};

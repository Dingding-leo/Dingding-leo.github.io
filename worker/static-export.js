const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.split('/').at(-1)?.includes('.')) {
      const pathname = url.pathname.endsWith('/')
        ? `${url.pathname}index.html`
        : `${url.pathname}/index.html`;
      response = await env.ASSETS.fetch(assetRequest(request, pathname));
    }

    if (response.status === 404 && request.headers.get('accept')?.includes('text/html')) {
      const notFound = await env.ASSETS.fetch(assetRequest(request, '/404.html'));
      response = new Response(notFound.body, {
        status: 404,
        headers: notFound.headers,
      });
    }

    return response;
  },
};

export default worker;

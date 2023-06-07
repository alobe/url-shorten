import { Router } from 'itty-router';
import { urlShortenAndSave } from './util';

const router = Router();

const shortApiPath = '/api/url/shorten'

router.post(shortApiPath, async (request, env: Env) => {
	const { url = '' } = await request.json();
	if (!url || !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(url)) {
		return new Response('Invalid URL', { status: 400 });
	}
	const key = await urlShortenAndSave(url, env.LINKS);
	return new Response(JSON.stringify({link: request.url.split(shortApiPath)[0] + '/l/' + key}), {
		headers: {
			"Content-Type": "application/json",
		}
	});
})

router.get('/l/*', async (request, env: Env) => {
	const url = new URL(request.url)
	const path = url.pathname.split('/').pop()
	if (!path) return new Response('No shorten key', { status: 400 })
	const originUrl = await env.LINKS.get(path)
	if (!originUrl) return new Response('No match redirect url', { status: 400 })

	return Response.redirect(originUrl, 302);
})

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;

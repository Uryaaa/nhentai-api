const
	assert = require('assert'),

	nhentai = require('..');


function createCover(type = 'j', media = 1563073) {
	const { Book, Image, } = nhentai,
		book = new Book({ media, }),
		cover = Image.parse({
			t: type,
			w: 350,
			h: 500,
		});

	book.setCover(cover);

	return cover;
}


describe('API', () => {
	const { API, } = nhentai;

	describe('#constructor', () => {

		it('should create API instance with default parameters', () => {

			let api = new API();

			assert.ok(api);

		});

		it('should create API instance with custom parameters', () => {

			let api = new API({
				agent: new Function(),
			});

			assert.ok(api);

			api = new API({
				ssl: false,
			});

			assert.ok(api);

		});

		it('should create API instance with Puppeteer options', () => {

			let api = new API({
				usePuppeteer: true,
				browserArgs : [ '--no-sandbox', '--disable-setuid-sandbox', ],
			});

			assert.ok(api);
			assert.strictEqual(api.usePuppeteer, true);
			assert.deepStrictEqual(api.browserArgs, [ '--no-sandbox', '--disable-setuid-sandbox', ]);

			api = new API({
				usePuppeteer: false,
				browserArgs : [],
			});

			assert.ok(api);
			assert.strictEqual(api.usePuppeteer, false);
			assert.deepStrictEqual(api.browserArgs, []);

		});

		it('should create API instance with multiple hosts', () => {

			let api = new API({
				hosts: {
					images: [
						'i1.nhentai.net',
						'i2.nhentai.net',
						'i3.nhentai.net',
					],
					thumbs: [
						't1.nhentai.net',
						't2.nhentai.net',
						't3.nhentai.net',
					],
				},
			});

			assert.ok(api);
			assert.ok(Array.isArray(api.hosts.images));
			assert.ok(Array.isArray(api.hosts.thumbs));
			assert.strictEqual(api.hosts.images.length, 3);
			assert.strictEqual(api.hosts.thumbs.length, 3);

		});

		it('should create API instance with cookies', () => {

			let api = new API({
				cookies: 'sessionid=abc123;csrftoken=def456',
			});

			assert.ok(api);
			assert.strictEqual(api.cookies, 'sessionid=abc123;csrftoken=def456');

		});

		it('should normalize single host to array', () => {

			let api = new API({
				hosts: {
					images: 'i.nhentai.net',
					thumbs: 't.nhentai.net',
				},
			});

			assert.ok(api);
			assert.ok(Array.isArray(api.hosts.images));
			assert.ok(Array.isArray(api.hosts.thumbs));
			assert.strictEqual(api.hosts.images.length, 1);
			assert.strictEqual(api.hosts.thumbs.length, 1);
			assert.strictEqual(api.hosts.images[0], 'i.nhentai.net');
			assert.strictEqual(api.hosts.thumbs[0], 't.nhentai.net');

		});

		it('should fall back to default hosts when host configuration is invalid', () => {

			let api = new API({
				hosts: {
					images: null,
					thumbs: [],
				},
			});

			assert.deepStrictEqual(api.hosts.images, [
				'i1.nhentai.net',
				'i2.nhentai.net',
				'i3.nhentai.net',
			]);
			assert.deepStrictEqual(api.hosts.thumbs, [
				't1.nhentai.net',
				't2.nhentai.net',
				't3.nhentai.net',
			]);

		});

		it('should rotate media hosts in round-robin order', () => {

			let api = new API({
				hosts: {
					images: [
						'i1.nhentai.net', 'i2.nhentai.net', 'i3.nhentai.net',
					],
				},
			});

			assert.strictEqual(api.getAPIArgs('images', 'bookPage').host, 'i1.nhentai.net');
			assert.strictEqual(api.getAPIArgs('images', 'bookPage').host, 'i2.nhentai.net');
			assert.strictEqual(api.getAPIArgs('images', 'bookPage').host, 'i3.nhentai.net');
			assert.strictEqual(api.getAPIArgs('images', 'bookPage').host, 'i1.nhentai.net');

		});

		it('should parse Puppeteer cookies without breaking values containing equals signs', () => {

			let api = new API({
				cookies: 'session=abc=123; csrftoken=def456; invalidcookie',
			});

			assert.deepStrictEqual(api.getPuppeteerCookies('nhentai.net'), [
				{
					name : 'session',
					value: 'abc=123',
					url  : 'https://nhentai.net/',
				},
				{
					name : 'csrftoken',
					value: 'def456',
					url  : 'https://nhentai.net/',
				},
			]);

		});

		describe('#cover handling', () => {

			it('should generate cover URL variants for inconsistent cover extensions without duplicates', () => {

				let api = new API({
						hosts: {
							thumbs: 't.nhentai.net',
						},
					}),
					cover = createCover('j', 1563073),
					variants = api.getCoverURLVariants(cover);

				assert.ok(variants.includes('https://t.nhentai.net/galleries/1563073/cover.jpg'));
				assert.ok(variants.includes('https://t.nhentai.net/galleries/1563073/cover.jpg.webp'));
				assert.ok(variants.includes('https://t.nhentai.net/galleries/1563073/cover.webp'));
				assert.strictEqual(variants.length, new Set(variants).size);

			});

			it('should cache the resolved cover extension for subsequent image URL generation', async () => {

				let api = new API({
						hosts: {
							thumbs: [
								't1.nhentai.net',
								't2.nhentai.net',
								't3.nhentai.net',
							],
						},
					}),
					cover = createCover('j', 1563073),
					probedPairs = [];

				api.probeCoverExtension = (_image, extension, host) => {
					probedPairs.push(`${host}:${extension}`);

					return Promise.resolve(host === 't3.nhentai.net' && extension === 'jpg.webp');
				};

				const resolvedURL = await api.resolveCoverURL(cover);

				assert.ok(probedPairs.includes('t1.nhentai.net:jpg.webp'));
				assert.ok(probedPairs.includes('t2.nhentai.net:jpg.webp'));
				assert.ok(probedPairs.includes('t3.nhentai.net:jpg.webp'));
				assert.strictEqual(resolvedURL, 'https://t3.nhentai.net/galleries/1563073/cover.jpg.webp');
				assert.strictEqual(api.getImageURL(cover), resolvedURL);
				assert.strictEqual(api.getCoverURLVariants(cover)[0], resolvedURL);

			});

			it('should fall back to the gallery page cover URL when direct probing fails', async () => {

				let api = new API({
						hosts: {
							api   : 'nhentai.net',
							thumbs: [ 't1.nhentai.net', ],
						},
					}),
					cover = createCover('j', 1197044);

				cover.book.id = 227091;
				api.probeCoverExtension = () => Promise.resolve(false);
				api.requestText = options => {
					assert.strictEqual(options.host, 'nhentai.net');
					assert.strictEqual(options.path, '/g/227091/');

					return Promise.resolve('<meta property="og:image" content="//t4.nhentai.net/galleries/1197044/cover.jpg">');
				};

				const resolvedURL = await api.resolveCoverURL(cover);

				assert.strictEqual(resolvedURL, 'https://t4.nhentai.net/galleries/1197044/cover.jpg');
				assert.strictEqual(api.getImageURL(cover), resolvedURL);
				assert.strictEqual(api.getCoverURLVariants(cover)[0], resolvedURL);

			});

		});

	});
});

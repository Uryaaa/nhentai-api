const
	assert = require('assert'),

	nhentai = require('..');


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

	});
});

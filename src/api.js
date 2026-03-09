/**
 * @module API
 */

/**
 * @typedef { import("./options").nHentaiOptions } nHentaiOptions
 */

/**
 * @typedef { import("./options").nHentaiHosts } nHentaiHosts
 */

/**
 * @typedef { import("./options").httpAgent } httpAgent
 */

/**
 * @typedef { import("./search").SearchSortMode } SearchSortMode
 */

// eslint-disable-next-line no-unused-vars
import http, { IncomingMessage, } from 'http';
import https from 'https';

import { version, } from '../package.json';

import Book from './book';
import APIError from './error';
import Image from './image';
import processOptions from './options';
import { Search, } from './search';
import { Tag, } from './tag';


const DEFAULT_PUPPETEER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	hostRotationState = new WeakMap(),
	coverResolutionState = new WeakMap();

let cachedPuppeteer = null,
	stealthPluginEnabled = false;


async function loadPuppeteer() {
	if (cachedPuppeteer) {
		return cachedPuppeteer;
	}

	let puppeteer, StealthPlugin;

	try {
		// Dynamic import to avoid requiring puppeteer when not needed
		puppeteer = await import('puppeteer-extra');
		StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
	} catch (error) {
		throw new Error('Puppeteer dependencies not found. Please install puppeteer-extra and puppeteer-extra-plugin-stealth: npm install puppeteer-extra puppeteer-extra-plugin-stealth');
	}

	cachedPuppeteer = puppeteer.default;

	if (!stealthPluginEnabled) {
		cachedPuppeteer.use(StealthPlugin());
		stealthPluginEnabled = true;
	}

	return cachedPuppeteer;
}


/**
 * API arguments
 * @typedef {object} APIArgs
 * @property {string}   host    API host.
 * @property {Function} apiPath API endpoint URL path generator.
 */

/**
 * Class used for building URL paths to nHentai API endpoints.
 * This class is internal and has only static methods.
 * @class
 */
class APIPath {
	/**
	 * Search by query endpoint.
	 * @param {string}          query     Search query.
	 * @param {?number}         [page=1]  Page ID.
	 * @param {?SearchSortMode} [sort=''] Search sort mode.
	 * @returns {string} URL path.
	 */
	static search(query, page = 1, sort = '') {
		return `/api/galleries/search?query=${query}&page=${page}${sort ? '&sort=' + sort : ''}`;
	}

	/**
	 * Search by tag endpoint.
	 * @param {number}  tagID    Tag ID.
	 * @param {?number} [page=1] Page ID.
	 * @returns {string} URL path.
	 */
	static searchTagged(tagID, page = 1) {
		return `/api/galleries/tagged?tag_id=${tagID}&page=${page}`;
	}

	/**
	 * Search alike endpoint.
	 * @param {number} bookID Book ID.
	 * @returns {string} URL path.
	 */
	static searchAlike(bookID) {
		return `/api/gallery/${bookID}/related`;
	}

	/**
	 * Book content endpoint.
	 * @param {number} bookID Book ID.
	 * @returns {string} URL path.
	 */
	static book(bookID) {
		return `/api/gallery/${bookID}`;
	}

	/**
	 * Book's cover image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookCover(mediaID, extension) {
		return `/galleries/${mediaID}/cover.${extension}`;
	}

	/**
	 * Book's page image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {number} page      Page ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookPage(mediaID, page, extension) {
		return `/galleries/${mediaID}/${page}.${extension}`;
	}

	/**
	 * Book's page's thumbnail image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {number} page      Page ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookThumb(mediaID, page, extension) {
		return `/galleries/${mediaID}/${page}t.${extension}`;
	}

	/**
	 * Redirect to random book at website.
	 * @returns {string} URL path.
	 */
	static randomBookRedirect() {
		return '/random/';
	}
}

/**
 * Class used for interaction with nHentai API.
 * @class
 */
class API {
	/**
	 * API path class
	 * @type {APIPath}
	 * @static
	 * @private
	 */
	static APIPath = APIPath;

	/**
	 * Hosts
	 * @type {?nHentaiHosts}
	 */
	hosts;

	/**
	 * Prefer HTTPS over HTTP.
	 * @type {?boolean}
	 */
	ssl;

	/**
	 * HTTP(S) agent.
	 * @property {?httpAgent}
	 */
	agent;

	/**
	 * Cookies string.
	 * @type {?string}
	 */
	cookies;

	/**
	 * Use Puppeteer with stealth plugin instead of native HTTP requests.
	 * @type {?boolean}
	 */
	usePuppeteer;

	/**
	 * Additional arguments to pass to Puppeteer browser launch.
	 * @type {?string[]}
	 */
	browserArgs;

	/**
	 * Applies provided options on top of defaults.
	 * @param {?nHentaiOptions} [options={}] Options to apply.
	 */
	constructor(options = {}) {
		let params = processOptions(options);

		Object.assign(this, params);
		hostRotationState.set(this, new Map());
		coverResolutionState.set(this, new Map());
	}

	/**
	 * Get http(s) module depending on `options.ssl`.
	 * @type {https|http}
	 */
	get net() {
		return this.ssl
			? https
			: http;
	}

	/**
	 * Select a host from an array of hosts using round-robin.
	 * @param {string[]} hosts Array of hosts.
	 * @param {string} [fallback] Fallback host if array is empty.
	 * @param {string} [rotationKey='default'] Rotation state key.
	 * @returns {string} Selected host.
	 * @private
	 */
	selectHost(hosts, fallback = 'nhentai.net', rotationKey = 'default') {
		if (!Array.isArray(hosts) || hosts.length === 0) {
			return fallback;
		}

		let rotationMap = hostRotationState.get(this);

		if (!rotationMap) {
			rotationMap = new Map();
			hostRotationState.set(this, rotationMap);
		}

		const currentIndex = rotationMap.get(rotationKey) || 0,
			host = hosts[currentIndex % hosts.length] || fallback;

		rotationMap.set(rotationKey, (currentIndex + 1) % hosts.length);

		return host;
	}

	/**
	 * Build request URL.
	 * @param {string} host Host.
	 * @param {string} path Path.
	 * @returns {string} Request URL.
	 * @private
	 */
	buildRequestURL(host, path) {
		return `http${this.ssl ? 's' : ''}://${host}${path}`;
	}

	/**
	 * Build request headers.
	 * @param {object} [additionalHeaders={}] Additional headers.
	 * @param {boolean} [includeCookies=true] Include Cookie header.
	 * @returns {object} Request headers.
	 * @private
	 */
	getRequestHeaders(additionalHeaders = {}, includeCookies = true) {
		const headers = {
			'User-Agent': `nhentai-api-client/${version} Node.js/${process.versions.node}`,
			...additionalHeaders,
		};

		if (includeCookies && this.cookies) {
			headers.Cookie = this.cookies;
		}

		return headers;
	}

	/**
	 * Get Puppeteer cookies for a host.
	 * @param {string} host Host.
	 * @returns {object[]} Puppeteer cookies.
	 * @private
	 */
	getPuppeteerCookies(host) {
		if (!this.cookies) {
			return [];
		}

		const cookieURL = this.buildRequestURL(host, '/');

		return this.cookies
			.split(';')
			.map(cookie => cookie.trim())
			.filter(Boolean)
			.map(cookie => {
				const separatorIndex = cookie.indexOf('=');

				if (separatorIndex <= 0) {
					return null;
				}

				const name = cookie.slice(0, separatorIndex).trim(),
					value = cookie.slice(separatorIndex + 1).trim();

				if (!name) {
					return null;
				}

				return {
					name,
					value,
					url: cookieURL,
				};
			})
			.filter(cookie => cookie !== null);
	}

	/**
	 * JSON get request.
	 * @param {object} options      HTTP(S) request options.
	 * @param {string} options.host Host.
	 * @param {string} options.path Path.
	 * @returns {Promise<object>} Parsed JSON.
	 */
	request(options) {
		// Use Puppeteer if enabled
		if (this.usePuppeteer) {
			return this.requestWithPuppeteer(options);
		}

		// Use native HTTP requests
		let {
			net,
			agent,
		} = this;
		return new Promise((resolve, reject) => {
			const headers = this.getRequestHeaders();

			Object.assign(options, {
				agent,
				headers,
			});

			net.get(options, _response => {
				const
					/** @type {IncomingMessage}*/
					response = _response,
					{ statusCode, } = response,
					contentType = response.headers['content-type'];

				let error;
				if (statusCode !== 200)
					error = new Error(`Request failed with status code ${statusCode}`);
				else if (!(/^application\/json/).test(contentType))
					error = new Error(`Invalid content-type - expected application/json but received ${contentType}`);

				if (error) {
					response.resume();
					reject(APIError.absorb(error, response));
					return;
				}

				response.setEncoding('utf8');
				let rawData = '';
				response.on('data', (chunk) => rawData += chunk);
				response.on('end', () => {
					try {
						resolve(JSON.parse(rawData));
					} catch (error) {
						reject(APIError.absorb(error, response));
					}
				});
			}).on('error', error => reject(APIError.absorb(error)));
		});
	}

	/**
	 * JSON get request using Puppeteer with stealth plugin.
	 * @param {object} options      HTTP(S) request options.
	 * @param {string} options.host Host.
	 * @param {string} options.path Path.
	 * @returns {Promise<object>} Parsed JSON.
	 * @private
	 */
	async requestWithPuppeteer(options) {
		const puppeteer = await loadPuppeteer(),
			url = this.buildRequestURL(options.host, options.path);
		let browser;

		try {
			// Launch browser with provided arguments
			const defaultArgs = [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-blink-features=AutomationControlled',
			];
			browser = await puppeteer.launch({
				headless         : 'new',
				args             : [ ...defaultArgs, ...this.browserArgs || [], ],
				ignoreDefaultArgs: [ '--enable-automation', ],
			});

			const page = await browser.newPage();

			// Set a realistic user agent
			await page.setUserAgent(DEFAULT_PUPPETEER_USER_AGENT);

			// Set cookies if provided
			const cookies = this.getPuppeteerCookies(options.host);

			if (cookies.length > 0) {
				await page.setCookie(...cookies);
			}

			// Check if this is a redirect endpoint (like /random/)
			const isRedirectEndpoint = options.path.includes('/random');

			if (isRedirectEndpoint) {
				// For redirect endpoints, capture the 302 response with location header
				let redirectLocation = null;

				// Set up response listener BEFORE navigation to capture the 302
				page.on('response', response => {
					if (response.status() === 302 && response.url().includes('/random')) {
						redirectLocation = response.headers().location;
					}
				});

				// Navigate and let Puppeteer follow the redirect
				await page.goto(url, {
					waitUntil: 'domcontentloaded',
					timeout  : 30000,
				});

				// If we captured the redirect location, use it
				if (redirectLocation) {
					const mockError = new Error('Request failed with status code 302');
					mockError.httpResponse = {
						statusCode: 302,
						headers   : {
							location: redirectLocation,
						},
					};
					throw APIError.absorb(mockError, mockError.httpResponse);
				}

				// Fallback: try to extract from final URL or page content
				const finalUrl = page.url(),
					idMatch = finalUrl.match(/\/g\/(\d+)/);

				if (idMatch && idMatch[1]) {
					const mockError = new Error('Request failed with status code 302');
					mockError.httpResponse = {
						statusCode: 302,
						headers   : {
							location: finalUrl,
						},
					};
					throw APIError.absorb(mockError, mockError.httpResponse);
				}

				// Last resort: extract from page content
				const pageContent = await page.content(),
					contentMatch = pageContent.match(/\/g\/(\d+)/) ||
						pageContent.match(/#(\d+)/) ||
						pageContent.match(/gallery\/(\d+)/);

				if (contentMatch && contentMatch[1]) {
					const mockError = new Error('Request failed with status code 302');
					mockError.httpResponse = {
						statusCode: 302,
						headers   : {
							location: `/g/${contentMatch[1]}/`,
						},
					};
					throw APIError.absorb(mockError, mockError.httpResponse);
				}

				throw new Error(`Could not extract book ID from page. Final URL: ${finalUrl}`);
			} else {
				// Set request headers to get JSON response for API endpoints
				await page.setExtraHTTPHeaders(this.getRequestHeaders({
					Accept: 'application/json, text/plain, */*',
				}, false));

				// Navigate to the URL and get the response
				const response = await page.goto(url, {
					waitUntil: 'domcontentloaded',
					timeout  : 30000,
				});

				if (!response) {
					throw new Error('Request did not receive an HTTP response');
				}

				if (!response.ok()) {
					throw APIError.absorb(
						new Error(`Request failed with status code ${response.status()}`),
						{
							statusCode: response.status(),
							headers   : response.headers(),
						}
					);
				}

				// Get the response text directly from the response
				const responseText = await response.text(),
					// Check if the response is JSON by looking at content-type or trying to parse
					contentType = response.headers()['content-type'] || '';

				if (contentType.includes('application/json')) {
					// Direct JSON response
					try {
						return JSON.parse(responseText);
					} catch (parseError) {
						throw new Error(`Invalid JSON response: ${parseError.message}`);
					}
				} else {
					// HTML response - try to extract JSON from page content
					const content = await page.content(),
						jsonMatch = content.match(/<pre[^>]*>(.*?)<\/pre>/s);
					let jsonText;

					if (jsonMatch) {
						// Extract JSON from <pre> tag (common for API responses)
						jsonText = jsonMatch[1].trim();
					} else {
						// Try to get JSON from page.evaluate
						jsonText = await page.evaluate(() => {
							// Try to find JSON in the page
							// eslint-disable-next-line no-undef
							const preElement = document.querySelector('pre');
							if (preElement) {
								return preElement.textContent;
							}
							// If no pre element, return the whole body text
							// eslint-disable-next-line no-undef
							return document.body.textContent;
						});
					}

					try {
						return JSON.parse(jsonText);
					} catch (parseError) {
						throw new Error(`Invalid JSON response: ${parseError.message}. Response content: ${jsonText?.substring(0, 200)}...`);
					}
				}
			}

		} finally {
			if (browser) {
				await browser.close();
			}
		}
	}

	/**
	 * Get API arguments.
	 * This is internal method.
	 * @param {string} hostType Host type.
	 * @param {string} api      Endpoint type.
	 * @returns {APIArgs} API arguments.
	 * @private
	 */
	getAPIArgs(hostType, api) {
		let {
			hosts: {
				[hostType]: hostConfig,
			},
			constructor: {
				APIPath: {
					[api]: apiPath,
				},
			},
		} = this;

		// Select host from array or use single host
		const host = Array.isArray(hostConfig)
			? this.selectHost(hostConfig, hostConfig[0], hostType)
			: hostConfig;

		return {
			host,
			apiPath,
		};
	}

	/**
	 * Search by query.
	 * @param {string}          query     Query.
	 * @param {?number}         [page=1]  Page ID.
	 * @param {?SearchSortMode} [sort=''] Search sort mode.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async search(query, page = 1, sort = '') {
		let { host, apiPath, } = this.getAPIArgs('api', 'search'),
			search = Search.parse(
				await this.request({
					host,
					path: apiPath(query, page, sort),
				})
			);

		Object.assign(search, {
			api: this,
			query,
			page,
			sort,
		});

		return search;
	}

	/**
	 * Search by query.
	 * @param {string}          query     Query.
	 * @param {?number}         [page=1]  Starting page ID.
	 * @param {?SearchSortMode} [sort=''] Search sort mode.
	 * @yields {Search} Search instance.
	 * @async
	 * @returns {AsyncGenerator<Search, Search, Search>}
	 */
	async * searchGenerator(query, page = 1, sort = '') {
		let search = await this.search(query, page, sort);

		while (search.page <= search.pages) {
			yield search;
			search = await this.search(query, search.page + 1, sort);
		}
	}

	/**
	 * Search related books.
	 * @param {number|Book} book Book instance or Book ID.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async searchAlike(book) {
		let { host, apiPath, } = this.getAPIArgs('api', 'searchAlike');

		return Search.parse(
			await this.request({
				host,
				path: apiPath(
					book instanceof Book
						? book.id
						: +book
				),
			})
		);
	}

	/**
	 * Search by tag id.
	 * @param {number|Tag}      tag       Tag or Tag ID.
	 * @param {?number}         [page=1]  Page ID.
	 * @param {?SearchSortMode} [sort=''] Search sort mode.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async searchTagged(tag, page = 1, sort = '') {
		if (!(tag instanceof Tag))
			tag = Tag.get({ id: +tag, });
		let { host, apiPath, } = this.getAPIArgs('api', 'searchTagged'),
			search = Search.parse(
				await this.request({
					host,
					path: apiPath(tag.id, page, sort),
				})
			);

		Object.assign(search, {
			api  : this,
			query: tag,
			page,
			sort,
		});

		return search;
	}

	/**
	 * Get book by id.
	 * @param {number} bookID Book ID.
	 * @returns {Promise<Book>} Book instance.
	 * @async
	 */
	async getBook(bookID) {
		let { host, apiPath, } = this.getAPIArgs('api', 'book');

		return Book.parse(
			await this.request({
				host,
				path: apiPath(bookID),
			})
		);
	}

	/**
	 * Get random book.
	 * @returns {Promise<Book>} Book instance.
	 * @async
	 */
	async getRandomBook() {
		let { host, apiPath, } = this.getAPIArgs('api', 'randomBookRedirect');

		try {
			await this.request({
				host,
				path: apiPath(),
			}); // Will always throw
		} catch (error) {
			if (!(error instanceof APIError))
				throw error;
			const response = error.httpResponse;
			if (!response || response.statusCode !== 302)
				throw error;
			const id = +((/\d+/).exec(response.headers.location) || {})[0];
			if (isNaN(id))
				throw APIError.absorb(new Error('Bad redirect'), response);
			return await this.getBook(id);
		}
	}

	/**
	 * Get cover filename extension candidates.
	 * nHentai's CDN can serve covers with inconsistent simple and double extensions,
	 * so this method returns a best-effort ordered candidate list instead of trying
	 * to guess one "correct" extension from API metadata alone.
	 * @param {Image} image Cover image.
	 * @returns {string[]} Candidate extensions to try.
	 * @private
	 */
	getCoverExtensionCandidates(image) {
		if (!(image instanceof Image) || !image.isCover) {
			throw new Error('image must be a cover Image instance.');
		}

		let resolutionCache = coverResolutionState.get(this);

		if (!resolutionCache) {
			resolutionCache = new Map();
			coverResolutionState.set(this, resolutionCache);
		}

		const reportedExtension = image.type.extension,
			resolvedExtension = resolutionCache.get(image.book.media),
			baseExtensions = [
				reportedExtension,
				'jpg',
				'png',
				'gif',
				'webp',
			],
			transcodedExtensions = [
				'webp',
				'png',
				'jpg',
				'gif',
			],
			candidates = [];

		if (resolvedExtension) {
			candidates.push(resolvedExtension);
		}

		baseExtensions.forEach(baseExtension => {
			candidates.push(baseExtension);

			transcodedExtensions.forEach(transcodedExtension => {
				candidates.push(`${baseExtension}.${transcodedExtension}`);
			});
		});

		return [ ...new Set(candidates.filter(Boolean)), ];
	}

	/**
	 * Probe a possible cover filename extension.
	 * @param {Image} image Cover image.
	 * @param {string} extension Candidate extension.
	 * @returns {Promise<boolean>} Whatever the candidate resolved to an image response.
	 * @private
	 */
	probeCoverExtension(image, extension) {
		let { host, apiPath, } = this.getAPIArgs('thumbs', 'bookCover'),
			{
				net,
				agent,
			} = this;

		return new Promise(resolve => {
			const request = net.get({
				host   : host,
				path   : apiPath(image.book.media, extension),
				agent  : agent,
				headers: this.getRequestHeaders({
					Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
				}),
			}, _response => {
				const
					/** @type {IncomingMessage}*/
					response = _response,
					contentType = response.headers['content-type'],
					isImageResponse = response.statusCode === 200
						&& (!contentType || (/^image\//).test(contentType));

				response.destroy();
				resolve(isImageResponse);
			});

			request.on('error', () => resolve(false));
		});
	}

	/**
	 * Resolve a working cover image URL by probing known filename variants.
	 * The successful extension is cached per API instance for future `getImageURL()` calls.
	 * @param {Image} image Cover image.
	 * @returns {Promise<string>} Working cover image URL.
	 * @async
	 */
	async resolveCoverURL(image) {
		if (!(image instanceof Image) || !image.isCover) {
			throw new Error('image must be a cover Image instance.');
		}

		let resolutionCache = coverResolutionState.get(this);

		if (!resolutionCache) {
			resolutionCache = new Map();
			coverResolutionState.set(this, resolutionCache);
		}

		for (const extension of this.getCoverExtensionCandidates(image)) {
			if (await this.probeCoverExtension(image, extension)) {
				resolutionCache.set(image.book.media, extension);

				return this.getImageURL(image);
			}
		}

		throw new Error(`Unable to resolve a working cover URL for media ${image.book.media}.`);
	}

	/**
	 * Get image URL.
	 * @param {Image} image Image.
	 * @returns {string} Image URL.
	 */
	getImageURL(image) {
		if (image instanceof Image) {
			let { host, apiPath, } = image.isCover
					? this.getAPIArgs('thumbs', 'bookCover')
					: this.getAPIArgs('images', 'bookPage'),
				extension = image.type.extension;

			if (image.isCover) {
				const resolutionCache = coverResolutionState.get(this),
					resolvedExtension = resolutionCache
						? resolutionCache.get(image.book.media)
						: null;

				extension = resolvedExtension || extension;
			}

			return `http${this.ssl ? 's' : ''}://${host}` + (image.isCover
				? apiPath(image.book.media, extension)
				: apiPath(image.book.media, image.id, extension));
		}
		throw new Error('image must be Image instance.');
	}

	/**
	 * Get image URL with original extension (fallback for when double extension fails).
	 * @param {Image} image Image.
	 * @returns {string} Image URL with original extension.
	 */
	getImageURLOriginal(image) {
		if (image instanceof Image) {
			let { host, apiPath, } = image.isCover
				? this.getAPIArgs('thumbs', 'bookCover')
				: this.getAPIArgs('images', 'bookPage');

			// Always use the original extension reported by the API
			return `http${this.ssl ? 's' : ''}://${host}` + (image.isCover
				? apiPath(image.book.media, image.type.extension)
				: apiPath(image.book.media, image.id, image.type.extension));
		}
		throw new Error('image must be Image instance.');
	}

	/**
	 * Get all possible cover image URL variants for testing.
	 * @param {Image} image Cover image.
	 * @returns {string[]} Array of possible URLs to try.
	 */
	getCoverURLVariants(image) {
		if (!(image instanceof Image) || !image.isCover) {
			throw new Error('image must be a cover Image instance.');
		}

		let { host, apiPath, } = this.getAPIArgs('thumbs', 'bookCover'),
			baseURL = `http${this.ssl ? 's' : ''}://${host}`,
			variants = this.getCoverExtensionCandidates(image)
				.map(extension => baseURL + apiPath(image.book.media, extension));

		return [ ...new Set(variants), ];
	}

	/**
	 * Get image thumbnail URL.
	 * @param {Image} image Image.
	 * @returns {string} Image thumbnail URL.
	 */
	getThumbURL(image) {
		if (image instanceof Image && !image.isCover) {
			let { host, apiPath, } = this.getAPIArgs('thumbs', 'bookThumb');

			return `http${this.ssl ? 's' : ''}://${host}`
				+ apiPath(image.book.media, image.id, image.type.extension);
		}
		throw new Error('image must be Image instance and not book cover.');
	}
}

export default API;

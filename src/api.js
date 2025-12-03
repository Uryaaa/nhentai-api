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
	 * @returns {string} Selected host.
	 * @private
	 */
	selectHost(hosts, fallback = 'nhentai.net') {
		if (!Array.isArray(hosts) || hosts.length === 0) {
			return fallback;
		}

		// Simple round-robin selection based on current time
		const index = Math.floor(Math.random() * hosts.length);
		return hosts[index];
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
			cookies,
		} = this;
		return new Promise((resolve, reject) => {
			const headers = {
				'User-Agent': `nhentai-api-client/${version} Node.js/${process.versions.node}`,
			};

			// Add cookies if provided
			if (cookies) {
				headers.Cookie = cookies;
			}

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
		let puppeteer, StealthPlugin;

		try {
			// Dynamic import to avoid requiring puppeteer when not needed
			puppeteer = await import('puppeteer-extra');
			StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
		} catch (error) {
			throw new Error('Puppeteer dependencies not found. Please install puppeteer-extra and puppeteer-extra-plugin-stealth: npm install puppeteer-extra puppeteer-extra-plugin-stealth');
		}

		// Use stealth plugin
		puppeteer.default.use(StealthPlugin());

		const url = `http${this.ssl ? 's' : ''}://${options.host}${options.path}`;
		let browser;

		try {
			// Launch browser with provided arguments
			const defaultArgs = [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-blink-features=AutomationControlled',
			];
			browser = await puppeteer.default.launch({
				headless         : 'new',
				args             : [ ...defaultArgs, ...this.browserArgs || [], ],
				ignoreDefaultArgs: [ '--enable-automation', ],
			});

			const page = await browser.newPage();

			// Set a realistic user agent
			await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

			// Set cookies if provided
			if (this.cookies) {
				const cookieStrings = this.cookies.split(';'),
					cookies = cookieStrings.map(cookieStr => {
						const [ name, value, ] = cookieStr.trim().split('=');
						return {
							name  : name.trim(),
							value : value ? value.trim() : '',
							domain: options.host,
						};
					});
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
				await page.setExtraHTTPHeaders({
					'Accept'      : 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				});

				// Navigate to the URL and get the response
				const response = await page.goto(url, {
					waitUntil: 'networkidle0',
					timeout  : 30000,
				});

				if (!response.ok()) {
					throw new Error(`Request failed with status code ${response.status()}`);
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
			? this.selectHost(hostConfig, hostConfig[0])
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
	 * Detect the actual cover filename extension for nhentai's double extension format.
	 * @param {Image} image Cover image.
	 * @returns {string} The actual extension to use in the URL.
	 * @private
	 */
	detectCoverExtension(image) {
		const reportedExtension = image.type.extension;

		// Handle WebP cases - both simple and double extension formats
		if (reportedExtension === 'webp') {
			// Some WebP files also have double extensions like cover.webp.webp
			// We need to detect this based on media ID or other patterns

			// For now, we'll try the double WebP format for certain media ID ranges
			// This is based on observation that newer uploads tend to have cover.webp.webp
			const mediaId = image.book.media;

			// Media IDs above ~3000000 seem to use cover.webp.webp format
			// This is a heuristic that may need adjustment based on more data
			if (mediaId > 3000000) {
				return 'webp.webp';
			}

			// Default to simple webp for older uploads
			return 'webp';
		}

		// For non-webp extensions, nhentai often serves double extensions
		// The pattern is: cover.{original_extension}.webp
		// We need to detect what the original extension should be

		// Map API type codes to likely intermediate extensions
		const intermediateExtensionMap = {
				'jpg' : 'jpg',    // API reports 'j' -> likely cover.jpg.webp
				'jpeg': 'jpg',    // API reports 'jpeg' -> likely cover.jpg.webp
				'png' : 'png',    // API reports 'p' -> likely cover.png.webp
				'gif' : 'gif',    // API reports 'g' -> likely cover.gif.webp
			},
			intermediateExt = intermediateExtensionMap[reportedExtension];

		if (intermediateExt) {
			// Return double extension format: original.webp
			return `${intermediateExt}.webp`;
		}

		// Fallback to reported extension if we can't map it
		return reportedExtension;
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
				extension;

			// Handle cover images with potential double extensions
			if (image.isCover) {
				extension = this.detectCoverExtension(image);
			} else {
				// Regular pages use simple extensions
				extension = image.type.extension;
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
			reportedExt = image.type.extension,
			variants = [],
			// Add the smart detection URL (our primary method)
			smartExt = this.detectCoverExtension(image);

		variants.push(baseURL + apiPath(image.book.media, smartExt));

		// Add original extension URL
		variants.push(baseURL + apiPath(image.book.media, reportedExt));

		// For WebP, add both simple and double variants
		if (reportedExt === 'webp') {
			variants.push(baseURL + apiPath(image.book.media, 'webp'));
			variants.push(baseURL + apiPath(image.book.media, 'webp.webp'));
		}

		// For non-WebP, add the double extension variant
		if (reportedExt !== 'webp') {
			variants.push(baseURL + apiPath(image.book.media, `${reportedExt}.webp`));
		}

		// Remove duplicates
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

import { Agent, } from 'http';
import { Agent as SSLAgent, } from 'https';


const DEFAULT_API_HOST = 'nhentai.net',
	DEFAULT_IMAGE_HOSTS = [
		'i1.nhentai.net',
		'i2.nhentai.net',
		'i3.nhentai.net',
	],
	DEFAULT_THUMB_HOSTS = [
		't1.nhentai.net',
		't2.nhentai.net',
		't3.nhentai.net',
	];


/**
 * Agent-like object or Agent class or it's instance.
 * @global
 * @typedef {object|Agent|SSLAgent} httpAgent
 */

/**
 * Common nHentai API hosts object.
 * @global
 * @typedef {object} nHentaiHosts
 * @property {?string}         api    Main API host.
 * @property {?string|string[]} images Media API host(s). Can be a single host or array of hosts for load balancing.
 * @property {?string|string[]} thumbs Media thumbnails API host(s). Can be a single host or array of hosts for load balancing.
 */

/**
 * Common nHentai options object.
 * @global
 * @typedef {object} nHentaiOptions
 * @property {?nHentaiHosts} hosts         Hosts.
 * @property {?boolean}      ssl           Prefer HTTPS over HTTP.
 * @property {?httpAgent}    agent         HTTP(S) agent.
 * @property {?string}       cookies       Cookies string in format 'cookie1=value1;cookie2=value2;...'
 * @property {?boolean}      usePuppeteer  Use Puppeteer with stealth plugin instead of native HTTP requests.
 * @property {?string[]}     browserArgs   Additional arguments to pass to Puppeteer browser launch.
 */

/**
 * Applies provided options on top of defaults.
 * @param {?nHentaiOptions} [options={}] Options to apply.
 * @returns {nHentaiOptions} Unified options.
 */
function processOptions({
	hosts: {
		api    = DEFAULT_API_HOST,
		images = DEFAULT_IMAGE_HOSTS,
		thumbs = DEFAULT_THUMB_HOSTS,
	} = {},
	ssl          = true,
	agent        = null,
	cookies      = null,
	usePuppeteer = false,
	browserArgs  = [],
} = {}) {
	if (!agent)
		agent = ssl
			? SSLAgent
			: Agent;

	if (typeof agent === 'function')
		agent = new agent();

	// Normalize hosts to arrays for consistent handling
	const normalizeHosts = (hostConfig, fallbackHosts) => {
			if (typeof hostConfig === 'string') {
				const normalizedHost = hostConfig.trim();

				return normalizedHost
					? [ normalizedHost, ]
					: [ ...fallbackHosts, ];
			}

			if (Array.isArray(hostConfig)) {
				const normalizedHosts = hostConfig
					.filter(host => typeof host === 'string')
					.map(host => host.trim())
					.filter(Boolean);

				return normalizedHosts.length > 0
					? normalizedHosts
					: [ ...fallbackHosts, ];
			}

			return [ ...fallbackHosts, ];
		},

	 normalizedAPIHost = typeof api === 'string' && api.trim()
			? api.trim()
			: DEFAULT_API_HOST;

	return {
		hosts: {
			api   : normalizedAPIHost,
			images: normalizeHosts(images, DEFAULT_IMAGE_HOSTS),
			thumbs: normalizeHosts(thumbs, DEFAULT_THUMB_HOSTS),
		},
		ssl,
		agent,
		cookies,
		usePuppeteer,
		browserArgs,
	};
}

export default processOptions;

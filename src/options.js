import { Agent, } from 'http';
import { Agent as SSLAgent, } from 'https';


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
 * @property {?nHentaiHosts} hosts   Hosts.
 * @property {?boolean}      ssl     Prefer HTTPS over HTTP.
 * @property {?httpAgent}    agent   HTTP(S) agent.
 * @property {?string}       cookies Cookies string in format 'cookie1=value1;cookie2=value2;...'
 */

/**
 * Applies provided options on top of defaults.
 * @param {?nHentaiOptions} [options={}] Options to apply.
 * @returns {nHentaiOptions} Unified options.
 */
function processOptions({
	hosts: {
<<<<<<< HEAD
		api    = '138.2.77.198',
		images = 'i.nhentai.net',
		thumbs = 't.nhentai.net',
=======
		api    = 'nhentai.net',
		images = [
			'i1.nhentai.net',
			'i2.nhentai.net',
			'i3.nhentai.net',
		],
		thumbs = [
			't1.nhentai.net',
			't2.nhentai.net',
			't3.nhentai.net',
		],
>>>>>>> ca0bfc3 (version 4.0.0)
	} = {},
	ssl     = true,
	agent   = null,
	cookies = null,
} = {}) {
	if (!agent)
		agent = ssl
			? SSLAgent
			: Agent;

	if (agent.constructor.name === 'Function')
		agent = new agent();

	// Normalize hosts to arrays for consistent handling
	const normalizeHosts = (hostConfig) => {
		if (typeof hostConfig === 'string') {
			return [ hostConfig, ];
		}
		return Array.isArray(hostConfig) ? hostConfig : [ hostConfig, ];
	};

	return {
		hosts: {
			api,
			images: normalizeHosts(images),
			thumbs: normalizeHosts(thumbs),
		},
		ssl,
		agent,
		cookies,
	};
}

export default processOptions;

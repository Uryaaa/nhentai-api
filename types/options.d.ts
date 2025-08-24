/// <reference types="node" />
export default processOptions;
/**
 * Agent-like object or Agent class or it's instance.
 */
export type httpAgent = object | Agent | SSLAgent;
/**
 * Common nHentai API hosts object.
 */
export type nHentaiHosts = {
    /**
     * Main API host.
     */
    api: string | null;
    /**
     * Media API host(s). Can be a single host or array of hosts for load balancing.
     */
    images: (string | string[]) | null;
    /**
     * Media thumbnails API host(s). Can be a single host or array of hosts for load balancing.
     */
    thumbs: (string | string[]) | null;
};
/**
 * Common nHentai options object.
 */
export type nHentaiOptions = {
    /**
     * Hosts.
     */
    hosts: nHentaiHosts | null;
    /**
     * Prefer HTTPS over HTTP.
     */
    ssl: boolean | null;
    /**
     * HTTP(S) agent.
     */
    agent: httpAgent | null;
    /**
     * Cookies string in format 'cookie1=value1;cookie2=value2;...'
     */
    cookies: string | null;
    /**
     * Use Puppeteer with stealth plugin instead of native HTTP requests.
     */
    usePuppeteer: boolean | null;
    /**
     * Additional arguments to pass to Puppeteer browser launch.
     */
    browserArgs: string[] | null;
};
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
declare function processOptions({ hosts: { api, images, thumbs, }, ssl, agent, cookies, usePuppeteer, browserArgs, }?: nHentaiOptions | null): nHentaiOptions;
import { Agent } from "http";
import { Agent as SSLAgent } from "https";

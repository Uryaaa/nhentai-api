import require$$1,{Agent as Agent$1}from"http";import require$$2,{Agent}from"https";import{access,symlink,createWriteStream,rm,existsSync,createReadStream,mkdirSync}from"node:fs";import{tmpdir}from"node:os";import{join,basename,dirname}from"node:path";import{fileURLToPath,URL as URL$2}from"node:url";import require$$0 from"url";import require$$3 from"stream";import require$$4 from"assert";import require$$0$1 from"events";import require$$2$1 from"fs";import require$$3$1 from"path";import{createBrotliDecompress,createUnzip}from"node:zlib";function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}
/**
 * @module Tag
 */
/**
 * Tag object from API.
 * @global
 * @typedef {object} APITag
 * @property {number|string} id    Tag id.
 * @property {string}        type  Tag type.
 * @property {string}        name  Tag name.
 * @property {number|string} count Tagged books count.
 * @property {string}        url   Tag URL.
 */
/**
 * @typedef {object} TagTypes
 * @property {UnknownTagType} Unknown   Unknown tag type.
 * @property {TagType}        Tag       Tag tag type.
 * @property {TagType}        Category  Category tag type.
 * @property {TagType}        Artist    Artist tag type.
 * @property {TagType}        Parody    Parody tag type.
 * @property {TagType}        Character Character tag type.
 * @property {TagType}        Group     Group tag type.
 * @property {TagType}        Language  Language tag type.
 */
/**
 * Class representing tag type.
 * @class
 */class TagType{
/**
   * @type {TagTypes}
   * @static
   * @default {}
   */
/**
   * Tag type name.
   * @type {?string}
   * @default null
   */
/**
   * Create tag type.
   * @param {string} type Tag type.
   */
constructor(type){_defineProperty(this,"type",null),type&&(this.type=type,this.constructor.knownTypes[type]=this)}
/**
   * Check if this tag type is unknown.
   * @type {boolean}
   */get isKnown(){return!(this instanceof UnknownTagType)}
/**
   * Tag type name.
   * @returns {string}
   */toString(){return this.type}}
/**
 * Class representing unknown tag type.
 * @class
 * @extends TagType
 */_defineProperty(TagType,"knownTypes",{});class UnknownTagType extends TagType{
/**
   * Create unknown tag type.
   * @param {string} [type="unknown"] Unknown tag type name.
   */
constructor(type="unknown"){super(null),this.type=type}}
/**
 * Class representing tag.
 * @class
 */class Tag{
/**
   * Tag types.
   * @type {TagTypes}
   * @static
   */
/**
   * Warp tag object with Tag class instance.
   * @param {APITag|Tag} tag Tag to wrap.
   * @returns {Tag} Tag.
   * @static
   */
static get(tag){return tag instanceof this||(tag=new this({id:+tag.id,type:tag.type,name:tag.name,count:+tag.count,url:tag.url})),tag}
/**
   * Tag ID.
   * @type {number}
   * @default 0
   */
/**
   * Create tag.
   * @param {object}         [params]                       Tag parameters.
   * @param {number}         [params.id=0]                  Tag id.
   * @param {string|TagType} [params.type=TagTypes.Unknown] Tag type.
   * @param {string}         [params.name=""]               Tag name.
   * @param {number}         [params.count=0]               Tagged books count.
   * @param {string}         [params.url=""]                Tag URL.
   */constructor({id:id=0,type:type=this.constructor.types.Unknown,name:name="",count:count=0,url:url=""}={}){_defineProperty(this,"id",0),_defineProperty(this,"type",this.constructor.types.Unknown),_defineProperty(this,"name",""),_defineProperty(this,"count",0),_defineProperty(this,"url",""),Object.assign(this,{id:id,type:type instanceof TagType?type:this.constructor.types.get(type),name:name,count:count,url:url})}
/**
   * Compare this to given one.
   * By default tags with different id will return false.
   * If you want to check whatever tag has any of properties from another tag pass `'any'` to `strict` parameter.
   * @param {string|Tag} tag                Tag to compare with.
   * @param {boolean|string} [strict=false] Whatever all parameters must be the same.
   * @returns {boolean} Whatever tags are equal.
   */compare(tag,strict=!1){if(tag=this.constructor.get(tag),"any"===strict)strict=!1;else if(this.id!==tag.id)return!1;return!!["id","type","name","count","url"].map((prop=>tag[prop]===this[prop])).reduce(((accum,current)=>strict?accum*current:accum+current))}
/**
   * Get tag name or tag name with count of tagged books.
   * @param {?boolean} [includeCount=false] Include count.
   * @returns {string}
   */toString(includeCount=!1){return this.name+(includeCount?` (${this.count})`:"")}}_defineProperty(Tag,"types",{Unknown:new UnknownTagType,
// Symbol('unknown')
Tag:new TagType("tag"),Category:new TagType("category"),Artist:new TagType("artist"),Parody:new TagType("parody"),Character:new TagType("character"),Group:new TagType("group"),Language:new TagType("language"),
/**
   * Known tag types.
   * @type {TagTypes}
   */
known:TagType.knownTypes,
/**
   * Get tag type class instance by name.
   * @param {string} type Tag type.
   * @returns {TagType|UnknownTagType} Tag type class instance.
   */
get(type){let known;return"string"==typeof type&&(type=type.toLowerCase()),(known=this.known[type])?known:new UnknownTagType(type)}});
/**
 * Image object from API.
 * @global
 * @typedef {object} APIImage
 * @property {string}        t Image type.
 * @property {number|string} w Image width.
 * @property {number|string} h Image height.
 */
/**
 * @typedef {object} ImageTypes
 * @property {TagType} JPEG JPEG image type.
 * @property {TagType} PNG  PNG image type.
 * @property {TagType} GIF  GIF image type.
 */
/**
 * Class representing image type.
 * @class
 */
class ImageType{
/**
   * @type {ImageTypes}
   * @static
   * @default {}
   */
/**
   * Image type name.
   * @type {?string}
   * @default null
   */
/**
   * Image type extension.
   * @type {?string}
   * @default null
   */
/**
   * Create image type.
   * @param {string} type      Image type name.
   * @param {string} extension Image type extension.
   */
constructor(type,extension){_defineProperty(this,"type",null),_defineProperty(this,"extension",null),type&&(this.type=type,this.constructor.knownTypes[type]=this),this.extension=extension}
/**
   * Whatever this tag type is unknown.
   * @type {boolean}
   */get isKnown(){return!(this instanceof UnknownImageType)}
/**
   * Alias for type.
   * @type {?string}
   */get name(){return this.type}}
/**
 * Class representing unknown image type.
 * @class
 * @extends ImageType
 */_defineProperty(ImageType,"knownTypes",{});class UnknownImageType extends ImageType{
/**
   * Create unknown image type.
   * @param {string} type      Unknown image type name.
   * @param {string} extension Unknown image type extension.
   */
constructor(type,extension){super(null,extension),this.type=type}}
/**
 * Class representing image.
 * @class
 */class Image{
/**
   * Image types.
   * @type {ImageTypes}
   * @static
   */
/**
   * Parse pure image object from API into class instance.
   * @param {APIImage} image  Image object
   * @param {number}   [id=0] Image id (a.k.a. page number).
   * @returns {Image} Image instance.
   * @static
   */
static parse(image,id=0){let{t:type,w:width,h:height}=image;return new this({type:type,width:+width,height:+height,id:id})}
/**
   * Image ID.
   * @type {number}
   * @default 0
   */
/**
   * Create image.
   * @param {object}           [params]                      Image parameters.
   * @param {number}           [params.id=0]                 Image ID.
   * @param {number}           [params.width=0]              Image width.
   * @param {number}           [params.height=0]             Image height.
   * @param {string|ImageType} [params.type=ImageTypes.JPEG] Image type.
   * @param {Book}             [params.book=Book.Unknown]    Image's Book.
   */constructor({id:id=0,width:width=0,height:height=0,type:type=this.constructor.types.JPEG,book:book=Book.Unknown}={}){_defineProperty(this,"id",0),_defineProperty(this,"width",0),_defineProperty(this,"height",0),_defineProperty(this,"type",this.constructor.types.JPEG),_defineProperty(this,"book",Book.Unknown),Object.assign(this,{id:"number"==typeof id?id<1?0:id:0,width:width,height:height,type:type instanceof ImageType?type:this.constructor.types.get(type),book:book instanceof Book?book:Book.Unknown})}
/**
   * Whatever this image is book cover.
   * @type {boolean}
   */get isCover(){return this.id<1}
/**
   * Image filename.
   * @type {string}
   */get filename(){return`${this.isCover?"cover":this.id}.${this.type.extension}`}}_defineProperty(Image,"types",{JPEG:new ImageType("jpeg","jpg"),PNG:new ImageType("png","png"),GIF:new ImageType("gif","gif"),WEBP:new ImageType("webp","webp"),Unknown:new UnknownImageType("unknown","unknownExt"),
/**
   * Known image types.
   * @type {ImageType}
   */
known:ImageType.knownTypes,
/**
   * Get image type class instance by name.
   * @param {string} type Image type.
   * @returns {ImageType|UnknownImageType} Image type class instance.
   */
get(type){let known;if("string"==typeof type)switch(type=type.toLowerCase()){case"j":case"jpg":case"jpeg":type="jpeg";break;case"p":case"png":type="png";break;case"g":case"gif":type="gif";break;case"w":case"webp":type="webp"}return(known=this.known[type])?known:new UnknownImageType(type)}});
// eslint-disable-next-line no-unused-vars
/**
 * Array of Tags with helper methods.
 * @class
 * @extends Array<Tag>
 */
class TagsArray extends Array{constructor(...args){super(...args)}
/**
   * Get array of tags names.
   * @param {?boolean} [includeCount=false] Include count.
   * @returns {String[]}
   */toNames(includeCount=!1){return Array.from(this,(tag=>tag.toString(includeCount)))}}
/**
 * Book object from API.
 * @global
 * @typedef {object} APIBook
 * @property {object}        title          Book title.
 * @property {string}        title.english  Book english title.
 * @property {string}        title.japanese Book japanese title.
 * @property {string}        title.pretty   Book short title.
 * @property {number|string} id             Book ID.
 * @property {number|string} media_id       Book Media ID.
 * @property {number|string} num_favorites  Book favours count.
 * @property {number|string} num_pages      Book pages count.
 * @property {string}        scanlator      Book scanlator.
 * @property {number|string} uploaded       Upload UNIX timestamp.
 * @property {APIImage}      cover          Book cover image.
 * @property {APIImage[]}    images         Book pages' images.
 * @property {APITag[]}      tags           Book tags.
 */
/**
 * Book title.
 * @typedef {object} BookTitle
 * @property {string} english  Book english title.
 * @property {string} japanese Book japanese title.
 * @property {string} pretty   Book short title.
 */
/**
 * Class representing Book.
 * @class
 */class Book{
/**
   * Unknown book instance.
   * @type {UnknownBook}
   * @static
   */
/**
   * UnknownBook class.
   * @type {UnknownBook}
   * @static
   */
/**
   * Parse book object into class instance.
   * @param {APIBook} book Book.
   * @returns {Book} Book instance.
   * @static
   */
static parse(book){return new this({title:book.title,id:+book.id,media:+book.media_id,favorites:+book.num_favorites,scanlator:book.scanlator,uploaded:new Date(1e3*+book.upload_date),tags:TagsArray.from(book.tags,(tag=>Tag.get(tag))),cover:Image.parse(book.images.cover),pages:book.images.pages.map(((image,id)=>Image.parse(image,++id)))})}
/**
   * Book title.
   * @type {BookTitle}
   */
/**
   * Create book.
   * @param {object}          [params]              Book parameters.
   * @param {BookTitle}       [params.title]        Book title.
   * @param {number}          [params.id=0]         Book ID.
   * @param {number}          [params.media=0]      Book Media ID.
   * @param {number}          [params.favorites=0]  Book favours count.
   * @param {string}          [params.scanlator=''] Book scanlator.
   * @param {Date}            [params.uploaded]     Book upload date.
   * @param {Tag[]|TagsArray} [params.tags=[]]      Book tags.
   * @param {Image}           [params.cover]        Book cover.
   * @param {Image[]}         [params.pages=[]]     Book pages.
   */constructor({title:title={english:"",japanese:"",pretty:""},id:id=0,media:media=0,favorites:favorites=0,scanlator:scanlator="",uploaded:uploaded=new Date(0),tags:tags=new TagsArray,cover:cover=new Image({id:0,book:this}),pages:pages=[]}={}){_defineProperty(this,"title",{english:"",japanese:"",pretty:""}),_defineProperty(this,"id",0),_defineProperty(this,"media",0),_defineProperty(this,"favorites",0),_defineProperty(this,"scanlator",""),_defineProperty(this,"uploaded",new Date(0)),_defineProperty(this,"tags",new TagsArray),_defineProperty(this,"cover",new Image({id:0,book:this})),_defineProperty(this,"pages",[]),this.setCover(cover),Array.isArray(pages)&&pages.forEach(this.pushPage.bind(this)),Array.isArray(tags)&&tags.forEach(this.pushTag.bind(this)),Object.assign(this,{title:title,id:id,media:media,favorites:favorites,scanlator:scanlator,uploaded:uploaded})}
/**
   * Check whatever book is known.
   * @type {boolean}
   */get isKnown(){return!(this instanceof UnknownBook)}
/**
   * Set book cover image.
   * @param {Image} cover Image.
   * @returns {boolean} Whatever cover was set.
   * @private
   */setCover(cover){return cover instanceof Image&&(cover.book=this,this.cover=cover,!0)}
/**
   * Push image to book pages.
   * @param {Image} page Image.
   * @returns {boolean} Whatever page was added.
   * @private
   */pushPage(page){return page instanceof Image&&(page.book=this,this.pages.push(page),!0)}
/**
   * Push tag to book tags.
   * @param {Tag} tag Tag.
   * @returns {boolean} Whatever tag was added.
   * @private
   */pushTag(tag){return tag=Tag.get(tag),!this.hasTag(tag)&&(this.tags.push(tag),!0)}
/**
   * Check if book has certain tag.
   * @param {Tag}     tag            Tag
   * @param {boolean} [strict=false] Strict comparison.
   */hasTag(tag,strict=!0){return tag=Tag.get(tag),this.tags.some((elem=>elem.compare(tag,strict)))}
/**
   * Check if book has any tags with certain properties.
   * @param {object|Tag} tag Tag.
   */hasTagWith(tag){return this.hasTag(tag,"any")}
/**
   * Get any tags with certain properties.
   * @param {object|Tag} tag Tag.
   * @returns {TagsArray}
   */getTagsWith(tag){return tag=Tag.get(tag),this.tags.filter((elem=>elem.compare(tag,"any")))}
/**
   * Pure tags (with type {TagType.Tag}).
   * @type {Tag[]}
   */get pureTags(){return this.getTagsWith({type:TagTypes.Tag})}
/**
   * Category tags.
   * @type {Tag[]}
   */get categories(){return this.getTagsWith({type:TagTypes.Category})}
/**
   * Artist tags.
   * @type {Tag[]}
   */get artists(){return this.getTagsWith({type:TagTypes.Artist})}
/**
   * Parody tags.
   * @type {Tag[]}
   */get parodies(){return this.getTagsWith({type:TagTypes.Parody})}
/**
   * Character tags.
   * @type {Tag[]}
   */get characters(){return this.getTagsWith({type:TagTypes.Character})}
/**
   * Group tags.
   * @type {Tag[]}
   */get groups(){return this.getTagsWith({type:TagTypes.Group})}
/**
   * Language tags.
   * @type {Tag[]}
   */get languages(){return this.getTagsWith({type:TagTypes.Language})}}
/**
 * Class representing unknown book.
 * @class
 * @extends Book
 */_defineProperty(Book,"Unknown",void 0),_defineProperty(Book,"UnknownBook",void 0);class UnknownBook extends Book{
/**
   * Create unknown book.
   */
constructor(){super({})}}Book.UnknownBook=UnknownBook,Book.Unknown=new UnknownBook;
/**
 * Search object from API.
 * @global
 * @typedef {object} APISearch
 * @property {APIBook[]}     result    Search results.
 * @property {number|string} num_pages Number of search pages available.
 * @property {number|string} per_page  Number of books per page.
 */
/**
 * @typedef {''|'popular'|'popular-week'|'popular-today'|'popular-month'} SearchSortMode
 */
class SearchSort{}
/**
 * Class representing search request results.
 * @class
 */_defineProperty(SearchSort,"Recent",""),_defineProperty(SearchSort,"Popular","popular"),_defineProperty(SearchSort,"PopularMonth","popular-month"),_defineProperty(SearchSort,"PopularWeek","popular-week"),_defineProperty(SearchSort,"PopularToday","poplar-today");class Search{
/**
   * Parse search object into class instance.
   * @param {APISearch} search Search object.
   */
static parse(search){return new this({pages:search.num_pages?+search.num_pages:1,perPage:search.per_page?+search.per_page:search.result.length,books:search.result.map(Book.parse.bind(Book))})}
/**
   * API instance.
   * @type {?API}
   * @default null
   */
/**
   * Create search.
   * @param {?object}         [params]           Search parameters.
   * @param {?string}         [params.query='']  Query string.
   * @param {?SearchSortMode} [params.sort='']   Search sort mode.
   * @param {?number}         [params.page=1]    Search page ID.
   * @param {?number}         [params.pages=1]   Search pages count.
   * @param {?number}         [params.perPage=0] Search books per page.
   * @param {?Book[]}         [params.books=[]]  Books array.
   */constructor({query:query=null,sort:sort="",page:page=1,pages:pages=1,perPage:perPage=0,books:books=[]}={}){_defineProperty(this,"api",null),_defineProperty(this,"query",null),_defineProperty(this,"sort",""),_defineProperty(this,"page",1),_defineProperty(this,"perPage",0),_defineProperty(this,"books",[]),_defineProperty(this,"pages",1),Array.isArray(books)&&books.forEach(this.pushBook.bind(this)),Object.assign(this,{query:query,sort:sort,page:page,pages:pages,perPage:perPage})}
/**
   * Push book to books array.
   * @param {Book} book Book.
   * @returns {boolean} Whatever was book added or not.
   * @private
   */pushBook(book){return book instanceof Book&&(this.books.push(book),!0)}
/**
   * Request next page.
   * @throws Error if search request can't be paginated.
   * @throws Error if `api` is missing as instance property or function argument.
   * @param {API} [api=this.api] API instance.
   * @returns {Promise<Search>} Next page search.
   */getNextPage(api=this.api){let{query:query,page:page,sort:sort}=this;if(null===query)throw Error("pagination impossible.");if(!(api instanceof API))throw Error("api must exists.");return query instanceof Tag?api.searchTagged(query,page+1,sort):api.search(query,page+1,sort)}}
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
 * @property {?Function}     puppeteerLaunch Custom function to launch Puppeteer browser. If provided, this will be used instead of the default launch configuration.
 */
/**
 * Applies provided options on top of defaults.
 * @param {?nHentaiOptions} [options={}] Options to apply.
 * @returns {nHentaiOptions} Unified options.
 */var debug$1,commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},followRedirects={exports:{}},url=require$$0,URL$1=url.URL,http=require$$1,https=require$$2,Writable$3=require$$3.Writable,assert=require$$4,debug=function(){if(!debug$1){try{
/* eslint global-require: off */
debug$1=require("debug")("follow-redirects")}catch(error){}"function"!=typeof debug$1&&(debug$1=function(){})}debug$1.apply(null,arguments)};
// Preventive platform detection
// istanbul ignore next
!function detectUnsupportedEnvironment(){var looksLikeNode="undefined"!=typeof process,looksLikeBrowser="undefined"!=typeof window&&"undefined"!=typeof document,looksLikeV8=isFunction(Error.captureStackTrace);looksLikeNode||!looksLikeBrowser&&looksLikeV8||console.warn("The follow-redirects package should be excluded from browser builds.")}();
// Whether to use the native URL object or the legacy url module
var useNativeURL=!1;try{assert(new URL$1(""))}catch(error){useNativeURL="ERR_INVALID_URL"===error.code}
// URL fields to preserve in copy operations
var preservedUrlFields=["auth","host","hostname","href","path","pathname","port","protocol","query","search","hash"],events=["abort","aborted","connect","error","socket","timeout"],eventHandlers=Object.create(null);
// Create handlers that pass events from native requests
events.forEach((function(event){eventHandlers[event]=function(arg1,arg2,arg3){this._redirectable.emit(event,arg1,arg2,arg3)}}));
// Error types with codes
var InvalidUrlError=createErrorType("ERR_INVALID_URL","Invalid URL",TypeError),RedirectionError=createErrorType("ERR_FR_REDIRECTION_FAILURE","Redirected request failed"),TooManyRedirectsError=createErrorType("ERR_FR_TOO_MANY_REDIRECTS","Maximum number of redirects exceeded",RedirectionError),MaxBodyLengthExceededError=createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED","Request body larger than maxBodyLength limit"),WriteAfterEndError=createErrorType("ERR_STREAM_WRITE_AFTER_END","write after end"),destroy=Writable$3.prototype.destroy||noop$6;
// An HTTP(S) request that can be redirected
function RedirectableRequest(options,responseCallback){
// Initialize the request
Writable$3.call(this),this._sanitizeOptions(options),this._options=options,this._ended=!1,this._ending=!1,this._redirectCount=0,this._redirects=[],this._requestBodyLength=0,this._requestBodyBuffers=[],
// Attach a callback if passed
responseCallback&&this.on("response",responseCallback);
// React to responses of native requests
var self=this;this._onNativeResponse=function(response){try{self._processResponse(response)}catch(cause){self.emit("error",cause instanceof RedirectionError?cause:new RedirectionError({cause:cause}))}},
// Perform the first request
this._performRequest()}
// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols){
// Default settings
var exports={maxRedirects:21,maxBodyLength:10485760},nativeProtocols={};
// Wrap each protocol
return Object.keys(protocols).forEach((function(scheme){var protocol=scheme+":",nativeProtocol=nativeProtocols[protocol]=protocols[scheme],wrappedProtocol=exports[scheme]=Object.create(nativeProtocol);
// Expose the properties on the wrapped protocol
Object.defineProperties(wrappedProtocol,{request:{value:
// Executes a request, following redirects
function request(input,options,callback){
// Parse parameters, ensuring that input is an object
return!function isURL(value){return URL$1&&value instanceof URL$1}
// Exports
(input)?isString(input)?input=spreadUrlObject(parseUrl(input)):(callback=options,options=validateUrl(input),input={protocol:protocol}):input=spreadUrlObject(input),isFunction(options)&&(callback=options,options=null),(
// Set defaults
options=Object.assign({maxRedirects:exports.maxRedirects,maxBodyLength:exports.maxBodyLength},input,options)).nativeProtocols=nativeProtocols,isString(options.host)||isString(options.hostname)||(options.hostname="::1"),assert.equal(options.protocol,protocol,"protocol mismatch"),debug("options",options),new RedirectableRequest(options,callback)}
// Executes a GET request, following redirects
,configurable:!0,enumerable:!0,writable:!0},get:{value:function get(input,options,callback){var wrappedRequest=wrappedProtocol.request(input,options,callback);return wrappedRequest.end(),wrappedRequest},configurable:!0,enumerable:!0,writable:!0}})})),exports}function noop$6(){/* empty */}function parseUrl(input){var parsed;
// istanbul ignore else
if(useNativeURL)parsed=new URL$1(input);else if(!isString((
// Ensure the URL is valid and absolute
parsed=validateUrl(url.parse(input))).protocol))throw new InvalidUrlError({input:input});return parsed}function validateUrl(input){if(/^\[/.test(input.hostname)&&!/^\[[:0-9a-f]+\]$/i.test(input.hostname))throw new InvalidUrlError({input:input.href||input});if(/^\[/.test(input.host)&&!/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host))throw new InvalidUrlError({input:input.href||input});return input}function spreadUrlObject(urlObject,target){var spread=target||{};for(var key of preservedUrlFields)spread[key]=urlObject[key];
// Fix IPv6 hostname
return spread.hostname.startsWith("[")&&(spread.hostname=spread.hostname.slice(1,-1)),
// Ensure port is a number
""!==spread.port&&(spread.port=Number(spread.port)),
// Concatenate path
spread.path=spread.search?spread.pathname+spread.search:spread.pathname,spread}function removeMatchingHeaders(regex,headers){var lastValue;for(var header in headers)regex.test(header)&&(lastValue=headers[header],delete headers[header]);return null===lastValue||"undefined"==typeof lastValue?void 0:String(lastValue).trim()}function createErrorType(code,message,baseClass){
// Create constructor
function CustomError(properties){
// istanbul ignore else
isFunction(Error.captureStackTrace)&&Error.captureStackTrace(this,this.constructor),Object.assign(this,properties||{}),this.code=code,this.message=this.cause?message+": "+this.cause.message:message}
// Attach constructor and set default properties
return CustomError.prototype=new(baseClass||Error),Object.defineProperties(CustomError.prototype,{constructor:{value:CustomError,enumerable:!1},name:{value:"Error ["+code+"]",enumerable:!1}}),CustomError}function destroyRequest(request,error){for(var event of events)request.removeListener(event,eventHandlers[event]);request.on("error",noop$6),request.destroy(error)}function isString(value){return"string"==typeof value||value instanceof String}function isFunction(value){return"function"==typeof value}RedirectableRequest.prototype=Object.create(Writable$3.prototype),RedirectableRequest.prototype.abort=function(){destroyRequest(this._currentRequest),this._currentRequest.abort(),this.emit("abort")},RedirectableRequest.prototype.destroy=function(error){return destroyRequest(this._currentRequest,error),destroy.call(this,error),this},
// Writes buffered data to the current native request
RedirectableRequest.prototype.write=function(data,encoding,callback){
// Writing is not allowed if end has been called
if(this._ending)throw new WriteAfterEndError;
// Validate input and shift parameters if necessary
if(!isString(data)&&!function isBuffer$1(value){return"object"==typeof value&&"length"in value}(data))throw new TypeError("data should be a string, Buffer or Uint8Array");isFunction(encoding)&&(callback=encoding,encoding=null),
// Ignore empty buffers, since writing them doesn't invoke the callback
// https://github.com/nodejs/node/issues/22066
0!==data.length?
// Only write when we don't exceed the maximum body length
this._requestBodyLength+data.length<=this._options.maxBodyLength?(this._requestBodyLength+=data.length,this._requestBodyBuffers.push({data:data,encoding:encoding}),this._currentRequest.write(data,encoding,callback)):(this.emit("error",new MaxBodyLengthExceededError),this.abort()):callback&&callback()},
// Ends the current native request
RedirectableRequest.prototype.end=function(data,encoding,callback){
// Write data if needed and end
if(
// Shift parameters if necessary
isFunction(data)?(callback=data,data=encoding=null):isFunction(encoding)&&(callback=encoding,encoding=null),data){var self=this,currentRequest=this._currentRequest;this.write(data,encoding,(function(){self._ended=!0,currentRequest.end(null,null,callback)})),this._ending=!0}else this._ended=this._ending=!0,this._currentRequest.end(null,null,callback)},
// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader=function(name,value){this._options.headers[name]=value,this._currentRequest.setHeader(name,value)},
// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader=function(name){delete this._options.headers[name],this._currentRequest.removeHeader(name)},
// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout=function(msecs,callback){var self=this;
// Destroys the socket on timeout
function destroyOnTimeout(socket){socket.setTimeout(msecs),socket.removeListener("timeout",socket.destroy),socket.addListener("timeout",socket.destroy)}
// Sets up a timer to trigger a timeout event
function startTimer(socket){self._timeout&&clearTimeout(self._timeout),self._timeout=setTimeout((function(){self.emit("timeout"),clearTimer()}),msecs),destroyOnTimeout(socket)}
// Stops a timeout from triggering
function clearTimer(){
// Clear the timeout
self._timeout&&(clearTimeout(self._timeout),self._timeout=null),
// Clean up all attached listeners
self.removeListener("abort",clearTimer),self.removeListener("error",clearTimer),self.removeListener("response",clearTimer),self.removeListener("close",clearTimer),callback&&self.removeListener("timeout",callback),self.socket||self._currentRequest.removeListener("socket",startTimer)}
// Attach callback if passed
return callback&&this.on("timeout",callback),
// Start the timer if or when the socket is opened
this.socket?startTimer(this.socket):this._currentRequest.once("socket",startTimer),
// Clean up on events
this.on("socket",destroyOnTimeout),this.on("abort",clearTimer),this.on("error",clearTimer),this.on("response",clearTimer),this.on("close",clearTimer),this},
// Proxy all other public ClientRequest methods
["flushHeaders","getHeader","setNoDelay","setSocketKeepAlive"].forEach((function(method){RedirectableRequest.prototype[method]=function(a,b){return this._currentRequest[method](a,b)}})),
// Proxy all public ClientRequest properties
["aborted","connection","socket"].forEach((function(property){Object.defineProperty(RedirectableRequest.prototype,property,{get:function(){return this._currentRequest[property]}})})),RedirectableRequest.prototype._sanitizeOptions=function(options){
// Complete the URL object when necessary
if(
// Ensure headers are always present
options.headers||(options.headers={}),
// Since http.request treats host as an alias of hostname,
// but the url module interprets host as hostname plus port,
// eliminate the host property to avoid confusion.
options.host&&(
// Use hostname if set, because it has precedence
options.hostname||(options.hostname=options.host),delete options.host),!options.pathname&&options.path){var searchPos=options.path.indexOf("?");searchPos<0?options.pathname=options.path:(options.pathname=options.path.substring(0,searchPos),options.search=options.path.substring(searchPos))}},
// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest=function(){
// Load the native protocol
var protocol=this._options.protocol,nativeProtocol=this._options.nativeProtocols[protocol];if(!nativeProtocol)throw new TypeError("Unsupported protocol "+protocol);
// If specified, use the agent corresponding to the protocol
// (HTTP and HTTPS use different types of agents)
if(this._options.agents){var scheme=protocol.slice(0,-1);this._options.agent=this._options.agents[scheme]}
// Create the native request and set up its event handlers
var request=this._currentRequest=nativeProtocol.request(this._options,this._onNativeResponse);for(var event of(request._redirectable=this,events))request.on(event,eventHandlers[event]);
// RFC7230§5.3.1: When making a request directly to an origin server, […]
// a client MUST send only the absolute path […] as the request-target.
// End a redirected request
// (The first request must be ended explicitly with RedirectableRequest#end)
if(this._currentUrl=/^\//.test(this._options.path)?url.format(this._options):
// When making a request to a proxy, […]
// a client MUST send the target URI in absolute-form […].
this._options.path,this._isRedirect){
// Write the request entity and end
var i=0,self=this,buffers=this._requestBodyBuffers;!function writeNext(error){
// Only write if this request has not been redirected yet
// istanbul ignore else
if(request===self._currentRequest)
// Report any write errors
// istanbul ignore if
if(error)self.emit("error",error);else if(i<buffers.length){var buffer=buffers[i++];
// istanbul ignore else
request.finished||request.write(buffer.data,buffer.encoding,writeNext)}
// End the request if `end` has been called on us
else self._ended&&request.end()}()}},
// Processes a response from the current native request
RedirectableRequest.prototype._processResponse=function(response){
// Store the redirected response
var statusCode=response.statusCode;this._options.trackRedirects&&this._redirects.push({url:this._currentUrl,headers:response.headers,statusCode:statusCode});
// RFC7231§6.4: The 3xx (Redirection) class of status code indicates
// that further action needs to be taken by the user agent in order to
// fulfill the request. If a Location header field is provided,
// the user agent MAY automatically redirect its request to the URI
// referenced by the Location field value,
// even if the specific status code is not understood.
// If the response is not a redirect; return it as-is
var requestHeaders,location=response.headers.location;if(!location||!1===this._options.followRedirects||statusCode<300||statusCode>=400)return response.responseUrl=this._currentUrl,response.redirects=this._redirects,this.emit("response",response),void(
// Clean up
this._requestBodyBuffers=[]);
// The response is a redirect, so abort the current request
// RFC7231§6.4: A client SHOULD detect and intervene
// in cyclical redirections (i.e., "infinite" redirection loops).
if(destroyRequest(this._currentRequest),
// Discard the remainder of the response to avoid waiting for data
response.destroy(),++this._redirectCount>this._options.maxRedirects)throw new TooManyRedirectsError;
// Store the request headers if applicable
var beforeRedirect=this._options.beforeRedirect;beforeRedirect&&(requestHeaders=Object.assign({
// The Host header was set by nativeProtocol.request
Host:response.req.getHeader("host")},this._options.headers));
// RFC7231§6.4: Automatic redirection needs to done with
// care for methods not known to be safe, […]
// RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
// the request method from POST to GET for the subsequent request.
var method=this._options.method;((301===statusCode||302===statusCode)&&"POST"===this._options.method||
// RFC7231§6.4.4: The 303 (See Other) status code indicates that
// the server is redirecting the user agent to a different resource […]
// A user agent can perform a retrieval request targeting that URI
// (a GET or HEAD request if using HTTP) […]
303===statusCode&&!/^(?:GET|HEAD)$/.test(this._options.method))&&(this._options.method="GET",
// Drop a possible entity and headers related to it
this._requestBodyBuffers=[],removeMatchingHeaders(/^content-/i,this._options.headers));
// Drop the Host header, as the redirect might lead to a different host
var currentHostHeader=removeMatchingHeaders(/^host$/i,this._options.headers),currentUrlParts=parseUrl(this._currentUrl),currentHost=currentHostHeader||currentUrlParts.host,currentUrl=/^\w+:/.test(location)?this._currentUrl:url.format(Object.assign(currentUrlParts,{host:currentHost})),redirectUrl=function resolveUrl(relative,base){
// istanbul ignore next
return useNativeURL?new URL$1(relative,base):parseUrl(url.resolve(base,relative))}(location,currentUrl);
// If the redirect is relative, carry over the host of the last request
// Evaluate the beforeRedirect callback
if(debug("redirecting to",redirectUrl.href),this._isRedirect=!0,spreadUrlObject(redirectUrl,this._options),
// Drop confidential headers when redirecting to a less secure protocol
// or to a different domain that is not a superdomain
(redirectUrl.protocol!==currentUrlParts.protocol&&"https:"!==redirectUrl.protocol||redirectUrl.host!==currentHost&&!function isSubdomain(subdomain,domain){assert(isString(subdomain)&&isString(domain));var dot=subdomain.length-domain.length-1;return dot>0&&"."===subdomain[dot]&&subdomain.endsWith(domain)}(redirectUrl.host,currentHost))&&removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i,this._options.headers),isFunction(beforeRedirect)){var responseDetails={headers:response.headers,statusCode:statusCode},requestDetails={url:currentUrl,method:method,headers:requestHeaders};beforeRedirect(this._options,responseDetails,requestDetails),this._sanitizeOptions(this._options)}
// Perform the redirected request
this._performRequest()},followRedirects.exports=wrap({http:http,https:https}),followRedirects.exports.wrap=wrap;var fr=followRedirects.exports,tarStream={};const FixedFIFO=class FixedFIFO{constructor(hwm){if(!(hwm>0)||0!=(hwm-1&hwm))throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(hwm),this.mask=hwm-1,this.top=0,this.btm=0,this.next=null}clear(){this.top=this.btm=0,this.next=null,this.buffer.fill(void 0)}push(data){return void 0===this.buffer[this.top]&&(this.buffer[this.top]=data,this.top=this.top+1&this.mask,!0)}shift(){const last=this.buffer[this.btm];if(void 0!==last)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,last}peek(){return this.buffer[this.btm]}isEmpty(){return void 0===this.buffer[this.btm]}};var fastFifo=class FastFIFO{constructor(hwm){this.hwm=hwm||16,this.head=new FixedFIFO(this.hwm),this.tail=this.head,this.length=0}clear(){this.head=this.tail,this.head.clear(),this.length=0}push(val){if(this.length++,!this.head.push(val)){const prev=this.head;this.head=prev.next=new FixedFIFO(2*this.head.buffer.length),this.head.push(val)}}shift(){0!==this.length&&this.length--;const val=this.tail.shift();if(void 0===val&&this.tail.next){const next=this.tail.next;return this.tail.next=null,this.tail=next,this.tail.shift()}return val}peek(){const val=this.tail.peek();return void 0===val&&this.tail.next?this.tail.next.peek():val}isEmpty(){return 0===this.length}};function toBuffer(buffer){return Buffer.isBuffer(buffer)?buffer:Buffer.from(buffer.buffer,buffer.byteOffset,buffer.byteLength)}var b4a$5={isBuffer:function isBuffer(value){return Buffer.isBuffer(value)||value instanceof Uint8Array},isEncoding:function isEncoding(encoding){return Buffer.isEncoding(encoding)},alloc:function alloc(size,fill,encoding){return Buffer.alloc(size,fill,encoding)},allocUnsafe:function allocUnsafe(size){return Buffer.allocUnsafe(size)},allocUnsafeSlow:function allocUnsafeSlow(size){return Buffer.allocUnsafeSlow(size)},byteLength:function byteLength(string,encoding){return Buffer.byteLength(string,encoding)},compare:function compare(a,b){return Buffer.compare(a,b)},concat:function concat(buffers,totalLength){return Buffer.concat(buffers,totalLength)},copy:function copy(source,target,targetStart,start,end){return toBuffer(source).copy(target,targetStart,start,end)},equals:function equals(a,b){return toBuffer(a).equals(b)},fill:function fill(buffer,value,offset,end,encoding){return toBuffer(buffer).fill(value,offset,end,encoding)},from:function from(value,encodingOrOffset,length){return Buffer.from(value,encodingOrOffset,length)},includes:function includes(buffer,value,byteOffset,encoding){return toBuffer(buffer).includes(value,byteOffset,encoding)},indexOf:function indexOf$1(buffer,value,byfeOffset,encoding){return toBuffer(buffer).indexOf(value,byfeOffset,encoding)},lastIndexOf:function lastIndexOf(buffer,value,byteOffset,encoding){return toBuffer(buffer).lastIndexOf(value,byteOffset,encoding)},swap16:function swap16(buffer){return toBuffer(buffer).swap16()},swap32:function swap32(buffer){return toBuffer(buffer).swap32()},swap64:function swap64(buffer){return toBuffer(buffer).swap64()},toBuffer:toBuffer,toString:function toString(buffer,encoding,start,end){return toBuffer(buffer).toString(encoding,start,end)},write:function write(buffer,string,offset,length,encoding){return toBuffer(buffer).write(string,offset,length,encoding)},writeDoubleLE:function writeDoubleLE(buffer,value,offset){return toBuffer(buffer).writeDoubleLE(value,offset)},writeFloatLE:function writeFloatLE(buffer,value,offset){return toBuffer(buffer).writeFloatLE(value,offset)},writeUInt32LE:function writeUInt32LE(buffer,value,offset){return toBuffer(buffer).writeUInt32LE(value,offset)},writeInt32LE:function writeInt32LE(buffer,value,offset){return toBuffer(buffer).writeInt32LE(value,offset)},readDoubleLE:function readDoubleLE(buffer,offset){return toBuffer(buffer).readDoubleLE(offset)},readFloatLE:function readFloatLE(buffer,offset){return toBuffer(buffer).readFloatLE(offset)},readUInt32LE:function readUInt32LE(buffer,offset){return toBuffer(buffer).readUInt32LE(offset)},readInt32LE:function readInt32LE(buffer,offset){return toBuffer(buffer).readInt32LE(offset)},writeDoubleBE:function writeDoubleBE(buffer,value,offset){return toBuffer(buffer).writeDoubleBE(value,offset)},writeFloatBE:function writeFloatBE(buffer,value,offset){return toBuffer(buffer).writeFloatBE(value,offset)},writeUInt32BE:function writeUInt32BE(buffer,value,offset){return toBuffer(buffer).writeUInt32BE(value,offset)},writeInt32BE:function writeInt32BE(buffer,value,offset){return toBuffer(buffer).writeInt32BE(value,offset)},readDoubleBE:function readDoubleBE(buffer,offset){return toBuffer(buffer).readDoubleBE(offset)},readFloatBE:function readFloatBE(buffer,offset){return toBuffer(buffer).readFloatBE(offset)},readUInt32BE:function readUInt32BE(buffer,offset){return toBuffer(buffer).readUInt32BE(offset)},readInt32BE:function readInt32BE(buffer,offset){return toBuffer(buffer).readInt32BE(offset)}};const b4a$4=b4a$5;const b4a$3=b4a$5;
/**
 * https://encoding.spec.whatwg.org/#utf-8-decoder
 */const PassThroughDecoder=class PassThroughDecoder{constructor(encoding){this.encoding=encoding}get remaining(){return 0}decode(tail){return b4a$4.toString(tail,this.encoding)}flush(){return""}},UTF8Decoder=class UTF8Decoder{constructor(){this.codePoint=0,this.bytesSeen=0,this.bytesNeeded=0,this.lowerBoundary=128,this.upperBoundary=191}get remaining(){return this.bytesSeen}decode(data){
// If we have a fast path, just sniff if the last part is a boundary
if(0===this.bytesNeeded){let isBoundary=!0;for(let i=Math.max(0,data.byteLength-4),n=data.byteLength;i<n&&isBoundary;i++)isBoundary=data[i]<=127;if(isBoundary)return b4a$3.toString(data,"utf8")}let result="";for(let i=0,n=data.byteLength;i<n;i++){const byte=data[i];0!==this.bytesNeeded?byte<this.lowerBoundary||byte>this.upperBoundary?(this.codePoint=0,this.bytesNeeded=0,this.bytesSeen=0,this.lowerBoundary=128,this.upperBoundary=191,result+="�"):(this.lowerBoundary=128,this.upperBoundary=191,this.codePoint=this.codePoint<<6|63&byte,this.bytesSeen++,this.bytesSeen===this.bytesNeeded&&(result+=String.fromCodePoint(this.codePoint),this.codePoint=0,this.bytesNeeded=0,this.bytesSeen=0)):byte<=127?result+=String.fromCharCode(byte):(this.bytesSeen=1,byte>=194&&byte<=223?(this.bytesNeeded=2,this.codePoint=31&byte):byte>=224&&byte<=239?(224===byte?this.lowerBoundary=160:237===byte&&(this.upperBoundary=159),this.bytesNeeded=3,this.codePoint=15&byte):byte>=240&&byte<=244?(240===byte&&(this.lowerBoundary=144),244===byte&&(this.upperBoundary=143),this.bytesNeeded=4,this.codePoint=7&byte):result+="�")}return result}flush(){const result=this.bytesNeeded>0?"�":"";return this.codePoint=0,this.bytesNeeded=0,this.bytesSeen=0,this.lowerBoundary=128,this.upperBoundary=191,result}};const{EventEmitter:EventEmitter}=require$$0$1,STREAM_DESTROYED=new Error("Stream was destroyed"),PREMATURE_CLOSE=new Error("Premature close"),FIFO$1=fastFifo,TextDecoder=class TextDecoder{constructor(encoding="utf8"){switch(this.encoding=function normalizeEncoding(encoding){switch(encoding=encoding.toLowerCase()){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return encoding;default:throw new Error("Unknown encoding: "+encoding)}}(encoding),this.encoding){case"utf8":this.decoder=new UTF8Decoder;break;case"utf16le":case"base64":throw new Error("Unsupported encoding: "+this.encoding);default:this.decoder=new PassThroughDecoder(this.encoding)}}get remaining(){return this.decoder.remaining}push(data){return"string"==typeof data?data:this.decoder.decode(data)}
// For Node.js compatibility
write(data){return this.push(data)}end(data){let result="";return data&&(result=this.push(data)),result+=this.decoder.flush(),result}},qmt="undefined"==typeof queueMicrotask?fn=>commonjsGlobal.process.nextTick(fn):queueMicrotask,asyncIterator=Symbol.asyncIterator||Symbol("asyncIterator");class WritableState{constructor(stream,{highWaterMark:highWaterMark=16384,map:map=null,mapWritable:mapWritable,byteLength:byteLength,byteLengthWritable:byteLengthWritable}={}){this.stream=stream,this.queue=new FIFO$1,this.highWaterMark=highWaterMark,this.buffered=0,this.error=null,this.pipeline=null,this.drains=null,// if we add more seldomly used helpers we might them into a subobject so its a single ptr
this.byteLength=byteLengthWritable||byteLength||defaultByteLength,this.map=mapWritable||map,this.afterWrite=afterWrite.bind(this),this.afterUpdateNextTick=updateWriteNT.bind(this)}get ended(){return 0!=(8388608&this.stream._duplexState)}push(data){return 0==(142606350&this.stream._duplexState)&&(null!==this.map&&(data=this.map(data)),this.buffered+=this.byteLength(data),this.queue.push(data),this.buffered<this.highWaterMark?(this.stream._duplexState|=2097152,!0):(this.stream._duplexState|=6291456,!1))}shift(){const data=this.queue.shift();return this.buffered-=this.byteLength(data),0===this.buffered&&(this.stream._duplexState&=534773759),data}end(data){"function"==typeof data?this.stream.once("finish",data):null!=data&&this.push(data),this.stream._duplexState=535822335&(134217728|this.stream._duplexState)}autoBatch(data,cb){const buffer=[],stream=this.stream;for(buffer.push(data);2359296==(270794767&stream._duplexState);)buffer.push(stream._writableState.shift());if(0!=(15&stream._duplexState))return cb(null);stream._writev(buffer,cb)}update(){const stream=this.stream;stream._duplexState|=524288;do{for(;2097152==(270794767&stream._duplexState);){const data=this.shift();stream._duplexState|=67371008,stream._write(data,this.afterWrite)}0==(1310720&stream._duplexState)&&this.updateNonPrimary()}while(!0===this.continueUpdate());stream._duplexState&=536346623}updateNonPrimary(){const stream=this.stream;if(134217728==(144965647&stream._duplexState))return stream._duplexState=262144|stream._duplexState,void stream._final(afterFinal.bind(this));4!=(14&stream._duplexState)?1==(33587215&stream._duplexState)&&(stream._duplexState=536870910&(262160|stream._duplexState),stream._open(afterOpen.bind(this))):0==(33587200&stream._duplexState)&&(stream._duplexState|=262160,stream._destroy(afterDestroy.bind(this)))}continueUpdate(){return 0!=(33554432&this.stream._duplexState)&&(this.stream._duplexState&=503316479,!0)}updateCallback(){1048576==(35127311&this.stream._duplexState)?this.update():this.updateNextTick()}updateNextTick(){0==(33554432&this.stream._duplexState)&&(this.stream._duplexState|=33554432,0==(524288&this.stream._duplexState)&&qmt(this.afterUpdateNextTick))}}class ReadableState{constructor(stream,{highWaterMark:highWaterMark=16384,map:map=null,mapReadable:mapReadable,byteLength:byteLength,byteLengthReadable:byteLengthReadable}={}){this.stream=stream,this.queue=new FIFO$1,this.highWaterMark=0===highWaterMark?1:highWaterMark,this.buffered=0,this.readAhead=highWaterMark>0,this.error=null,this.pipeline=null,this.byteLength=byteLengthReadable||byteLength||defaultByteLength,this.map=mapReadable||map,this.pipeTo=null,this.afterRead=afterRead.bind(this),this.afterUpdateNextTick=updateReadNT.bind(this)}get ended(){return 0!=(16384&this.stream._duplexState)}pipe(pipeTo,cb){if(null!==this.pipeTo)throw new Error("Can only pipe to one destination");// We already error handle this so supress crashes
if("function"!=typeof cb&&(cb=null),this.stream._duplexState|=512,this.pipeTo=pipeTo,this.pipeline=new Pipeline(this.stream,pipeTo,cb),cb&&this.stream.on("error",noop$5),isStreamx(pipeTo))pipeTo._writableState.pipeline=this.pipeline,cb&&pipeTo.on("error",noop$5),// We already error handle this so supress crashes
pipeTo.on("finish",this.pipeline.finished.bind(this.pipeline));else{const onerror=this.pipeline.done.bind(this.pipeline,pipeTo),onclose=this.pipeline.done.bind(this.pipeline,pipeTo,null);// onclose has a weird bool arg
pipeTo.on("error",onerror),pipeTo.on("close",onclose),pipeTo.on("finish",this.pipeline.finished.bind(this.pipeline))}pipeTo.on("drain",afterDrain.bind(this)),this.stream.emit("piping",pipeTo),pipeTo.emit("pipe",this.stream)}push(data){const stream=this.stream;return null===data?(this.highWaterMark=0,stream._duplexState=536805311&(1024|stream._duplexState),!1):null!==this.map&&null===(data=this.map(data))?(stream._duplexState&=536805375,this.buffered<this.highWaterMark):(this.buffered+=this.byteLength(data),this.queue.push(data),stream._duplexState=536805375&(128|stream._duplexState),this.buffered<this.highWaterMark)}shift(){const data=this.queue.shift();return this.buffered-=this.byteLength(data),0===this.buffered&&(this.stream._duplexState&=536862591),data}unshift(data){const pending=[null!==this.map?this.map(data):data];for(;this.buffered>0;)pending.push(this.shift());for(let i=0;i<pending.length-1;i++){const data=pending[i];this.buffered+=this.byteLength(data),this.queue.push(data)}this.push(pending[pending.length-1])}read(){const stream=this.stream;if(128==(16527&stream._duplexState)){const data=this.shift();return null!==this.pipeTo&&!1===this.pipeTo.write(data)&&(stream._duplexState&=536870143),0!=(2048&stream._duplexState)&&stream.emit("data",data),data}return!1===this.readAhead&&(stream._duplexState|=131072,this.updateNextTick()),null}drain(){const stream=this.stream;for(;128==(16527&stream._duplexState)&&0!=(768&stream._duplexState);){const data=this.shift();null!==this.pipeTo&&!1===this.pipeTo.write(data)&&(stream._duplexState&=536870143),0!=(2048&stream._duplexState)&&stream.emit("data",data)}}update(){const stream=this.stream;stream._duplexState|=32;do{for(this.drain();this.buffered<this.highWaterMark&&131072==(214047&stream._duplexState);)stream._duplexState|=65552,stream._read(this.afterRead),this.drain();4224==(12431&stream._duplexState)&&(stream._duplexState|=8192,stream.emit("readable")),0==(80&stream._duplexState)&&this.updateNonPrimary()}while(!0===this.continueUpdate());stream._duplexState&=536870879}updateNonPrimary(){const stream=this.stream;1024==(1167&stream._duplexState)&&(stream._duplexState=536869887&(16384|stream._duplexState),stream.emit("end"),8404992==(8405006&stream._duplexState)&&(stream._duplexState|=4),null!==this.pipeTo&&this.pipeTo.end()),4!=(14&stream._duplexState)?1==(33587215&stream._duplexState)&&(stream._duplexState=536870910&(262160|stream._duplexState),stream._open(afterOpen.bind(this))):0==(33587200&stream._duplexState)&&(stream._duplexState|=262160,stream._destroy(afterDestroy.bind(this)))}continueUpdate(){return 0!=(32768&this.stream._duplexState)&&(this.stream._duplexState&=536838143,!0)}updateCallback(){64==(32879&this.stream._duplexState)?this.update():this.updateNextTick()}updateNextTickIfOpen(){0==(32769&this.stream._duplexState)&&(this.stream._duplexState|=32768,0==(32&this.stream._duplexState)&&qmt(this.afterUpdateNextTick))}updateNextTick(){0==(32768&this.stream._duplexState)&&(this.stream._duplexState|=32768,0==(32&this.stream._duplexState)&&qmt(this.afterUpdateNextTick))}}class TransformState{constructor(stream){this.data=null,this.afterTransform=afterTransform.bind(stream),this.afterFinal=null}}class Pipeline{constructor(src,dst,cb){this.from=src,this.to=dst,this.afterPipe=cb,this.error=null,this.pipeToFinished=!1}finished(){this.pipeToFinished=!0}done(stream,err){err&&(this.error=err),stream!==this.to||(this.to=null,null===this.from)?stream!==this.from||(this.from=null,null===this.to)?(null!==this.afterPipe&&this.afterPipe(this.error),this.to=this.from=this.afterPipe=null):0==(16384&stream._duplexState)&&this.to.destroy(this.error||new Error("Readable stream closed before ending")):0!=(16384&this.from._duplexState)&&this.pipeToFinished||this.from.destroy(this.error||new Error("Writable stream closed prematurely"))}}function afterDrain(){this.stream._duplexState|=512,this.updateCallback()}function afterFinal(err){const stream=this.stream;err&&stream.destroy(err),0==(14&stream._duplexState)&&(stream._duplexState|=8388608,stream.emit("finish")),8404992==(8405006&stream._duplexState)&&(stream._duplexState|=4),stream._duplexState&=402391039,
// no need to wait the extra tick here, so we short circuit that
0==(524288&stream._duplexState)?this.update():this.updateNextTick()}function afterDestroy(err){const stream=this.stream;err||this.error===STREAM_DESTROYED||(err=this.error),err&&stream.emit("error",err),stream._duplexState|=8,stream.emit("close");const rs=stream._readableState,ws=stream._writableState;if(null!==rs&&null!==rs.pipeline&&rs.pipeline.done(stream,err),null!==ws){for(;null!==ws.drains&&ws.drains.length>0;)ws.drains.shift().resolve(!1);null!==ws.pipeline&&ws.pipeline.done(stream,err)}}function afterWrite(err){const stream=this.stream;err&&stream.destroy(err),stream._duplexState&=469499903,null!==this.drains&&function tickDrains(drains){for(let i=0;i<drains.length;i++)
// drains.writes are monotonic, so if one is 0 its always the first one
0==--drains[i].writes&&(drains.shift().resolve(!0),i--)}(this.drains),4194304==(6553615&stream._duplexState)&&(stream._duplexState&=532676607,16777216==(16777216&stream._duplexState)&&stream.emit("drain")),this.updateCallback()}function afterRead(err){err&&this.stream.destroy(err),this.stream._duplexState&=536870895,!1===this.readAhead&&0==(256&this.stream._duplexState)&&(this.stream._duplexState&=536739839),this.updateCallback()}function updateReadNT(){0==(32&this.stream._duplexState)&&(this.stream._duplexState&=536838143,this.update())}function updateWriteNT(){0==(524288&this.stream._duplexState)&&(this.stream._duplexState&=503316479,this.update())}function afterOpen(err){const stream=this.stream;err&&stream.destroy(err),0==(4&stream._duplexState)&&(0==(17423&stream._duplexState)&&(stream._duplexState|=64),0==(142606351&stream._duplexState)&&(stream._duplexState|=1048576),stream.emit("open")),stream._duplexState&=536608751,null!==stream._writableState&&stream._writableState.updateCallback(),null!==stream._readableState&&stream._readableState.updateCallback()}function afterTransform(err,data){null!=data&&this.push(data),this._writableState.afterWrite(err)}function newListener(name){null!==this._readableState&&("data"===name&&(this._duplexState|=133376,this._readableState.updateNextTick()),"readable"===name&&(this._duplexState|=4096,this._readableState.updateNextTick())),null!==this._writableState&&"drain"===name&&(this._duplexState|=16777216,this._writableState.updateNextTick())}class Stream extends EventEmitter{constructor(opts){super(),this._duplexState=0,this._readableState=null,this._writableState=null,opts&&(opts.open&&(this._open=opts.open),opts.destroy&&(this._destroy=opts.destroy),opts.predestroy&&(this._predestroy=opts.predestroy),opts.signal&&opts.signal.addEventListener("abort",abort.bind(this))),this.on("newListener",newListener)}_open(cb){cb(null)}_destroy(cb){cb(null)}_predestroy(){
// does nothing
}get readable(){return null!==this._readableState||void 0}get writable(){return null!==this._writableState||void 0}get destroyed(){return 0!=(8&this._duplexState)}get destroying(){return 0!=(14&this._duplexState)}destroy(err){0==(14&this._duplexState)&&(err||(err=STREAM_DESTROYED),this._duplexState=535822271&(4|this._duplexState),null!==this._readableState&&(this._readableState.highWaterMark=0,this._readableState.error=err),null!==this._writableState&&(this._writableState.highWaterMark=0,this._writableState.error=err),this._duplexState|=2,this._predestroy(),this._duplexState&=536870909,null!==this._readableState&&this._readableState.updateNextTick(),null!==this._writableState&&this._writableState.updateNextTick())}}class Readable$2 extends Stream{constructor(opts){super(opts),this._duplexState|=8519681,this._readableState=new ReadableState(this,opts),opts&&(!1===this._readableState.readAhead&&(this._duplexState&=536739839),opts.read&&(this._read=opts.read),opts.eagerOpen&&this._readableState.updateNextTick(),opts.encoding&&this.setEncoding(opts.encoding))}setEncoding(encoding){const dec=new TextDecoder(encoding),map=this._readableState.map||echo$1;return this._readableState.map=function mapOrSkip(data){const next=dec.push(data);return""===next&&(0!==data.byteLength||dec.remaining>0)?null:map(next)},this}_read(cb){cb(null)}pipe(dest,cb){return this._readableState.updateNextTick(),this._readableState.pipe(dest,cb),dest}read(){return this._readableState.updateNextTick(),this._readableState.read()}push(data){return this._readableState.updateNextTickIfOpen(),this._readableState.push(data)}unshift(data){return this._readableState.updateNextTickIfOpen(),this._readableState.unshift(data)}resume(){return this._duplexState|=131328,this._readableState.updateNextTick(),this}pause(){return this._duplexState&=!1===this._readableState.readAhead?536739583:536870655,this}static _fromAsyncIterator(ite,opts){let destroy;const rs=new Readable$2({...opts,read(cb){ite.next().then(push).then(cb.bind(null,null)).catch(cb)},predestroy(){destroy=ite.return()},destroy(cb){if(!destroy)return cb(null);destroy.then(cb.bind(null,null)).catch(cb)}});return rs;function push(data){data.done?rs.push(null):rs.push(data.value)}}static from(data,opts){if(function isReadStreamx(stream){return isStreamx(stream)&&stream.readable}(data))return data;if(data[asyncIterator])return this._fromAsyncIterator(data[asyncIterator](),opts);Array.isArray(data)||(data=void 0===data?[]:[data]);let i=0;return new Readable$2({...opts,read(cb){this.push(i===data.length?null:data[i++]),cb(null)}})}static isBackpressured(rs){return 0!=(17422&rs._duplexState)||rs._readableState.buffered>=rs._readableState.highWaterMark}static isPaused(rs){return 0==(256&rs._duplexState)}[asyncIterator](){const stream=this;let error=null,promiseResolve=null,promiseReject=null;return this.on("error",(err=>{error=err})),this.on("readable",(function onreadable(){null!==promiseResolve&&ondata(stream.read())})),this.on("close",(function onclose(){null!==promiseResolve&&ondata(null)})),{[asyncIterator](){return this},next(){return new Promise((function(resolve,reject){promiseResolve=resolve,promiseReject=reject;const data=stream.read();null!==data?ondata(data):0!=(8&stream._duplexState)&&ondata(null)}))},return(){return destroy(null)},throw(err){return destroy(err)}};function ondata(data){null!==promiseReject&&(error?promiseReject(error):null===data&&0==(16384&stream._duplexState)?promiseReject(STREAM_DESTROYED):promiseResolve({value:data,done:null===data}),promiseReject=promiseResolve=null)}function destroy(err){return stream.destroy(err),new Promise(((resolve,reject)=>{if(8&stream._duplexState)return resolve({value:void 0,done:!0});stream.once("close",(function(){err?reject(err):resolve({value:void 0,done:!0})}))}))}}}class Writable$2 extends Stream{constructor(opts){super(opts),this._duplexState|=16385,this._writableState=new WritableState(this,opts),opts&&(opts.writev&&(this._writev=opts.writev),opts.write&&(this._write=opts.write),opts.final&&(this._final=opts.final),opts.eagerOpen&&this._writableState.updateNextTick())}cork(){this._duplexState|=268435456}uncork(){this._duplexState&=268435455,this._writableState.updateNextTick()}_writev(batch,cb){cb(null)}_write(data,cb){this._writableState.autoBatch(data,cb)}_final(cb){cb(null)}static isBackpressured(ws){return 0!=(146800654&ws._duplexState)}static drained(ws){if(ws.destroyed)return Promise.resolve(!1);const state=ws._writableState,writes=(function isWritev(s){return s._writev!==Writable$2.prototype._writev&&s._writev!==Duplex.prototype._writev}(ws)?Math.min(1,state.queue.length):state.queue.length)+(67108864&ws._duplexState?1:0);return 0===writes?Promise.resolve(!0):(null===state.drains&&(state.drains=[]),new Promise((resolve=>{state.drains.push({writes:writes,resolve:resolve})})))}write(data){return this._writableState.updateNextTick(),this._writableState.push(data)}end(data){return this._writableState.updateNextTick(),this._writableState.end(data),this}}class Duplex extends Readable$2{// and Writable
constructor(opts){super(opts),this._duplexState=1|131072&this._duplexState,this._writableState=new WritableState(this,opts),opts&&(opts.writev&&(this._writev=opts.writev),opts.write&&(this._write=opts.write),opts.final&&(this._final=opts.final))}cork(){this._duplexState|=268435456}uncork(){this._duplexState&=268435455,this._writableState.updateNextTick()}_writev(batch,cb){cb(null)}_write(data,cb){this._writableState.autoBatch(data,cb)}_final(cb){cb(null)}write(data){return this._writableState.updateNextTick(),this._writableState.push(data)}end(data){return this._writableState.updateNextTick(),this._writableState.end(data),this}}class Transform extends Duplex{constructor(opts){super(opts),this._transformState=new TransformState(this),opts&&(opts.transform&&(this._transform=opts.transform),opts.flush&&(this._flush=opts.flush))}_write(data,cb){this._readableState.buffered>=this._readableState.highWaterMark?this._transformState.data=data:this._transform(data,this._transformState.afterTransform)}_read(cb){if(null!==this._transformState.data){const data=this._transformState.data;this._transformState.data=null,cb(null),this._transform(data,this._transformState.afterTransform)}else cb(null)}destroy(err){super.destroy(err),null!==this._transformState.data&&(this._transformState.data=null,this._transformState.afterTransform())}_transform(data,cb){cb(null,data)}_flush(cb){cb(null)}_final(cb){this._transformState.afterFinal=cb,this._flush(transformAfterFlush.bind(this))}}function transformAfterFlush(err,data){const cb=this._transformState.afterFinal;if(err)return cb(err);null!=data&&this.push(data),this.push(null),cb(null)}function pipeline(stream,...streams){const all=Array.isArray(stream)?[...stream,...streams]:[stream,...streams],done=all.length&&"function"==typeof all[all.length-1]?all.pop():null;if(all.length<2)throw new Error("Pipeline requires at least 2 streams");let src=all[0],dest=null,error=null;for(let i=1;i<all.length;i++)dest=all[i],isStreamx(src)?src.pipe(dest,onerror):(errorHandle(src,!0,i>1,onerror),src.pipe(dest)),src=dest;if(done){let fin=!1;const autoDestroy=isStreamx(dest)||!(!dest._writableState||!dest._writableState.autoDestroy);dest.on("error",(err=>{null===error&&(error=err)})),dest.on("finish",(()=>{fin=!0,autoDestroy||done(error)})),autoDestroy&&dest.on("close",(()=>done(error||(fin?null:PREMATURE_CLOSE))))}return dest;function errorHandle(s,rd,wr,onerror){s.on("error",onerror),s.on("close",(function onclose(){if(rd&&s._readableState&&!s._readableState.ended)return onerror(PREMATURE_CLOSE);if(wr&&s._writableState&&!s._writableState.ended)return onerror(PREMATURE_CLOSE)}))}function onerror(err){if(err&&!error){error=err;for(const s of all)s.destroy(err)}}}function echo$1(s){return s}function isStream(stream){return!!stream._readableState||!!stream._writableState}function isStreamx(stream){return"number"==typeof stream._duplexState&&isStream(stream)}function defaultByteLength(data){return function isTypedArray(data){return"object"==typeof data&&null!==data&&"number"==typeof data.byteLength}(data)?data.byteLength:1024}function noop$5(){}function abort(){this.destroy(new Error("Stream aborted."))}var streamx={pipeline:pipeline,pipelinePromise:function pipelinePromise(...streams){return new Promise(((resolve,reject)=>pipeline(...streams,(err=>{if(err)return reject(err);resolve()}))))},isStream:isStream,isStreamx:isStreamx,isEnded:function isEnded(stream){return!!stream._readableState&&stream._readableState.ended},isFinished:function isFinished(stream){return!!stream._writableState&&stream._writableState.ended},isDisturbed:function isDisturbed(stream){return 1!=(1&stream._duplexState)||0!=(33587200&stream._duplexState)},getStreamError:function getStreamError$2(stream,opts={}){const err=stream._readableState&&stream._readableState.error||stream._writableState&&stream._writableState.error;
// avoid implicit errors by default
return opts.all||err!==STREAM_DESTROYED?err:null},Stream:Stream,Writable:Writable$2,Readable:Readable$2,Duplex:Duplex,Transform:Transform,
// Export PassThrough for compatibility with Node.js core's stream module
PassThrough:class PassThrough extends Transform{}},headers$2={};const b4a$2=b4a$5,ZERO_OFFSET="0".charCodeAt(0),USTAR_MAGIC=b4a$2.from([117,115,116,97,114,0]),USTAR_VER=b4a$2.from([ZERO_OFFSET,ZERO_OFFSET]),GNU_MAGIC=b4a$2.from([117,115,116,97,114,32]),GNU_VER=b4a$2.from([32,0]);function indexOf(block,num,offset,end){for(;offset<end;offset++)if(block[offset]===num)return offset;return end}function cksum(block){let sum=256;for(let i=0;i<148;i++)sum+=block[i];for(let j=156;j<512;j++)sum+=block[j];return sum}function encodeOct(val,n){return(val=val.toString(8)).length>n?"7777777777777777777".slice(0,n)+" ":"0000000000000000000".slice(0,n-val.length)+val+" "}function decodeOct(val,offset,length){
// If prefixed with 0x80 then parse as a base-256 integer
if(128&(val=val.subarray(offset,offset+length))[offset=0])
/* Copied from the node-tar repo and modified to meet
 * tar-stream coding standard.
 *
 * Source: https://github.com/npm/node-tar/blob/51b6627a1f357d2eb433e7378e5f05e83b7aa6cd/lib/header.js#L349
 */
return function parse256(buf){
// first byte MUST be either 80 or FF
// 80 for positive, FF for 2's comp
let positive;if(128===buf[0])positive=!0;else{if(255!==buf[0])return null;
// build up a base-256 tuple from the least sig to the highest
positive=!1}const tuple=[];let i;for(i=buf.length-1;i>0;i--){const byte=buf[i];positive?tuple.push(byte):tuple.push(255-byte)}let sum=0;const l=tuple.length;for(i=0;i<l;i++)sum+=tuple[i]*Math.pow(256,i);return positive?sum:-1*sum}(val);{
// Older versions of tar can prefix with spaces
for(;offset<val.length&&32===val[offset];)offset++;const end=function clamp(index,len,defaultValue){return"number"!=typeof index?defaultValue:// Coerce to integer.
(index=~~index)>=len?len:index>=0||(index+=len)>=0?index:0}(indexOf(val,32,offset,val.length),val.length,val.length);for(;offset<end&&0===val[offset];)offset++;return end===offset?0:parseInt(b4a$2.toString(val.subarray(offset,end)),8)}}function decodeStr(val,offset,length,encoding){return b4a$2.toString(val.subarray(offset,indexOf(val,0,offset,offset+length)),encoding)}function addLength(str){const len=b4a$2.byteLength(str);let digits=Math.floor(Math.log(len)/Math.log(10))+1;return len+digits>=Math.pow(10,digits)&&digits++,len+digits+str}headers$2.decodeLongPath=function decodeLongPath(buf,encoding){return decodeStr(buf,0,buf.length,encoding)},headers$2.encodePax=function encodePax(opts){// TODO: encode more stuff in pax
let result="";opts.name&&(result+=addLength(" path="+opts.name+"\n")),opts.linkname&&(result+=addLength(" linkpath="+opts.linkname+"\n"));const pax=opts.pax;if(pax)for(const key in pax)result+=addLength(" "+key+"="+pax[key]+"\n");return b4a$2.from(result)},headers$2.decodePax=function decodePax(buf){const result={};for(;buf.length;){let i=0;for(;i<buf.length&&32!==buf[i];)i++;const len=parseInt(b4a$2.toString(buf.subarray(0,i)),10);if(!len)return result;const b=b4a$2.toString(buf.subarray(i+1,len-1)),keyIndex=b.indexOf("=");if(-1===keyIndex)return result;result[b.slice(0,keyIndex)]=b.slice(keyIndex+1),buf=buf.subarray(len)}return result},headers$2.encode=function encode(opts){const buf=b4a$2.alloc(512);let name=opts.name,prefix="";if(5===opts.typeflag&&"/"!==name[name.length-1]&&(name+="/"),b4a$2.byteLength(name)!==name.length)return null;// utf-8
for(;b4a$2.byteLength(name)>100;){const i=name.indexOf("/");if(-1===i)return null;prefix+=prefix?"/"+name.slice(0,i):name.slice(0,i),name=name.slice(i+1)}return b4a$2.byteLength(name)>100||b4a$2.byteLength(prefix)>155||opts.linkname&&b4a$2.byteLength(opts.linkname)>100?null:(b4a$2.write(buf,name),b4a$2.write(buf,encodeOct(4095&opts.mode,6),100),b4a$2.write(buf,encodeOct(opts.uid,6),108),b4a$2.write(buf,encodeOct(opts.gid,6),116),function encodeSize(num,buf,off){num.toString(8).length>11?function encodeSizeBin(num,buf,off){buf[off]=128;for(let i=11;i>0;i--)buf[off+i]=255&num,num=Math.floor(num/256)}(num,buf,off):b4a$2.write(buf,encodeOct(num,11),off)}(opts.size,buf,124),b4a$2.write(buf,encodeOct(opts.mtime.getTime()/1e3|0,11),136),buf[156]=ZERO_OFFSET+function toTypeflag(flag){switch(flag){case"file":return 0;case"link":return 1;case"symlink":return 2;case"character-device":return 3;case"block-device":return 4;case"directory":return 5;case"fifo":return 6;case"contiguous-file":return 7;case"pax-header":return 72}return 0}(opts.type),opts.linkname&&b4a$2.write(buf,opts.linkname,157),b4a$2.copy(USTAR_MAGIC,buf,257),b4a$2.copy(USTAR_VER,buf,263),opts.uname&&b4a$2.write(buf,opts.uname,265),opts.gname&&b4a$2.write(buf,opts.gname,297),b4a$2.write(buf,encodeOct(opts.devmajor||0,6),329),b4a$2.write(buf,encodeOct(opts.devminor||0,6),337),prefix&&b4a$2.write(buf,prefix,345),b4a$2.write(buf,encodeOct(cksum(buf),6),148),buf)},headers$2.decode=function decode(buf,filenameEncoding,allowUnknownFormat){let typeflag=0===buf[156]?0:buf[156]-ZERO_OFFSET,name=decodeStr(buf,0,100,filenameEncoding);const mode=decodeOct(buf,100,8),uid=decodeOct(buf,108,8),gid=decodeOct(buf,116,8),size=decodeOct(buf,124,12),mtime=decodeOct(buf,136,12),type=function toType(flag){switch(flag){case 0:return"file";case 1:return"link";case 2:return"symlink";case 3:return"character-device";case 4:return"block-device";case 5:return"directory";case 6:return"fifo";case 7:return"contiguous-file";case 72:return"pax-header";case 55:return"pax-global-header";case 27:return"gnu-long-link-path";case 28:case 30:return"gnu-long-path"}return null}(typeflag),linkname=0===buf[157]?null:decodeStr(buf,157,100,filenameEncoding),uname=decodeStr(buf,265,32),gname=decodeStr(buf,297,32),devmajor=decodeOct(buf,329,8),devminor=decodeOct(buf,337,8),c=cksum(buf);
// checksum is still initial value if header was null.
if(256===c)return null;
// valid checksum
if(c!==decodeOct(buf,148,8))throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");if(function isUSTAR(buf){return b4a$2.equals(USTAR_MAGIC,buf.subarray(257,263))}(buf))
// ustar (posix) format.
// prepend prefix, if present.
buf[345]&&(name=decodeStr(buf,345,155,filenameEncoding)+"/"+name);else if(function isGNU(buf){return b4a$2.equals(GNU_MAGIC,buf.subarray(257,263))&&b4a$2.equals(GNU_VER,buf.subarray(263,265))}(buf));else if(!allowUnknownFormat)throw new Error("Invalid tar header: unknown format.");
// to support old tar versions that use trailing / to indicate dirs
return 0===typeflag&&name&&"/"===name[name.length-1]&&(typeflag=5),{name:name,mode:mode,uid:uid,gid:gid,size:size,mtime:new Date(1e3*mtime),type:type,linkname:linkname,uname:uname,gname:gname,devmajor:devmajor,devminor:devminor,pax:null}};const{Writable:Writable$1,Readable:Readable$1,getStreamError:getStreamError$1}=streamx,FIFO=fastFifo,b4a$1=b4a$5,headers$1=headers$2,EMPTY=b4a$1.alloc(0);class BufferList{constructor(){this.buffered=0,this.shifted=0,this.queue=new FIFO,this._offset=0}push(buffer){this.buffered+=buffer.byteLength,this.queue.push(buffer)}shiftFirst(size){return 0===this._buffered?null:this._next(size)}shift(size){if(size>this.buffered)return null;if(0===size)return EMPTY;let chunk=this._next(size);if(size===chunk.byteLength)return chunk;// likely case
const chunks=[chunk];for(;(size-=chunk.byteLength)>0;)chunk=this._next(size),chunks.push(chunk);return b4a$1.concat(chunks)}_next(size){const buf=this.queue.peek(),rem=buf.byteLength-this._offset;if(size>=rem){const sub=this._offset?buf.subarray(this._offset,buf.byteLength):buf;return this.queue.shift(),this._offset=0,this.buffered-=rem,this.shifted+=rem,sub}return this.buffered-=size,this.shifted+=size,buf.subarray(this._offset,this._offset+=size)}}class Source extends Readable$1{constructor(self,header,offset){super(),this.header=header,this.offset=offset,this._parent=self}_read(cb){0===this.header.size&&this.push(null),this._parent._stream===this&&this._parent._update(),cb(null)}_predestroy(){this._parent.destroy(getStreamError$1(this))}_detach(){this._parent._stream===this&&(this._parent._stream=null,this._parent._missing=overflow$1(this.header.size),this._parent._update())}_destroy(cb){this._detach(),cb(null)}}class Extract extends Writable$1{constructor(opts){super(opts),opts||(opts={}),this._buffer=new BufferList,this._offset=0,this._header=null,this._stream=null,this._missing=0,this._longHeader=!1,this._callback=noop$4,this._locked=!1,this._finished=!1,this._pax=null,this._paxGlobal=null,this._gnuLongPath=null,this._gnuLongLinkPath=null,this._filenameEncoding=opts.filenameEncoding||"utf-8",this._allowUnknownFormat=!!opts.allowUnknownFormat,this._unlockBound=this._unlock.bind(this)}_unlock(err){if(this._locked=!1,err)return this.destroy(err),void this._continueWrite(err);this._update()}_consumeHeader(){if(this._locked)return!1;this._offset=this._buffer.shifted;try{this._header=headers$1.decode(this._buffer.shift(512),this._filenameEncoding,this._allowUnknownFormat)}catch(err){return this._continueWrite(err),!1}if(!this._header)return!0;switch(this._header.type){case"gnu-long-path":case"gnu-long-link-path":case"pax-global-header":case"pax-header":return this._longHeader=!0,this._missing=this._header.size,!0}return this._locked=!0,this._applyLongHeaders(),0===this._header.size||"directory"===this._header.type?(this.emit("entry",this._header,this._createStream(),this._unlockBound),!0):(this._stream=this._createStream(),this._missing=this._header.size,this.emit("entry",this._header,this._stream,this._unlockBound),!0)}_applyLongHeaders(){this._gnuLongPath&&(this._header.name=this._gnuLongPath,this._gnuLongPath=null),this._gnuLongLinkPath&&(this._header.linkname=this._gnuLongLinkPath,this._gnuLongLinkPath=null),this._pax&&(this._pax.path&&(this._header.name=this._pax.path),this._pax.linkpath&&(this._header.linkname=this._pax.linkpath),this._pax.size&&(this._header.size=parseInt(this._pax.size,10)),this._header.pax=this._pax,this._pax=null)}_decodeLongHeader(buf){switch(this._header.type){case"gnu-long-path":this._gnuLongPath=headers$1.decodeLongPath(buf,this._filenameEncoding);break;case"gnu-long-link-path":this._gnuLongLinkPath=headers$1.decodeLongPath(buf,this._filenameEncoding);break;case"pax-global-header":this._paxGlobal=headers$1.decodePax(buf);break;case"pax-header":this._pax=null===this._paxGlobal?headers$1.decodePax(buf):Object.assign({},this._paxGlobal,headers$1.decodePax(buf))}}_consumeLongHeader(){this._longHeader=!1,this._missing=overflow$1(this._header.size);const buf=this._buffer.shift(this._header.size);try{this._decodeLongHeader(buf)}catch(err){return this._continueWrite(err),!1}return!0}_consumeStream(){const buf=this._buffer.shiftFirst(this._missing);if(null===buf)return!1;this._missing-=buf.byteLength;const drained=this._stream.push(buf);return 0===this._missing?(this._stream.push(null),drained&&this._stream._detach(),drained&&!1===this._locked):drained}_createStream(){return new Source(this,this._header,this._offset)}_update(){for(;this._buffer.buffered>0&&!this.destroying;)if(this._missing>0){if(null!==this._stream){if(!1===this._consumeStream())return;continue}if(!0===this._longHeader){if(this._missing>this._buffer.buffered)break;if(!1===this._consumeLongHeader())return!1;continue}const ignore=this._buffer.shiftFirst(this._missing);null!==ignore&&(this._missing-=ignore.byteLength)}else{if(this._buffer.buffered<512)break;if(null!==this._stream||!1===this._consumeHeader())return}this._continueWrite(null)}_continueWrite(err){const cb=this._callback;this._callback=noop$4,cb(err)}_write(data,cb){this._callback=cb,this._buffer.push(data),this._update()}_final(cb){this._finished=0===this._missing&&0===this._buffer.buffered,cb(this._finished?null:new Error("Unexpected end of data"))}_predestroy(){this._continueWrite(null)}_destroy(cb){this._stream&&this._stream.destroy(getStreamError$1(this)),cb(null)}[Symbol.asyncIterator](){let error=null,promiseResolve=null,promiseReject=null,entryStream=null,entryCallback=null;const extract=this;return this.on("entry",(function onentry(header,stream,callback){// no way around this due to tick sillyness
entryCallback=callback,stream.on("error",noop$4),promiseResolve?(promiseResolve({value:stream,done:!1}),promiseResolve=promiseReject=null):entryStream=stream})),this.on("error",(err=>{error=err})),this.on("close",(function onclose(){if(consumeCallback(error),!promiseResolve)return;error?promiseReject(error):promiseResolve({value:void 0,done:!0});promiseResolve=promiseReject=null})),{[Symbol.asyncIterator](){return this},next(){return new Promise(onnext)},return(){return destroy(null)},throw(err){return destroy(err)}};function consumeCallback(err){if(!entryCallback)return;const cb=entryCallback;entryCallback=null,cb(err)}function onnext(resolve,reject){return error?reject(error):entryStream?(resolve({value:entryStream,done:!1}),void(entryStream=null)):(promiseResolve=resolve,promiseReject=reject,consumeCallback(null),void(extract._finished&&promiseResolve&&(promiseResolve({value:void 0,done:!0}),promiseResolve=promiseReject=null)))}function destroy(err){return extract.destroy(err),consumeCallback(err),new Promise(((resolve,reject)=>{if(extract.destroyed)return resolve({value:void 0,done:!0});extract.once("close",(function(){err?reject(err):resolve({value:void 0,done:!0})}))}))}}}function noop$4(){}function overflow$1(size){return(size&=511)&&512-size}var constants$2={exports:{}};const constants$1={// just for envs without fs
S_IFMT:61440,S_IFDIR:16384,S_IFCHR:8192,S_IFBLK:24576,S_IFIFO:4096,S_IFLNK:40960};try{constants$2.exports=require("fs").constants||constants$1}catch{constants$2.exports=constants$1}const{Readable:Readable,Writable:Writable,getStreamError:getStreamError}=streamx,b4a=b4a$5,constants=constants$2.exports,headers=headers$2,END_OF_TAR=b4a.alloc(1024);class Sink extends Writable{constructor(pack,header,callback){super({mapWritable:mapWritable,eagerOpen:!0}),this.written=0,this.header=header,this._callback=callback,this._linkname=null,this._isLinkname="symlink"===header.type&&!header.linkname,this._isVoid="file"!==header.type&&"contiguous-file"!==header.type,this._finished=!1,this._pack=pack,this._openCallback=null,null===this._pack._stream?this._pack._stream=this:this._pack._pending.push(this)}_open(cb){this._openCallback=cb,this._pack._stream===this&&this._continueOpen()}_continuePack(err){if(null===this._callback)return;const callback=this._callback;this._callback=null,callback(err)}_continueOpen(){null===this._pack._stream&&(this._pack._stream=this);const cb=this._openCallback;if(this._openCallback=null,null!==cb){if(this._pack.destroying)return cb(new Error("pack stream destroyed"));if(this._pack._finalized)return cb(new Error("pack stream is already finalized"));this._pack._stream=this,this._isLinkname||this._pack._encode(this.header),this._isVoid&&(this._finish(),this._continuePack(null)),cb(null)}}_write(data,cb){return this._isLinkname?(this._linkname=this._linkname?b4a.concat([this._linkname,data]):data,cb(null)):this._isVoid?data.byteLength>0?cb(new Error("No body allowed for this entry")):cb():(this.written+=data.byteLength,this._pack.push(data)?cb():void(this._pack._drain=cb))}_finish(){this._finished||(this._finished=!0,this._isLinkname&&(this.header.linkname=this._linkname?b4a.toString(this._linkname,"utf-8"):"",this._pack._encode(this.header)),overflow(this._pack,this.header.size),this._pack._done(this))}_final(cb){if(this.written!==this.header.size)// corrupting tar
return cb(new Error("Size mismatch"));this._finish(),cb(null)}_getError(){return getStreamError(this)||new Error("tar entry destroyed")}_predestroy(){this._pack.destroy(this._getError())}_destroy(cb){this._pack._done(this),this._continuePack(this._finished?null:this._getError()),cb()}}class Pack extends Readable{constructor(opts){super(opts),this._drain=noop$3,this._finalized=!1,this._finalizing=!1,this._pending=[],this._stream=null}entry(header,buffer,callback){if(this._finalized||this.destroying)throw new Error("already finalized or destroyed");"function"==typeof buffer&&(callback=buffer,buffer=null),callback||(callback=noop$3),header.size&&"symlink"!==header.type||(header.size=0),header.type||(header.type=function modeToType(mode){switch(mode&constants.S_IFMT){case constants.S_IFBLK:return"block-device";case constants.S_IFCHR:return"character-device";case constants.S_IFDIR:return"directory";case constants.S_IFIFO:return"fifo";case constants.S_IFLNK:return"symlink"}return"file"}(header.mode)),header.mode||(header.mode="directory"===header.type?493:420),header.uid||(header.uid=0),header.gid||(header.gid=0),header.mtime||(header.mtime=new Date),"string"==typeof buffer&&(buffer=b4a.from(buffer));const sink=new Sink(this,header,callback);return b4a.isBuffer(buffer)?(header.size=buffer.byteLength,sink.write(buffer),sink.end(),sink):(sink._isVoid,sink)}finalize(){this._stream||this._pending.length>0?this._finalizing=!0:this._finalized||(this._finalized=!0,this.push(END_OF_TAR),this.push(null))}_done(stream){stream===this._stream&&(this._stream=null,this._finalizing&&this.finalize(),this._pending.length&&this._pending.shift()._continueOpen())}_encode(header){if(!header.pax){const buf=headers.encode(header);if(buf)return void this.push(buf)}this._encodePax(header)}_encodePax(header){const paxHeader=headers.encodePax({name:header.name,linkname:header.linkname,pax:header.pax}),newHeader={name:"PaxHeader",mode:header.mode,uid:header.uid,gid:header.gid,size:paxHeader.byteLength,mtime:header.mtime,type:"pax-header",linkname:header.linkname&&"PaxHeader",uname:header.uname,gname:header.gname,devmajor:header.devmajor,devminor:header.devminor};this.push(headers.encode(newHeader)),this.push(paxHeader),overflow(this,paxHeader.byteLength),newHeader.size=header.size,newHeader.type=header.type,this.push(headers.encode(newHeader))}_doDrain(){const drain=this._drain;this._drain=noop$3,drain()}_predestroy(){const err=getStreamError(this);for(this._stream&&this._stream.destroy(err);this._pending.length;){const stream=this._pending.shift();stream.destroy(err),stream._continueOpen()}this._doDrain()}_read(cb){this._doDrain(),cb()}}function noop$3(){}function overflow(self,size){(size&=511)&&self.push(END_OF_TAR.subarray(0,512-size))}function mapWritable(buf){return b4a.isBuffer(buf)?buf:b4a.from(buf)}tarStream.extract=function extract(opts){return new Extract(opts)},tarStream.pack=function pack(opts){return new Pack(opts)};var once$3={exports:{}},wrappy_1=function wrappy$1(fn,cb){if(fn&&cb)return wrappy$1(fn)(cb);if("function"!=typeof fn)throw new TypeError("need wrapper function");return Object.keys(fn).forEach((function(k){wrapper[k]=fn[k]})),wrapper;function wrapper(){for(var args=new Array(arguments.length),i=0;i<args.length;i++)args[i]=arguments[i];var ret=fn.apply(this,args),cb=args[args.length-1];return"function"==typeof ret&&ret!==cb&&Object.keys(cb).forEach((function(k){ret[k]=cb[k]})),ret}};
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy=wrappy_1;function once$2(fn){var f=function(){return f.called?f.value:(f.called=!0,f.value=fn.apply(this,arguments))};return f.called=!1,f}function onceStrict(fn){var f=function(){if(f.called)throw new Error(f.onceError);return f.called=!0,f.value=fn.apply(this,arguments)},name=fn.name||"Function wrapped with `once`";return f.onceError=name+" shouldn't be called more than once",f.called=!1,f}once$3.exports=wrappy(once$2),once$3.exports.strict=wrappy(onceStrict),once$2.proto=once$2((function(){Object.defineProperty(Function.prototype,"once",{value:function(){return once$2(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return onceStrict(this)},configurable:!0})}));var fs$1,once$1=once$3.exports,noop$2=function(){},qnt=commonjsGlobal.Bare?queueMicrotask:process.nextTick.bind(process),eos$1=function(stream,opts,callback){if("function"==typeof opts)return eos$1(stream,null,opts);opts||(opts={}),callback=once$1(callback||noop$2);var ws=stream._writableState,rs=stream._readableState,readable=opts.readable||!1!==opts.readable&&stream.readable,writable=opts.writable||!1!==opts.writable&&stream.writable,cancelled=!1,onlegacyfinish=function(){stream.writable||onfinish()},onfinish=function(){writable=!1,readable||callback.call(stream)},onend=function(){readable=!1,writable||callback.call(stream)},onexit=function(exitCode){callback.call(stream,exitCode?new Error("exited with error code: "+exitCode):null)},onerror=function(err){callback.call(stream,err)},onclose=function(){qnt(onclosenexttick)},onclosenexttick=function(){if(!cancelled)return(!readable||rs&&rs.ended&&!rs.destroyed)&&(!writable||ws&&ws.ended&&!ws.destroyed)?void 0:callback.call(stream,new Error("premature close"))},onrequest=function(){stream.req.on("finish",onfinish)};return!function(stream){return stream.setHeader&&"function"==typeof stream.abort}(stream)?writable&&!ws&&(// legacy streams
stream.on("end",onlegacyfinish),stream.on("close",onlegacyfinish)):(stream.on("complete",onfinish),stream.on("abort",onclose),stream.req?onrequest():stream.on("request",onrequest)),function(stream){return stream.stdio&&Array.isArray(stream.stdio)&&3===stream.stdio.length}(stream)&&stream.on("exit",onexit),stream.on("end",onend),stream.on("finish",onfinish),!1!==opts.error&&stream.on("error",onerror),stream.on("close",onclose),function(){cancelled=!0,stream.removeListener("complete",onfinish),stream.removeListener("abort",onclose),stream.removeListener("request",onrequest),stream.req&&stream.req.removeListener("finish",onfinish),stream.removeListener("end",onlegacyfinish),stream.removeListener("close",onlegacyfinish),stream.removeListener("finish",onfinish),stream.removeListener("exit",onexit),stream.removeListener("end",onend),stream.removeListener("error",onerror),stream.removeListener("close",onclose)}},endOfStream=eos$1,once=once$3.exports,eos=endOfStream;try{fs$1=require("fs");// we only need fs to get the ReadStream and WriteStream prototypes
}catch(e){}var noop$1=function(){},ancient="undefined"!=typeof process&&/^v?\.0/.test(process.version),isFn=function(fn){return"function"==typeof fn},destroyer=function(stream,reading,writing,callback){callback=once(callback);var closed=!1;stream.on("close",(function(){closed=!0})),eos(stream,{readable:reading,writable:writing},(function(err){if(err)return callback(err);closed=!0,callback()}));var destroyed=!1;return function(err){if(!closed&&!destroyed)return destroyed=!0,function(stream){return!!ancient&&!!fs$1&&(stream instanceof(fs$1.ReadStream||noop$1)||stream instanceof(fs$1.WriteStream||noop$1))&&isFn(stream.close);// newer node version do not need to care about fs is a special way
}(stream)?stream.close(noop$1):// use close for fs streams to avoid fd leaks
function(stream){return stream.setHeader&&isFn(stream.abort)}(stream)?stream.abort():// request.destroy just do .end - .abort is what we want
isFn(stream.destroy)?stream.destroy():void callback(err||new Error("stream was destroyed"))}},call=function(fn){fn()},pipe=function(from,to){return from.pipe(to)};const tar=tarStream,pump=function(){var error,streams=Array.prototype.slice.call(arguments),callback=isFn(streams[streams.length-1]||noop$1)&&streams.pop()||noop$1;if(Array.isArray(streams[0])&&(streams=streams[0]),streams.length<2)throw new Error("pump requires two streams per minimum");var destroys=streams.map((function(stream,i){var reading=i<streams.length-1;return destroyer(stream,reading,i>0,(function(err){error||(error=err),err&&destroys.forEach(call),reading||(destroys.forEach(call),callback(error))}))}));return streams.reduce(pipe)},fs=require$$2$1,path=require$$3$1,win32="win32"===(commonjsGlobal.Bare?commonjsGlobal.Bare.platform:process.platform);var extract=function extract(cwd,opts){cwd||(cwd="."),opts||(opts={}),cwd=path.resolve(cwd);const xfs=opts.fs||fs,ignore=opts.ignore||opts.filter||noop,mapStream=opts.mapStream||echo,own=!1!==opts.chown&&!win32&&0===function processGetuid(){return!commonjsGlobal.Bare&&process.getuid?process.getuid():-1}(),extract=opts.extract||tar.extract(),stack=[],now=new Date,umask="number"==typeof opts.umask?~opts.umask:~function processUmask(){return!commonjsGlobal.Bare&&process.umask?process.umask():0}(),strict=!1!==opts.strict,validateSymLinks=!1!==opts.validateSymlinks;let map=opts.map||noop,dmode="number"==typeof opts.dmode?opts.dmode:0,fmode="number"==typeof opts.fmode?opts.fmode:0;return opts.strip&&(map=function strip(map,level){return function(header){header.name=header.name.split("/").slice(level).join("/");const linkname=header.linkname;return linkname&&("link"===header.type||path.isAbsolute(linkname))&&(header.linkname=linkname.split("/").slice(level).join("/")),map(header)}}
/**
 * Creates a symlink to a file
 */(map,opts.strip)),opts.readable&&(dmode|=parseInt(555,8),fmode|=parseInt(444,8)),opts.writable&&(dmode|=parseInt(333,8),fmode|=parseInt(222,8)),extract.on("entry",(function onentry(header,stream,next){(header=map(header)||header).name=function normalize(name){return win32?name.replace(/\\/g,"/").replace(/[:?<>|]/g,"_"):name}(header.name);const name=path.join(cwd,path.join("/",header.name));if(ignore(name,header))return stream.resume(),next();const dir=path.join(name,".")===path.join(cwd,".")?cwd:path.dirname(name);function stat(err){if(err)return next(err);!function utimes(name,header,cb){if(!1===opts.utimes)return cb();if("directory"===header.type)return xfs.utimes(name,now,header.mtime,cb);if("symlink"===header.type)return utimesParent(name,cb);// TODO: how to set mtime on link?
xfs.utimes(name,now,header.mtime,(function(err){if(err)return cb(err);utimesParent(name,cb)}))}(name,header,(function(err){return err?next(err):win32?next():void chperm(name,header,next)}))}function inCwd(dst){return dst.startsWith(cwd)}function onfile(){const ws=xfs.createWriteStream(name),rs=mapStream(stream,header);ws.on("error",(function(err){// always forward errors on destroy
rs.destroy(err)})),pump(rs,ws,(function(err){if(err)return next(err);ws.on("close",stat)}))}validate(xfs,dir,path.join(cwd,"."),(function(err,valid){return err?next(err):valid?"directory"===header.type?(stack.push([name,header.mtime]),mkdirfix(name,{fs:xfs,own:own,uid:header.uid,gid:header.gid,mode:header.mode},stat)):void mkdirfix(dir,{fs:xfs,own:own,uid:header.uid,gid:header.gid,
// normally, the folders with rights and owner should be part of the TAR file
// if this is not the case, create folder for same user as file and with
// standard permissions of 0o755 (rwxr-xr-x)
mode:493},(function(err){if(err)return next(err);switch(header.type){case"file":return onfile();case"link":return function onlink(){if(win32)return next();// skip links on win for now before it can be tested
xfs.unlink(name,(function(){const link=path.join(cwd,path.join("/",header.linkname));fs.realpath(link,(function(err,dst){if(err||!inCwd(dst))return next(new Error(name+" is not a valid hardlink"));xfs.link(dst,name,(function(err){if(err&&"EPERM"===err.code&&opts.hardlinkAsFilesFallback)return stream=xfs.createReadStream(dst),onfile();stat(err)}))}))}))}();case"symlink":return function onsymlink(){if(win32)return next();// skip symlinks on win for now before it can be tested
xfs.unlink(name,(function(){if(!inCwd(path.resolve(path.dirname(name),header.linkname))&&validateSymLinks)return next(new Error(name+" is not a valid symlink"));xfs.symlink(header.linkname,name,stat)}))}()}if(strict)return next(new Error("unsupported type for "+name+" ("+header.type+")"));stream.resume(),next()})):next(new Error(dir+" is not a valid path"))}))})),opts.finish&&extract.on("finish",opts.finish),extract;function utimesParent(name,cb){// we just set the mtime on the parent dir again everytime we write an entry
let top;for(;(top=(list=stack).length?list[list.length-1]:null)&&name.slice(0,top[0].length)!==top[0];)stack.pop();var list;if(!top)return cb();xfs.utimes(top[0],now,top[1],cb)}function chperm(name,header,cb){const link="symlink"===header.type,chmod=link?xfs.lchmod:xfs.chmod,chown=link?xfs.lchown:xfs.chown;
/* eslint-disable n/no-deprecated-api */
/* eslint-enable n/no-deprecated-api */
if(!chmod)return cb();const mode=(header.mode|("directory"===header.type?dmode:fmode))&umask;function onchown(err){return err?cb(err):chmod?void chmod.call(xfs,name,mode,cb):cb()}chown&&own?chown.call(xfs,name,header.uid,header.gid,onchown):onchown(null)}function mkdirfix(name,opts,cb){
// when mkdir is called on an existing directory, the permissions
// will be overwritten (?), to avoid this we check for its existance first
xfs.stat(name,(function(err){return err?"ENOENT"!==err.code?cb(err):void xfs.mkdir(name,{mode:opts.mode,recursive:!0},(function(err,made){if(err)return cb(err);chperm(name,opts,cb)})):cb(null)}))}};function validate(fs,name,root,cb){if(name===root)return cb(null,!0);fs.lstat(name,(function(err,st){return err&&"ENOENT"!==err.code&&"EPERM"!==err.code?cb(err):err||st.isDirectory()?validate(fs,path.join(name,".."),root,cb):void cb(null,!1)}))}function noop(){}function echo(name){return name}const isRunningInAmazonLinux2023=nodeMajorVersion=>{const awsExecEnv=process.env.AWS_EXECUTION_ENV??"",awsLambdaJsRuntime=process.env.AWS_LAMBDA_JS_RUNTIME??"",codebuildImage=process.env.CODEBUILD_BUILD_IMAGE??"";
// Check for explicit version substrings, returns on first match
return!!(awsExecEnv.includes("20.x")||awsExecEnv.includes("22.x")||awsLambdaJsRuntime.includes("20.x")||awsLambdaJsRuntime.includes("22.x")||codebuildImage.includes("nodejs20")||codebuildImage.includes("nodejs22"))||!!(process.env.VERCEL&&nodeMajorVersion>=20);
// Vercel: Node 20+ is AL2023 compatible
// eslint-disable-next-line sonarjs/prefer-single-boolean-return
},inflate=filePath=>{
// Determine the output path based on the file type
const output=filePath.includes("swiftshader")?tmpdir():join(tmpdir(),basename(filePath).replace(/\.(?:t(?:ar(?:\.(?:br|gz))?|br|gz)|br|gz)$/i,""));return new Promise(((resolve,reject)=>{
// Quick return if the file is already decompressed
if(filePath.includes("swiftshader")){if(existsSync(`${output}/libGLESv2.so`))return void resolve(output)}else if(existsSync(output))return void resolve(output);
// Optimize chunk size based on file type - use smaller chunks for better memory usage
// Brotli files tend to decompress to much larger sizes
const isBrotli=/br$/i.test(filePath),isGzip=/gz$/i.test(filePath),isTar=/\.t(?:ar(?:\.(?:br|gz))?|br|gz)$/i.test(filePath),source=createReadStream(filePath,{highWaterMark:2**22});let target;
// Setup error handlers first for both streams
const handleError=error=>{reject(error)};
// Pipe through the appropriate decompressor if needed
if(source.once("error",handleError),
// Setup the appropriate target stream based on file type
isTar?(target=extract(output),target.once("finish",(()=>{resolve(output)}))):(target=createWriteStream(output,{mode:448}),target.once("close",(()=>{resolve(output)}))),target.once("error",handleError),isBrotli||isGzip){
// Use optimized chunk size for decompression
// 2MB (2**21) is sufficient for most brotli/gzip files
const decompressor=isBrotli?createBrotliDecompress({chunkSize:2**21}):createUnzip({chunkSize:2**21});
// Handle decompressor errors
decompressor.once("error",handleError),
// Chain the streams
source.pipe(decompressor).pipe(target)}else source.pipe(target)}))};
/**
 * Downloads a file from a URL
 */const nodeMajorVersion=Number.parseInt(process.versions.node.split(".")[0]??"");
// Setup the lambda environment
var baseLibPath;isRunningInAmazonLinux2023(nodeMajorVersion)&&(baseLibPath=join(tmpdir(),"al2023","lib"),
// If the FONTCONFIG_PATH is not set, set it to /tmp/fonts
process.env.FONTCONFIG_PATH??=join(tmpdir(),"fonts"),
// Set up Home folder if not already set
process.env.HOME??=tmpdir(),
// If LD_LIBRARY_PATH is undefined, set it to baseLibPath, otherwise, add it
void 0===process.env.LD_LIBRARY_PATH?process.env.LD_LIBRARY_PATH=baseLibPath:process.env.LD_LIBRARY_PATH.startsWith(baseLibPath)||(process.env.LD_LIBRARY_PATH=[baseLibPath,...new Set(process.env.LD_LIBRARY_PATH.split(":"))].join(":")));
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Chromium{
/**
     * Returns a list of additional Chromium flags recommended for serverless environments.
     * The canonical list of flags can be found on https://peter.sh/experiments/chromium-command-line-switches/.
     * Most of below can be found here: https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
     */
static get args(){const graphicsFlags=["--ignore-gpu-blocklist",// https://source.chromium.org/search?q=lang:cpp+symbol:kIgnoreGpuBlocklist&ss=chromium
"--in-process-gpu"];
// https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md
this.graphics?graphicsFlags.push(
// As the unsafe WebGL fallback, SwANGLE (ANGLE + SwiftShader Vulkan)
"--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"):graphicsFlags.push("--disable-webgl");return["--ash-no-nudges",// Avoids blue bubble "user education" nudges (eg., "… give your browser a new look", Memory Saver)
"--disable-domain-reliability",// Disables Domain Reliability Monitoring, which tracks whether the browser has difficulty contacting Google-owned sites and uploads reports to Google.
"--disable-print-preview",// https://source.chromium.org/search?q=lang:cpp+symbol:kDisablePrintPreview&ss=chromium
"--disk-cache-size=33554432",// https://source.chromium.org/search?q=lang:cpp+symbol:kDiskCacheSize&ss=chromium Forces the maximum disk space to be used by the disk cache, in bytes.
"--no-default-browser-check",// Disable the default browser check, do not prompt to set it as such. (This is already set by Playwright, but not Puppeteer)
"--no-pings",// Don't send hyperlink auditing pings
"--single-process",// Runs the renderer and plugins in the same process as the browser. NOTES: Needs to be single-process to avoid `prctl(PR_SET_NO_NEW_PRIVS) failed` error
"--font-render-hinting=none",`--disable-features=${["AudioServiceOutOfProcess","IsolateOrigins","site-per-process"].join(",")}`,`--enable-features=${["SharedArrayBuffer"].join(",")}`,...graphicsFlags,"--allow-running-insecure-content",// https://source.chromium.org/search?q=lang:cpp+symbol:kAllowRunningInsecureContent&ss=chromium
"--disable-setuid-sandbox",// Lambda runs as root, so this is required to allow Chromium to run as root
"--disable-site-isolation-trials",// https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSiteIsolation&ss=chromium
"--disable-web-security","--headless='shell'",// We only support running chrome-headless-shell
"--no-sandbox",// https://source.chromium.org/search?q=lang:cpp+symbol:kNoSandbox&ss=chromium
"--no-zygote"]}
/**
     * Returns whether the graphics stack is enabled or disabled
     * @returns boolean
     */static get graphics(){return this.graphicsMode}
/**
     * Sets whether the graphics stack is enabled or disabled.
     * @param true means the stack is enabled. WebGL will work.
     * @param false means that the stack is disabled. WebGL will not work.
     * @default true
     */static set setGraphicsMode(value){if("boolean"!=typeof value)throw new TypeError(`Graphics mode must be a boolean, you entered '${String(value)}'`);this.graphicsMode=value}
/**
     * If true, the graphics stack and webgl is enabled,
     * If false, webgl will be disabled.
     * (If false, the swiftshader.tar.br file will also not extract)
     */static graphicsMode=!0;
/**
     * Inflates the included version of Chromium
     * @param input The location of the `bin` folder
     * @returns The path to the `chromium` binary
     */
static async executablePath(input){
/**
         * If the `chromium` binary already exists in /tmp/chromium, return it.
         */
if(existsSync(join(tmpdir(),"chromium")))return join(tmpdir(),"chromium");
/**
         * If input is a valid URL, download and extract the file. It will extract to /tmp/chromium-pack
         * and executablePath will be recursively called on that location, which will then extract
         * the brotli files to the correct locations
         */if(input&&(input=>{try{return Boolean(new URL(input))}catch{return!1}})(input))return this.executablePath(await(async url=>{
// Increase the max body length to 60MB for larger files
new URL(url).maxBodyLength=62914560;const destDir=join(tmpdir(),"chromium-pack");return new Promise(((resolve,reject)=>{const extractObj=extract(destDir),cleanupOnError=err=>{rm(destDir,{force:!0,recursive:!0},(()=>{reject(err)}))};
// Setup error handlers for better cleanup
/* c8 ignore next 5 */
// Attach error handler to extract stream
extractObj.once("error",cleanupOnError),
// Handle extraction completion
extractObj.once("finish",(()=>{resolve(destDir)}));const req=fr.https.get(url,(response=>{
/* c8 ignore next */
200===response.statusCode?(
// Pipe the response directly to the extraction stream
response.pipe(extractObj),
// Handle response errors
response.once("error",cleanupOnError)):
/* c8 ignore next 9 */
reject(new Error(`Unexpected status code: ${response.statusCode?.toFixed(0)??"UNK"}.`))}));
// Handle request errors
req.once("error",cleanupOnError),
// Set a timeout to avoid hanging requests
req.setTimeout(6e4,(()=>{
/* c8 ignore next 2 */
req.destroy(),cleanupOnError(new Error("Request timeout"))}))}))})(input));
/**
         * If input is defined, use that as the location of the brotli files,
         * otherwise, the default location is ../../bin.
         * A custom location is needed for workflows that using custom packaging.
         */
/**
         * If the input directory doesn't exist, throw an error.
         */
if(input??=
/**
 * Get the bin directory path for ESM modules
 */
function getBinPath(){return join(dirname(fileURLToPath(import.meta.url)),"..","..","bin")}(),!existsSync(input))throw new Error(`The input directory "${input}" does not exist. Please provide the location of the brotli files.`);
// Extract the required files
const promises=[inflate(join(input,"chromium.br")),inflate(join(input,"fonts.tar.br")),inflate(join(input,"swiftshader.tar.br"))];isRunningInAmazonLinux2023(nodeMajorVersion)&&promises.push(inflate(join(input,"al2023.tar.br")));
// Await all extractions
// Returns the first result of the promise, which is the location of the `chromium` binary
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
return(await Promise.all(promises)).shift()}
/**
     * Downloads or symlinks a custom font and returns its basename, patching the environment so that Chromium can find it.
     */static async font(input){const fontsDir=process.env.FONTCONFIG_PATH??join(process.env.HOME??tmpdir(),".fonts");
// Create fonts directory if it doesn't exist
existsSync(fontsDir)||mkdirSync(fontsDir),
// Convert local path to file URL if needed
/^https?:\/\//i.test(input)||(input=`file://${input}`);const url=new URL$2(input),fontName=url.pathname.split("/").pop();if(!fontName)throw new Error(`Invalid font name: ${url.pathname}`);const outputPath=`${fontsDir}/${fontName}`;
// Return font name if it already exists
if(existsSync(outputPath))return fontName;
// Handle local file
if("file:"===url.protocol)try{return await(source=url.pathname,target=outputPath,new Promise(((resolve,reject)=>{access(source,(error=>{error?reject(error):symlink(source,target,(error=>{
/* c8 ignore next */
error?
/* c8 ignore next 3 */
reject(error):resolve()}))}))}))),fontName}catch(error){throw new Error(`Failed to create symlink for font: ${JSON.stringify(error)}`)}else try{return await((url,outputPath)=>new Promise(((resolve,reject)=>{const stream=createWriteStream(outputPath);stream.once("error",reject),fr.https.get(url,(response=>{if(200!==response.statusCode)return stream.close(),void reject(new Error(
/* c8 ignore next 2 */
`Unexpected status code: ${response.statusCode?.toFixed(0)??"UNK"}.`));
// Pipe directly to file rather than manually writing chunks
// This is more efficient and uses less memory
response.pipe(stream),
// Listen for completion
stream.once("finish",(()=>{stream.close(),resolve()})),
// Handle response errors
response.once("error",(error=>{
/* c8 ignore next 2 */
stream.close(),reject(error)}))}))
/* c8 ignore next 3 */.on("error",(error=>{stream.close(),reject(error)}))})))(input,outputPath),fontName}catch(error){throw new Error(`Failed to download font: ${JSON.stringify(error)}`)}var source,target}}class APIError extends Error{
/**
   * Original error.
   * @type {?Error}
   * @default null
   */
/**
   * HTTP response.
   * @type {IncomingMessage}
   * @default null
   */
/**
   * Error message.
   * @param {string} message Message.
   */
constructor(message="Unknown error"){super(message),_defineProperty(this,"originalError",null),_defineProperty(this,"httpResponse",null)}
/**
   * Absorb error.
   * @param {Error} [error=null] Original error.
   * @param {?IncomingMessage} [httpResponse=null] HTTP response.
   * @returns {APIError}
   */static absorb(error,httpResponse=null){return Object.assign(new APIError(error.message),{originalError:error,httpResponse:httpResponse})}}
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
/**
 * Class used for interaction with nHentai API.
 * @class
 */
class API{
/**
   * API path class
   * @type {APIPath}
   * @static
   * @private
   */
/**
   * Hosts
   * @type {?nHentaiHosts}
   */
/**
   * Prefer HTTPS over HTTP.
   * @type {?boolean}
   */
/**
   * HTTP(S) agent.
   * @property {?httpAgent}
   */
/**
   * Cookies string.
   * @type {?string}
   */
/**
   * Use Puppeteer with stealth plugin instead of native HTTP requests.
   * @type {?boolean}
   */
/**
   * Additional arguments to pass to Puppeteer browser launch.
   * @type {?string[]}
   */
/**
   * Custom function to launch Puppeteer browser.
   * @type {?Function}
   */
/**
   * Applies provided options on top of defaults.
   * @param {?nHentaiOptions} [options={}] Options to apply.
   */
constructor(options={}){_defineProperty(this,"hosts",void 0),_defineProperty(this,"ssl",void 0),_defineProperty(this,"agent",void 0),_defineProperty(this,"cookies",void 0),_defineProperty(this,"usePuppeteer",void 0),_defineProperty(this,"browserArgs",void 0),_defineProperty(this,"puppeteerLaunch",void 0);let params=function processOptions({hosts:{api:api="nhentai.net",images:images=["i1.nhentai.net","i2.nhentai.net","i3.nhentai.net"],thumbs:thumbs=["t1.nhentai.net","t2.nhentai.net","t3.nhentai.net"]}={},ssl:ssl=!0,agent:agent=null,cookies:cookies=null,usePuppeteer:usePuppeteer=!1,browserArgs:browserArgs=[],puppeteerLaunch:puppeteerLaunch=null}={}){agent||(agent=ssl?Agent:Agent$1),"Function"===agent.constructor.name&&(agent=new agent);// Normalize hosts to arrays for consistent handling
const normalizeHosts=hostConfig=>"string"==typeof hostConfig?[hostConfig]:Array.isArray(hostConfig)?hostConfig:[hostConfig];return{hosts:{api:api,images:normalizeHosts(images),thumbs:normalizeHosts(thumbs)},ssl:ssl,agent:agent,cookies:cookies,usePuppeteer:usePuppeteer,browserArgs:browserArgs,puppeteerLaunch:puppeteerLaunch}}(options);Object.assign(this,params)}
/**
   * Get http(s) module depending on `options.ssl`.
   * @type {https|http}
   */get net(){return this.ssl?require$$2:require$$1}
/**
   * Select a host from an array of hosts using round-robin.
   * @param {string[]} hosts Array of hosts.
   * @param {string} [fallback] Fallback host if array is empty.
   * @returns {string} Selected host.
   * @private
   */selectHost(hosts,fallback="nhentai.net"){if(!Array.isArray(hosts)||0===hosts.length)return fallback;// Simple round-robin selection based on current time
return hosts[Math.floor(Math.random()*hosts.length)]}
/**
   * JSON get request.
   * @param {object} options      HTTP(S) request options.
   * @param {string} options.host Host.
   * @param {string} options.path Path.
   * @returns {Promise<object>} Parsed JSON.
   */request(options){
// Use Puppeteer if enabled
if(this.usePuppeteer)return this.requestWithPuppeteer(options);// Use native HTTP requests
let{net:net,agent:agent,cookies:cookies}=this;return new Promise(((resolve,reject)=>{const headers={"User-Agent":`nhentai-api-client/3.4.3 Node.js/${process.versions.node}`};// Add cookies if provided
cookies&&(headers.Cookie=cookies),Object.assign(options,{agent:agent,headers:headers}),net.get(options,(_response=>{const
/** @type {IncomingMessage}*/
response=_response,{statusCode:statusCode}=response,contentType=response.headers["content-type"];let error;if(200!==statusCode?error=new Error(`Request failed with status code ${statusCode}`):/^application\/json/.test(contentType)||(error=new Error(`Invalid content-type - expected application/json but received ${contentType}`)),error)return response.resume(),void reject(APIError.absorb(error,response));response.setEncoding("utf8");let rawData="";response.on("data",(chunk=>rawData+=chunk)),response.on("end",(()=>{try{resolve(JSON.parse(rawData))}catch(error){reject(APIError.absorb(error,response))}}))})).on("error",(error=>reject(APIError.absorb(error))))}))}
/**
   * JSON get request using Puppeteer with stealth plugin.
   * @param {object} options      HTTP(S) request options.
   * @param {string} options.host Host.
   * @param {string} options.path Path.
   * @returns {Promise<object>} Parsed JSON.
   * @private
   */async requestWithPuppeteer(options){let puppeteer,StealthPlugin;try{
// Dynamic import to avoid requiring puppeteer when not needed
puppeteer=await import("puppeteer-extra"),StealthPlugin=(await import("puppeteer-extra-plugin-stealth")).default}catch(error){throw new Error("Puppeteer dependencies not found. Please install puppeteer-extra and puppeteer-extra-plugin-stealth: npm install puppeteer-extra puppeteer-extra-plugin-stealth")}// Use stealth plugin
puppeteer.default.use(StealthPlugin());const url=`http${this.ssl?"s":""}://${options.host}${options.path}`;let browser;try{
// Launch browser with custom function or default configuration
// Use custom launch function
browser=this.puppeteerLaunch&&"function"==typeof this.puppeteerLaunch?await this.puppeteerLaunch():await puppeteer.default.launch({args:Chromium.args.concat(this.browserArgs||[]),defaultViewport:Chromium.defaultViewport,executablePath:await Chromium.executablePath(),headless:Chromium.headless});const page=await browser.newPage();// Set user agent
// Set cookies if provided
if(await page.setUserAgent(`nhentai-api-client/3.4.3 Node.js/${process.versions.node}`),this.cookies){const cookies=this.cookies.split(";").map((cookieStr=>{const[name,value]=cookieStr.trim().split("=");return{name:name.trim(),value:value?value.trim():"",domain:options.host}}));await page.setCookie(...cookies)}// Check if this is a redirect endpoint (like /random/)
if(options.path.includes("/random")){
// For redirect endpoints, we need to intercept the redirect response
let redirectResponse=null;page.on("response",(response=>{302===response.status()&&response.url()===url&&(redirectResponse=response)})),// Navigate without following redirects
await page.setRequestInterception(!0),page.on("request",(request=>{request.continue()}));try{await page.goto(url,{waitUntil:"networkidle0",timeout:3e4})}catch(error){// Expected for redirect endpoints
}if(redirectResponse){
// Simulate the error that the traditional method expects
const mockError=new Error(`Request failed with status code ${redirectResponse.status()}`);throw mockError.httpResponse={statusCode:redirectResponse.status(),headers:{location:redirectResponse.headers().location}},APIError.absorb(mockError,mockError.httpResponse)}throw new Error("Expected redirect response not found")}{
// Set request headers to get JSON response for API endpoints
await page.setExtraHTTPHeaders({Accept:"application/json, text/plain, */*","Content-Type":"application/json"});// Navigate to the URL and get the response
const response=await page.goto(url,{waitUntil:"networkidle0",timeout:3e4});if(!response.ok())throw new Error(`Request failed with status code ${response.status()}`);// Get the response text directly from the response
const responseText=await response.text();if((response.headers()["content-type"]||"").includes("application/json"))
// Direct JSON response
try{return JSON.parse(responseText)}catch(parseError){throw new Error(`Invalid JSON response: ${parseError.message}`)}else{
// HTML response - try to extract JSON from page content
const jsonMatch=(await page.content()).match(/<pre[^>]*>(.*?)<\/pre>/s);let jsonText;
// Extract JSON from <pre> tag (common for API responses)
jsonText=jsonMatch?jsonMatch[1].trim():await page.evaluate((()=>{
// Try to find JSON in the page
// eslint-disable-next-line no-undef
const preElement=document.querySelector("pre");return preElement?preElement.textContent:document.body.textContent;// If no pre element, return the whole body text
// eslint-disable-next-line no-undef
}));try{return JSON.parse(jsonText)}catch(parseError){throw new Error(`Invalid JSON response: ${parseError.message}. Response content: ${jsonText?.substring(0,200)}...`)}}}}finally{browser&&await browser.close()}}
/**
   * Get API arguments.
   * This is internal method.
   * @param {string} hostType Host type.
   * @param {string} api      Endpoint type.
   * @returns {APIArgs} API arguments.
   * @private
   */getAPIArgs(hostType,api){let{hosts:{[hostType]:hostConfig},constructor:{APIPath:{[api]:apiPath}}}=this;// Select host from array or use single host
return{host:Array.isArray(hostConfig)?this.selectHost(hostConfig,hostConfig[0]):hostConfig,apiPath:apiPath}}
/**
   * Search by query.
   * @param {string}          query     Query.
   * @param {?number}         [page=1]  Page ID.
   * @param {?SearchSortMode} [sort=''] Search sort mode.
   * @returns {Promise<Search>} Search instance.
   * @async
   */async search(query,page=1,sort=""){let{host:host,apiPath:apiPath}=this.getAPIArgs("api","search"),search=Search.parse(await this.request({host:host,path:apiPath(query,page,sort)}));return Object.assign(search,{api:this,query:query,page:page,sort:sort}),search}
/**
   * Search by query.
   * @param {string}          query     Query.
   * @param {?number}         [page=1]  Starting page ID.
   * @param {?SearchSortMode} [sort=''] Search sort mode.
   * @yields {Search} Search instance.
   * @async
   * @returns {AsyncGenerator<Search, Search, Search>}
   */async*searchGenerator(query,page=1,sort=""){let search=await this.search(query,page,sort);for(;search.page<=search.pages;)yield search,search=await this.search(query,search.page+1,sort)}
/**
   * Search related books.
   * @param {number|Book} book Book instance or Book ID.
   * @returns {Promise<Search>} Search instance.
   * @async
   */async searchAlike(book){let{host:host,apiPath:apiPath}=this.getAPIArgs("api","searchAlike");return Search.parse(await this.request({host:host,path:apiPath(book instanceof Book?book.id:+book)}))}
/**
   * Search by tag id.
   * @param {number|Tag}      tag       Tag or Tag ID.
   * @param {?number}         [page=1]  Page ID.
   * @param {?SearchSortMode} [sort=''] Search sort mode.
   * @returns {Promise<Search>} Search instance.
   * @async
   */async searchTagged(tag,page=1,sort=""){tag instanceof Tag||(tag=Tag.get({id:+tag}));let{host:host,apiPath:apiPath}=this.getAPIArgs("api","searchTagged"),search=Search.parse(await this.request({host:host,path:apiPath(tag.id,page,sort)}));return Object.assign(search,{api:this,query:tag,page:page,sort:sort}),search}
/**
   * Get book by id.
   * @param {number} bookID Book ID.
   * @returns {Promise<Book>} Book instance.
   * @async
   */async getBook(bookID){let{host:host,apiPath:apiPath}=this.getAPIArgs("api","book");return Book.parse(await this.request({host:host,path:apiPath(bookID)}))}
/**
   * Get random book.
   * @returns {Promise<Book>} Book instance.
   * @async
   */async getRandomBook(){let{host:host,apiPath:apiPath}=this.getAPIArgs("api","randomBookRedirect");try{await this.request({host:host,path:apiPath()});// Will always throw
}catch(error){if(!(error instanceof APIError))throw error;const response=error.httpResponse;if(!response||302!==response.statusCode)throw error;const id=+(/\d+/.exec(response.headers.location)||{})[0];if(isNaN(id))throw APIError.absorb(new Error("Bad redirect"),response);return await this.getBook(id)}}
/**
   * Detect the actual cover filename extension for nhentai's double extension format.
   * @param {Image} image Cover image.
   * @returns {string} The actual extension to use in the URL.
   * @private
   */detectCoverExtension(image){const reportedExtension=image.type.extension;// Handle WebP cases - both simple and double extension formats
if("webp"===reportedExtension){// Media IDs above ~3000000 seem to use cover.webp.webp format
// This is a heuristic that may need adjustment based on more data
return image.book.media>3e6?"webp.webp":"webp";// Default to simple webp for older uploads
}// For non-webp extensions, nhentai often serves double extensions
// The pattern is: cover.{original_extension}.webp
// We need to detect what the original extension should be
// Map API type codes to likely intermediate extensions
const intermediateExt={jpg:"jpg",
// API reports 'j' -> likely cover.jpg.webp
jpeg:"jpg",
// API reports 'jpeg' -> likely cover.jpg.webp
png:"png",
// API reports 'p' -> likely cover.png.webp
gif:"gif"}[reportedExtension];return intermediateExt?`${intermediateExt}.webp`:reportedExtension;// Fallback to reported extension if we can't map it
}
/**
   * Get image URL.
   * @param {Image} image Image.
   * @returns {string} Image URL.
   */getImageURL(image){if(image instanceof Image){let extension,{host:host,apiPath:apiPath}=image.isCover?this.getAPIArgs("thumbs","bookCover"):this.getAPIArgs("images","bookPage");// Handle cover images with potential double extensions
return extension=image.isCover?this.detectCoverExtension(image):image.type.extension,`http${this.ssl?"s":""}://${host}`+(image.isCover?apiPath(image.book.media,extension):apiPath(image.book.media,image.id,extension))}throw new Error("image must be Image instance.")}
/**
   * Get image URL with original extension (fallback for when double extension fails).
   * @param {Image} image Image.
   * @returns {string} Image URL with original extension.
   */getImageURLOriginal(image){if(image instanceof Image){let{host:host,apiPath:apiPath}=image.isCover?this.getAPIArgs("thumbs","bookCover"):this.getAPIArgs("images","bookPage");// Always use the original extension reported by the API
return`http${this.ssl?"s":""}://${host}`+(image.isCover?apiPath(image.book.media,image.type.extension):apiPath(image.book.media,image.id,image.type.extension))}throw new Error("image must be Image instance.")}
/**
   * Get all possible cover image URL variants for testing.
   * @param {Image} image Cover image.
   * @returns {string[]} Array of possible URLs to try.
   */getCoverURLVariants(image){if(!(image instanceof Image&&image.isCover))throw new Error("image must be a cover Image instance.");let{host:host,apiPath:apiPath}=this.getAPIArgs("thumbs","bookCover"),baseURL=`http${this.ssl?"s":""}://${host}`,reportedExt=image.type.extension,variants=[],
// Add the smart detection URL (our primary method)
smartExt=this.detectCoverExtension(image);// Remove duplicates
return variants.push(baseURL+apiPath(image.book.media,smartExt)),// Add original extension URL
variants.push(baseURL+apiPath(image.book.media,reportedExt)),// For WebP, add both simple and double variants
"webp"===reportedExt&&(variants.push(baseURL+apiPath(image.book.media,"webp")),variants.push(baseURL+apiPath(image.book.media,"webp.webp"))),// For non-WebP, add the double extension variant
"webp"!==reportedExt&&variants.push(baseURL+apiPath(image.book.media,`${reportedExt}.webp`)),[...new Set(variants)]}
/**
   * Get image thumbnail URL.
   * @param {Image} image Image.
   * @returns {string} Image thumbnail URL.
   */getThumbURL(image){if(image instanceof Image&&!image.isCover){let{host:host,apiPath:apiPath}=this.getAPIArgs("thumbs","bookThumb");return`http${this.ssl?"s":""}://${host}`+apiPath(image.book.media,image.id,image.type.extension)}throw new Error("image must be Image instance and not book cover.")}}_defineProperty(API,"APIPath",class APIPath{
/**
   * Search by query endpoint.
   * @param {string}          query     Search query.
   * @param {?number}         [page=1]  Page ID.
   * @param {?SearchSortMode} [sort=''] Search sort mode.
   * @returns {string} URL path.
   */
static search(query,page=1,sort=""){return`/api/galleries/search?query=${query}&page=${page}${sort?"&sort="+sort:""}`}
/**
   * Search by tag endpoint.
   * @param {number}  tagID    Tag ID.
   * @param {?number} [page=1] Page ID.
   * @returns {string} URL path.
   */static searchTagged(tagID,page=1){return`/api/galleries/tagged?tag_id=${tagID}&page=${page}`}
/**
   * Search alike endpoint.
   * @param {number} bookID Book ID.
   * @returns {string} URL path.
   */static searchAlike(bookID){return`/api/gallery/${bookID}/related`}
/**
   * Book content endpoint.
   * @param {number} bookID Book ID.
   * @returns {string} URL path.
   */static book(bookID){return`/api/gallery/${bookID}`}
/**
   * Book's cover image endpoint.
   * @param {number} mediaID   Media ID.
   * @param {string} extension Image extension.
   * @returns {string} URL path.
   */static bookCover(mediaID,extension){return`/galleries/${mediaID}/cover.${extension}`}
/**
   * Book's page image endpoint.
   * @param {number} mediaID   Media ID.
   * @param {number} page      Page ID.
   * @param {string} extension Image extension.
   * @returns {string} URL path.
   */static bookPage(mediaID,page,extension){return`/galleries/${mediaID}/${page}.${extension}`}
/**
   * Book's page's thumbnail image endpoint.
   * @param {number} mediaID   Media ID.
   * @param {number} page      Page ID.
   * @param {string} extension Image extension.
   * @returns {string} URL path.
   */static bookThumb(mediaID,page,extension){return`/galleries/${mediaID}/${page}t.${extension}`}
/**
   * Redirect to random book at website.
   * @returns {string} URL path.
   */static randomBookRedirect(){return"/random/"}});
/**
 * @typedef { TagTypes } TagTypes
 */
/**
 * @type {TagTypes}
 */
const TagTypes={Unknown:Tag.types.Unknown,Tag:Tag.types.Tag,Category:Tag.types.Category,Artist:Tag.types.Artist,Parody:Tag.types.Parody,Character:Tag.types.Character,Group:Tag.types.Group,Language:Tag.types.Language};export{API,Book,Image,Search,SearchSort,Tag,TagTypes};
//# sourceMappingURL=bundle.mjs.map

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var http=require("http"),https=require("https");function _interopDefaultLegacy(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var http__default=_interopDefaultLegacy(http),https__default=_interopDefaultLegacy(https);function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}
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
 * @property {?nHentaiHosts} hosts   Hosts.
 * @property {?boolean}      ssl     Prefer HTTPS over HTTP.
 * @property {?httpAgent}    agent   HTTP(S) agent.
 * @property {?string}       cookies Cookies string in format 'cookie1=value1;cookie2=value2;...'
 */
/**
 * Applies provided options on top of defaults.
 * @param {?nHentaiOptions} [options={}] Options to apply.
 * @returns {nHentaiOptions} Unified options.
 */class APIError extends Error{
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
   * Applies provided options on top of defaults.
   * @param {?nHentaiOptions} [options={}] Options to apply.
   */
constructor(options={}){_defineProperty(this,"hosts",void 0),_defineProperty(this,"ssl",void 0),_defineProperty(this,"agent",void 0),_defineProperty(this,"cookies",void 0);let params=function processOptions({hosts:{api:api="nhentai.net",images:images=["i1.nhentai.net","i2.nhentai.net","i3.nhentai.net"],thumbs:thumbs=["t1.nhentai.net","t2.nhentai.net","t3.nhentai.net"]}={},ssl:ssl=!0,agent:agent=null,cookies:cookies=null}={}){agent||(agent=ssl?https.Agent:http.Agent),"Function"===agent.constructor.name&&(agent=new agent);// Normalize hosts to arrays for consistent handling
const normalizeHosts=hostConfig=>"string"==typeof hostConfig?[hostConfig]:Array.isArray(hostConfig)?hostConfig:[hostConfig];return{hosts:{api:api,images:normalizeHosts(images),thumbs:normalizeHosts(thumbs)},ssl:ssl,agent:agent,cookies:cookies}}(options);Object.assign(this,params)}
/**
   * Get http(s) module depending on `options.ssl`.
   * @type {https|http}
   */get net(){return this.ssl?https__default.default:http__default.default}
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
   */request(options){let{net:net,agent:agent,cookies:cookies}=this;return new Promise(((resolve,reject)=>{const headers={"User-Agent":`nhentai-api-client/3.4.3 Node.js/${process.versions.node}`};// Add cookies if provided
cookies&&(headers.Cookie=cookies),Object.assign(options,{agent:agent,headers:headers}),net.get(options,(_response=>{const
/** @type {IncomingMessage}*/
response=_response,{statusCode:statusCode}=response,contentType=response.headers["content-type"];let error;if(200!==statusCode?error=new Error(`Request failed with status code ${statusCode}`):/^application\/json/.test(contentType)||(error=new Error(`Invalid content-type - expected application/json but received ${contentType}`)),error)return response.resume(),void reject(APIError.absorb(error,response));response.setEncoding("utf8");let rawData="";response.on("data",(chunk=>rawData+=chunk)),response.on("end",(()=>{try{resolve(JSON.parse(rawData))}catch(error){reject(APIError.absorb(error,response))}}))})).on("error",(error=>reject(APIError.absorb(error))))}))}
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
   * Get image URL.
   * @param {Image} image Image.
   * @returns {string} Image URL.
   */getImageURL(image){if(image instanceof Image){let{host:host,apiPath:apiPath}=image.isCover?this.getAPIArgs("thumbs","bookCover"):this.getAPIArgs("images","bookPage"),
// Handle the case where nhentai serves WebP files with original extension names
// E.g., cover.jpg.webp instead of cover.jpg
extension=image.type.extension;// For covers, if the original extension is not webp, try webp format
// This handles cases where API returns 'j' but file is actually cover.jpg.webp
if(image.isCover&&"webp"!==extension){// Return WebP URL - the consumer can handle fallback if needed
return`http${this.ssl?"s":""}://${host}`+apiPath(image.book.media,`${extension}.webp`)}return`http${this.ssl?"s":""}://${host}`+(image.isCover?apiPath(image.book.media,extension):apiPath(image.book.media,image.id,extension))}throw new Error("image must be Image instance.")}
/**
   * Get image URL with original extension (fallback for when WebP fails).
   * @param {Image} image Image.
   * @returns {string} Image URL with original extension.
   */getImageURLOriginal(image){if(image instanceof Image){let{host:host,apiPath:apiPath}=image.isCover?this.getAPIArgs("thumbs","bookCover"):this.getAPIArgs("images","bookPage");return`http${this.ssl?"s":""}://${host}`+(image.isCover?apiPath(image.book.media,image.type.extension):apiPath(image.book.media,image.id,image.type.extension))}throw new Error("image must be Image instance.")}
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
const TagTypes={Unknown:Tag.types.Unknown,Tag:Tag.types.Tag,Category:Tag.types.Category,Artist:Tag.types.Artist,Parody:Tag.types.Parody,Character:Tag.types.Character,Group:Tag.types.Group,Language:Tag.types.Language};exports.API=API,exports.Book=Book,exports.Image=Image,exports.Search=Search,exports.SearchSort=SearchSort,exports.Tag=Tag,exports.TagTypes=TagTypes;
//# sourceMappingURL=bundle.cjs.map

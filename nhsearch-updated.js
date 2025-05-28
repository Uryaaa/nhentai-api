const axios = require('axios');

module.exports = {
  command: "nhsearch",
  aliases: ["nhs"],
  category: "anime",
  description: "Cari doujin nhentai",
  requiresPrefix: true,
  includes: false,
  handler: async (client, blobClient, event, args) => {
    const { API, TagTypes } = require("nhentai-api");

    // Initialize API with new features: multiple hosts and cookies support
    const api = new API({
      // The new package automatically uses multiple hosts (i1, i2, i3 for images; t1, t2, t3 for thumbnails)
      // and supports WebP format natively, including the cover.jpg.webp fix
      cookies: process.env.cookies || null, // Use cookies if available
    });

    const waifoo = await axios.get('https://api.waifu.pics/sfw/waifu');
    const nextImage = waifoo.data.url;

    if (args.length === 0) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: "Please provide a search term.",
            quoteToken: event.message.quoteToken,
          },
        ],
      });
    }
    
    const searchTerm = args.join(" ");
    const searchURL = await axios.get(`https://nhentai.net/api/galleries/search?query=${encodeURIComponent(searchTerm)}&page=1`);
    
    // Jika input hanya angka
    if (/^\d+$/.test(searchTerm)) {
      try {
        const book = await api.getBook(searchTerm);
        const tags = book.getTagsWith({ type: TagTypes.Tag }).join(", ");
        const artists = book
          .getTagsWith({ type: TagTypes.Artist })
          .join(", ");
        const languages = book
          .getTagsWith({ type: TagTypes.Language })
          .join(", ");
        const categories = book
          .getTagsWith({ type: TagTypes.Category })
          .join(", ");
        const parodies = book
          .getTagsWith({ type: TagTypes.Parody })
          .join(", ");
        const characters = book
          .getTagsWith({ type: TagTypes.Character })
          .join(", ");
        const groups = book
          .getTagsWith({ type: TagTypes.Group })
          .join(", ");

        const replyText =
          (book.title.pretty ? `Title : ${book.title.pretty}\n` : "") +
          (book.title.english
            ? `English Title : ${book.title.english}\n`
            : "") +
          (book.title.japanese
            ? `Japanese Title : ${book.title.japanese}\n`
            : "") +
          (tags ? `\nTags : ${tags}\n\n` : "") +
          (artists ? `Artists : ${artists}\n` : "") +
          (languages ? `Languages : ${languages}\n` : "") +
          (categories ? `Categories : ${categories}\n` : "") +
          (parodies ? `Parodies : ${parodies}\n` : "") +
          (characters ? `Characters : ${characters}\n` : "") +
          (groups ? `Groups : ${groups}\n` : "") +
          (book.pages ? `Pages : ${book.pages.length}\n` : "") +
          `ID : ${book.id}\n\n` +
          `Link : https://nhentai.net/g/${book.id}`;

        // Get cover URL using the new API with automatic cover.jpg.webp handling!
        // The new package automatically handles multiple hosts and the cover.jpg.webp issue
        let coverURL = api.getImageURL(book.cover);
        
        // Keep the to-jpg proxy only for LINE compatibility (LINE doesn't support WebP)
        // The new API automatically returns WebP URLs for covers, so we always convert for LINE
        coverURL = `https://to-jpg.vercel.app/convert?url=${encodeURIComponent(coverURL)}&format=jpg`;

        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "image",
              originalContentUrl: coverURL,
              previewImageUrl: coverURL,
            },
            {
              type: "text",
              text: replyText,
              quoteToken: event.message.quoteToken,
            },
            {
              type: "flex",
              altText: "Download doujin",
              contents: {
                type: "bubble",
                size: "micro",
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "sm",
                  contents: [
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      adjustMode: "shrink-to-fit",
                      action: {
                        type: "uri",
                        label: "Download",
                        uri: `https://tamauniverse.vercel.app/api/nhentai/${book.id}/pdf`,
                      },
                    },
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      adjustMode: "shrink-to-fit",
                      action: {
                        type: "uri",
                        label: "Mirror Download",
                        uri: `https://associated-roberta-tama-universe-5876c21c.koyeb.app/api/nhentai/${book.id}/pdf`,
                      },
                    },
                  ],
                },
              },
            },
          ],
        });
      } catch (error) {
        console.error(error);
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "Error fetching book details. Please try again later.",
              quoteToken: event.message.quoteToken,
            },
          ],
        });
      }
    }

    try {
      const search = await api.search(encodeURIComponent(searchTerm));
      const books = search.books;
    
      if (!books || books.length === 0) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `No results found for "${searchTerm}".`,
              quoteToken: event.message.quoteToken,
            },
          ],
        });
      }
    
      const maxFlexMessages = Math.ceil(books.length / 7); // 7 per carousel, terakhir bisa kurang
    
      const groupedBooks = [];
      for (let i = 0; i < books.length; i += 7) {
        groupedBooks.push(books.slice(i, i + 7));
      }
    
      const flexMessages = await Promise.all(
        groupedBooks.map(async (group, index) => {
          const bubbles = await Promise.all(
            group.map(async (book) => {
              const language = book
                .getTagsWith({ type: TagTypes.Language })
                .join(", ");
              
              // Get cover URL using the new API with automatic cover.jpg.webp handling!
              // The new package automatically handles multiple hosts and the cover.jpg.webp issue
              let coverURL = api.getImageURL(book.cover);
              
              // Keep the to-jpg proxy only for LINE compatibility (LINE doesn't support WebP)
              // The new API automatically returns WebP URLs for covers, so we always convert for LINE
              coverURL = `https://to-jpg.vercel.app/convert?url=${encodeURIComponent(coverURL)}&format=jpg`;
    
              return {
                type: "bubble",
                size: "hecto",
                hero: {
                  type: "image",
                  url: coverURL,
                  size: "full",
                  aspectRatio: "2:3",
                  aspectMode: "cover",
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `ID: #${book.id} | ${language}`,
                      weight: "bold",
                      size: "xs",
                      color: "#aaaaaa",
                    },
                    {
                      type: "text",
                      text: book.title.pretty,
                      weight: "bold",
                      size: "sm",
                      wrap: true,
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      margin: "md",
                      contents: [
                        {
                          type: "text",
                          text:
                            book.artists.map((artist) => artist.name).join(", ") ||
                            "Unknown",
                          size: "xs",
                          color: "#aaaaaa",
                          wrap: true,
                        },
                        {
                          type: "text",
                          text: `${book.pages.length} pages`,
                          size: "xs",
                          color: "#aaaaaa",
                          wrap: false,
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  spacing: "sm",
                  contents: [
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      action: {
                        type: "uri",
                        label: "Open in nhentai",
                        uri: `https://nhentai.net/g/${book.id}/`,
                      },
                    },
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      action: {
                        type: "uri",
                        label: "Download",
                        uri: `https://tamauniverse.vercel.app/api/nhentai/${book.id}/pdf`,
                      },
                      color: "#4DA8DA"
                    },
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      action: {
                        type: "uri",
                        label: "Mirror Download",
                        uri: `https://associated-roberta-tama-universe-5876c21c.koyeb.app/api/nhentai/${book.id}/pdf`,
                      },
                      color: "#FF6B9D"
                    },
                    {
                      type: "button",
                      style: "primary",
                      height: "sm",
                      action: {
                        type: "postback",
                        label: "See Details",
                        data: `nhentaiDetailsData=${book.id}`,
                        displayText: `See Details ${book.id}`,
                      },
                      color: "#4DA8DA"
                    },
                  ],
                },
              };
            })
          );
          
          // Jika ini adalah Flex Message terakhir, tambahkan bubble "Next Page" dengan ukuran yang sama
          if (index === maxFlexMessages - 1) {
            bubbles.push({
              type: "bubble",
              size: "hecto",
              hero: {
                type: "image",
                url: nextImage,
                size: "full",
                aspectRatio: "2:3",
                aspectMode: "cover",
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: `To The Next Page (1/${searchURL.data.num_pages})`,
                    weight: "bold",
                    wrap: true,
                    size: "lg",
                    align: "center",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    style: "primary",
                    height: "sm",
                    action: {
                      type: "postback",
                      label: "Next Page",
                      data: `nextBookData=${searchTerm}_2`,
                      displayText: `Bot generated : To page 2/${searchURL.data.num_pages}`,
                    },
                    color: "#4DA8DA"
                  },
                ],
              },
            });
          }
    
          return {
            type: "flex",
            altText: `Search results for "${searchTerm}"`,
            contents: {
              type: "carousel",
              contents: bubbles,
            },
          };
        })
      );
    
      // Kirim maksimal 5 Flex messages dalam satu replyMessage
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: flexMessages.slice(0, 5),
      });
    
    } catch (error) {
      console.error(error);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: "Error fetching search results. Please try again later.",
            quoteToken: event.message.quoteToken,
          },
        ],
      });
    }
  }
};

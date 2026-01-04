import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator"
    }
  });

  const xml = await response.text();
  const parser = new XMLParser();
  const feed = (parser.parse(xml)).rss as RSSFeed;

  if (!("channel" in feed)) throw new Error("Channel field missing");
  if (!("title" in feed.channel)) throw new Error("title field missing from feed channel");
  if (!("link" in feed.channel)) throw new Error("link field missing from feed channel");
  if (!("description" in feed.channel)) throw new Error("description field missing from feed channel");

  const {title, link, description} = feed.channel;
  const items: RSSItem[] = [];

  if (!Array.isArray(feed.channel.item)) feed.channel.item = [];

  for (const item of feed.channel.item) {
      if (
        !(
          "title" in item &&
          typeof item.title === "string" &&
          "link" in item && 
          typeof item.link === "string" &&
          "description" &&
          typeof item.description === "string" &&
          "pubDate" in item &&
          typeof item.pubDate === "string"
        )
      ) continue;

      const {title, link, description, pubDate} = item;
      items.push({title, link, description, pubDate});
    }

  return {
    title, link, description, item: items
  }
}
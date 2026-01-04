import { fetchFeed } from "./fetchFeed";

export async function handlerAgg() {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
}
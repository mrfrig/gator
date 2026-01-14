import { fetchFeed } from "src/lib/rss";


export async function handlerAgg() {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
}
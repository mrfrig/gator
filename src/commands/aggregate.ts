import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import { fetchFeed } from "src/lib/rss";


export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }

    const duration = parseDuration(args[0]);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);;
    }, duration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(`time_between_reqs formats: <duration>ms or <duration>s or <duration>m or <duration>h`);
    } 

    const duration = match[1];
    const unit = match[2];
    const msgStart = "Collecting feeds every";

    switch (unit) {
        case "ms":
            console.log(`${msgStart} ${duration}ms`);
            return Number(duration);

        case "s":
            console.log(`${msgStart} ${duration}s`);
            return Number(duration) * 1000;

        case "m":
            console.log(`${msgStart} ${duration}m0s`);
            return Number(duration) * 60 * 1000;

        case "h":
            console.log(`${msgStart} ${duration}h0m0s`);
            return Number(duration) * 60 * 60 * 1000;

        default:
            throw new Error(`time_between_reqs formats: <duration>ms or <duration>s or <duration>m or <duration>h`);
    }
}

function handleError(error: unknown) {
    console.error("An error occurred");
    console.error(error);
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();

    if (!feed) return;
    await markFeedFetched(feed.id);
    const feedData = await fetchFeed(feed.url);

    console.log(`- Fetching feeds from ${feed.name}`);

    for (const item of feedData.item) {
        await createPost({
            title: item.title,
            url: item.link,
            description: item.description,
            published_at: new Date(item.pubDate),
            feedId: feed.id
        });
    }

    console.log(`- ${feed.name} feeds fetched`);
}
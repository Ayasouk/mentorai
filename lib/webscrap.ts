import axios from 'axios';
import cheerio from 'cheerio';
import * as url from 'url';

const startUrl = 'http://example.com';  // Replace with your starting URL

const visitedUrls = new Set<string>();
const toVisitUrls = new Set<string>([startUrl]);

async function fetchAndExtract(url: string): Promise<void> {
    if (visitedUrls.has(url) || !url.startsWith('http')) {
        return;
    }

    let response;
    try {
        response = await axios.get(url);
    } catch (error) {
        console.error(`Failed to fetch ${url}`);
        return;
    }

    const $ = cheerio.load(response.data);

    // Extract and print all text from the page
    const text = $('body').text();
    console.log(`Text from ${url}:\n${text}\n\n`);

    // Extract links and add them to the toVisitUrls set
    $('a').each((_idx, element) => {
        const link = $(element).attr('href');
        const absoluteLink = url.resolve(url, link || '');  // Make sure the link is absolute
        toVisitUrls.add(absoluteLink);
    });

    visitedUrls.add(url);
}

async function main(): Promise<void> {
    while (toVisitUrls.size > 0) {
        const currentUrl = Array.from(toVisitUrls)[0];
        toVisitUrls.delete(currentUrl);
        await fetchAndExtract(currentUrl);
    }
    console.log('Done visiting all discovered links!');
}

main().catch(err => {
    console.error('Error encountered:', err);
});

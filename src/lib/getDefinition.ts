const apiUrl = 'https://en.wiktionary.org/w/api.php?format=json&origin=*&';

const corsRequest = (url) => fetch(url, { mode: 'cors' });

export default async function getDefinition(word: string) {
  // TODO: find pageid with https://en.wiktionary.org/w/api.php?action=query&titles=<word>&prop=revisions&rvprop=content&rvgeneratexml=&format=json to query https://en.wikipedia.org/wiki/Special:ApiSandbox#action=parse&format=json&pageid=<pageid>

  const pageIdJson: {
    query: {
      pages: {
        [pageId: string]: { pageId: number };
      };
    };
  } = await (
    await corsRequest(
      `${apiUrl}action=query&titles=${word}&prop=revisions&rvprop=content&rvgeneratexml=`
    )
  ).json();

  const {
    query: { pages },
  } = pageIdJson;
  const pageid = Object.keys(pages).at(0);

  const wordJson: {
    parse: {};
  } = await (
    await corsRequest(`${apiUrl}action=parse&pageid=${pageid}`)
  ).json();
  return wordJson.parse;
}

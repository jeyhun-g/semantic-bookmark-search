import winkNLP, { ItemToken } from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);
const its = nlp.its;

const VALID_POS = new Set(['NOUN', 'ADJ', 'VERB', 'PROPN']);

// Using first 2 phrases as most imporant subjects are at the start of headlines/titles
const PHRASE_LIMIT = 2; 

export const extractKeywords = (text: string) => {
  const doc = nlp.readDoc(text);
  const keywords = new Set<string>();

  const tokens = doc.tokens()

  const phrases = [];
  let currentPhrase: string[] = [];

  tokens.each((t: ItemToken) => {
    const pos = t.out(its.pos);
    if (VALID_POS.has(pos)) {
      currentPhrase.push(t.out(its.normal))
    } else if (currentPhrase.length > 0) {
      keywords.add(currentPhrase.join(" "));
      currentPhrase = []
    }
  });

  // Add trailing phrase
  if (currentPhrase.length > 0 && phrases.length < PHRASE_LIMIT) {
    phrases.push(currentPhrase.join(' ').toLowerCase());
  }

  phrases.forEach(p => keywords.add(p))

  console.log("Keywords: ", text, keywords)

  return [...keywords];
}
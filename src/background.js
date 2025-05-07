import { BookmarksManager } from './managers'

const SIMILARITY_THRESHOLD = 0.2

const bookmarkManager = new BookmarksManager()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('sender', sender)
    if (message.action === 'get_bookmarks') {
        // const bookmarks = await bookmarkManager.getBookmarks();
        // sendResponse(bookmarks)
    } else if (message.action === 'search') {
      (async function func() {
        const searchText = message.searchText.toLowerCase();
        const embed = await createEmbedder()
        const bookmarks = await bookmarkManager.getBookmarks();
        let embeddings = []
        try {
          embeddings = await embed(
            bookmarks
            .map((b) => b.title.toLowerCase())
            .filter((t) => !!t.trim())
          );
        } catch(e) {
          console.log(e)
        }
        
        const searchEmbedding = await embed(searchText);
        
        let results = []
    
        for (let i = 0; i < embeddings.length; i++) {
          let s = similarity(searchEmbedding[0], embeddings[i])
          results.push([bookmarks[i], s])
        }
        console.log(results)
        
        results = results.sort((a, b) => {
          return a[1] < b[1] ? 1 : a[1] === b[1] ? 0 : -1
        })
  
        const top10 = results.slice(0, 10).filter(r => r[1] > SIMILARITY_THRESHOLD).map(r => r[0])
  
        sendResponse(top10)
      })()
    }

    return true
});


import { AutoModel, AutoTokenizer, Tensor } from "@huggingface/transformers";
import similarity from "compute-cosine-similarity";

/**
 * Creates an embedder function with cached model and tokenizer
 * 
 * @example 
 * const embed = await createEmbedder("minishlab/potion-base-8M");
 * const embeddings = await embed(["hello", "world"]);
 *
 * @param {string} [model_name="minishlab/potion-base-8M"] - Model name
 * @param {Object} [options] - Additional options
 * @param {string} [options.model_type="model2vec"] - Model type
 * @param {string} [options.model_revision="main"] - Model revision
 * @param {string} [options.tokenizer_revision="main"] - Tokenizer revision
 * @param {string} [options.device="webgpu"] - Device (uses "webgpu" if available)
 * @param {string} [options.dtype="fp32"] - Data type
 * @returns {Promise<(texts: string[]) => Promise<number[][]>>} - Function that generates embeddings
 */
async function createEmbedder(model_name = "minishlab/potion-base-8M", options = {}) {
  const { 
    model_type = "model2vec",
    model_revision = "main", 
    tokenizer_revision = "main", 
    device = undefined,
    dtype = "fp32", 
  } = options;

  const model = await AutoModel.from_pretrained(model_name, {
    config: { model_type },
    revision: model_revision,
    device,
    dtype,
  });

  const tokenizer = await AutoTokenizer.from_pretrained(model_name, {
    revision: tokenizer_revision,
  });
  
  /**
   * Generate embeddings for the provided texts
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} - Text embeddings
   */
  return async function embed(texts) {
    // Tokenize inputs
    const { input_ids } = await tokenizer(texts, {
      add_special_tokens: false,
      return_tensor: false,
    });

    // Calculate offsets
    const offsets = [0];
    if (Array.isArray(input_ids[0])) {
      for (let i = 0; i < input_ids.length - 1; i++) {
        if (input_ids[i].length > 0) {
          const v = offsets[i] + input_ids[i].length
          offsets.push(v);
        } else {
          const v = offsets[i] + 1
          offsets.push(v);
        }
        // const v = offsets[i] + input_ids[i].length
        // if (Number.isNaN(v)) {
        //   console.log("Hit NaN: ", offsets[i], input_ids[i.length])
        // }
        // offsets.push(v);
      }
    } else {
      offsets.push(input_ids.length);
    }

    

    // Create tensors and get embeddings from flattened input ids and offsets
    const flattened_input_ids = input_ids.flat();
    const model_inputs = {
      input_ids: new Tensor("int64", flattened_input_ids, [flattened_input_ids.length]),
      offsets: new Tensor("int64", offsets, [offsets.length]),
    };

    const { embeddings } = await model(model_inputs);
    return embeddings.tolist();
  };
}

async function run() {
  const embed = await createEmbedder()

  const texts = [
    "10 Principles of design patterns",
    "How to bake an apple pie",
    "Car manuals",
    "React native bottomsheets",
    "Angular framework",
    "Developer roadmaps",
    "JS the right way",
    "Wired Elements Showcase",
    "Netflix blog",
    "Engineering at Meta"
  ]
  
  const embeddings = await embed(texts)
  
  const searchText = "books about javascript"
  const searchEmbedding = await embed([searchText])
  let results = []
  
  for (let i = 0; i < embeddings.length; i++) {
    const s = similarity(searchEmbedding[0], embeddings[i])
    results.push([texts[i], s])
  }
  
  results = results.sort((a, b) => {
    return a[1] < b[1] ? 1 : a[1] === b[1] ? 0 : -1
  })
  
  results.forEach(console.log)
}


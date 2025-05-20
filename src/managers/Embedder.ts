import { AutoModel, AutoTokenizer, PreTrainedModel, PreTrainedTokenizer, Tensor } from "@huggingface/transformers";
import { Logger } from './../logger'

const logger = Logger.getLogger()

export class EmbedderSingleton {
  private static instance: EmbedderSingleton 

  private constructor(private model: PreTrainedModel, private tokenizer: PreTrainedTokenizer) {}

  public async getEmbeddings(texts: string[]) {
    const { input_ids: inputIds } = await this.tokenizer(texts, {
      add_special_tokens: false,
      return_tensor: false,
    });

    const offsets = [0];
    if (Array.isArray(inputIds[0])) {
      for (let i = 0; i < inputIds.length - 1; i++) {
        if (inputIds[i].length > 0) {
          const v = offsets[i] + inputIds[i].length
          offsets.push(v);
        } else {
          const v = offsets[i] + 1
          offsets.push(v);
        }
      }
    } else {
      offsets.push(inputIds.length);
    }

    const flattenedInputIds = inputIds.flat();
    const modelInputs = {
      input_ids: new Tensor("int64", flattenedInputIds, [flattenedInputIds.length]),
      offsets: new Tensor("int64", offsets, [offsets.length]),
    };

    const { embeddings } = await this.model(modelInputs);
    return embeddings.tolist();
  };

  private static async createEmbedder() {
    const modelName = "minishlab/potion-base-8M"
    const modelType = "model2vec"
    const modelRevision = "main"
    const tokenizerRevision = "main"
    const device = "wasm"
    const dType = "fp32"

    logger.suppressError("CanUpdateImplicitInputNameInSubgraphs")
    
    const model = await AutoModel.from_pretrained(modelName, {
      //@ts-expect-error
      config: { model_type: modelType },
      revision: modelRevision,
      device: device,
      dtype: dType,
    });
  
    const tokenizer = await AutoTokenizer.from_pretrained(modelName, {
      revision: tokenizerRevision,
    });
  
    logger.unsuppressError("CanUpdateImplicitInputNameInSubgraphs")
    
    return { model, tokenizer }
  }

  static async getInstance(){
    if (!this.instance) {
      const { model, tokenizer } = await this.createEmbedder()
      this.instance = new EmbedderSingleton(model, tokenizer)
    }

    return this.instance
  }
}
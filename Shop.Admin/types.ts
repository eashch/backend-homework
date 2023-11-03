declare module 'express-session' {
    export interface SessionData {
        username?: string;
    }
}

export interface IProductEditData {
    title: string;
    description: string;
    price: string;
    mainImage: string;
    newImages?: string;
    commentsToRemove: string | string[];
    imagesToRemove: string | string[];
    similarToRemove: string | string[];
    similarToAdd: string | string[];
}

export interface IProductNewData {
    title: string;
    description: string;
    price: string;
}
  

export interface ISimilarEntity {
    similar_id: string;
    product_id: string;
    product_similar_id: string;
}

export type SimilarCreatePayload = Omit<ISimilarEntity, "similar_id">;

export interface SimilarAddPairsPayload {
    pairs: SimilarCreatePayload[];
}
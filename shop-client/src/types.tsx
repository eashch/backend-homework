export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: IProductImage;
    comments?: IComment[];
    images?: IProductImage[];
}

export interface IComment {
    id: string;
    name: string;
    email: string;
    body: string;
    productId: string;
}

export interface IProductImage {
    id: string;
    productId: string;
    main: boolean;
    url: string;
}

export interface IProductsSlice {
    products: IProduct[]
    loadingStatus: ELoadingStatus
}

export interface IProductOnPageProps {
    product: IProduct;
};

export enum ELoadingStatus {
    LOADING,
    LOADED,
    ERROR
};

export interface ISimilarEntity {
    similar_id: string;
    product_id: string;
    product_similar_id: string;
}
import axios from "axios";
import { IProduct, IProductFilterPayload } from "@Shared/types";
import { IProductEditData, IProductNewData, SimilarAddPairsPayload } from "../types";
import { API_HOST } from "./const";

export async function getProducts(): Promise<IProduct[]> {
    const { data } = await axios.get<IProduct[]>(`${API_HOST}/products`);
    return data || [];
}

export async function searchProducts(
    filter: IProductFilterPayload
): Promise<IProduct[]> {
    const { data } = await axios.get<IProduct[]>(
        `${API_HOST}/products/search`,
        { params: filter }
    );
    return data || [];
    }

export async function getProduct(
    id: string
): Promise<IProduct | null> {
    try {
        const { data } = await axios.get<IProduct>(
            `${API_HOST}/products/${id}`
        );
        return data;
    } catch (e) {
        return null;
    }
}

export async function removeProduct(id: string): Promise<void> {
    await axios.delete(`${API_HOST}/products/${id}`);
}

function splitNewImages(str = ""): string[] {
    return str
        .split(/\r\n|,/g)
        .map(url => url.trim())
        .filter(url => url);
}

function compileIdsToRemove(data: string | string[]): string[] {
    if (typeof data === "string") return [data];
    return data;
}

function compileSimilarPairsToAdd(currentProductID: string, 
        data: string | string[]): SimilarAddPairsPayload {
    
    if (typeof data === "string") 
        data = [data];

    const addPairs: SimilarAddPairsPayload = {
        pairs: []
    };
    data.forEach((item) => {
        addPairs.pairs.push({
            product_id: currentProductID,
            product_similar_id: item
        });
    });
    return addPairs;
}

export async function updateProduct(
    productId: string,
    formData: IProductEditData
): Promise<void> {
    try {
        const { data: currentProduct } = await axios.get<IProduct>(`${API_HOST}/products/${productId}`);

        if (formData.commentsToRemove) {
            const commentsIdsToRemove = compileIdsToRemove(formData.commentsToRemove);

            const getDeleteCommentActions = () => commentsIdsToRemove.map(commentId => {
                return axios.delete(`${API_HOST}/comments/${commentId}`);
            });

            await Promise.all(getDeleteCommentActions());
        }

        if (formData.imagesToRemove) {
            const imagesIdsToRemove = compileIdsToRemove(formData.imagesToRemove);
            await axios.post(`${API_HOST}/products/remove-images`, imagesIdsToRemove);
        }

        if (formData.newImages) {
            const urls = splitNewImages(formData.newImages);

            const images = urls.map(url => ({ url, main: false }));

            if (!currentProduct.thumbnail) {
                images[0].main = true;
            }

            await axios.post(`${API_HOST}/products/add-images`, { productId, images });
        }

        if (formData.mainImage && formData.mainImage !== currentProduct.thumbnail?.id) {
            await axios.post(`${API_HOST}/products/update-thumbnail/${productId}`, {
                newThumbnailId: formData.mainImage
            });
        }

        if (formData.similarToAdd) {
            const similarToAdd = compileSimilarPairsToAdd(
                currentProduct.id, formData.similarToAdd);
            await axios.post(`${API_HOST}/similar/add-similar`, 
                similarToAdd);
        }

        if (formData.similarToRemove) {
            const similarIdsToRemove = compileIdsToRemove(formData.similarToRemove);
            await axios.post(`${API_HOST}/similar/remove-similar`, similarIdsToRemove);
        }

        await axios.patch(`${API_HOST}/products/${productId}`, {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price)
        });
    } catch (e) {
        console.log(e);
    }
}


export async function createProduct(
    formData: IProductNewData,
    onResponse: (id: string) => void
): Promise<void> {
    try {
        await axios.post(`${API_HOST}/products/`, {
            title: formData.title,
            description: formData.description,
            price: formData.price,
        }).then(function (response) {
            onResponse(response.data["id"]);
        }).catch(function (error) {
            console.log(error);
        });
    } catch (e) {
        console.log(e);
    }
}

export async function getSimilarForProduct(
    id: string
): Promise<string[] | null> {
    try {
        const { data } = await axios.get<string[]>(
            `${API_HOST}/similar/${id}`
        );
        if (!data || !data.length) 
            return null;

        return data;
    } catch (e) {
        return null;
    }
}
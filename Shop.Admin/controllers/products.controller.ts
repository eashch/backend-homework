import { Router, Request, Response } from "express";
import { createProduct, getProduct, getProducts, getSimilarForProduct, removeProduct, searchProducts, updateProduct } from "../models/products.model";
import { IProduct, IProductFilterPayload } from "@Shared/types";
import { IProductEditData, IProductNewData } from "../types";
import { throwServerError } from "./helper";

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.render("products", {
            items: products,
            queryParams: {}
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/new-product', async (req: Request, res: Response) => {
    try {
        res.render("new-product", {
            queryParams: {}
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/search', async (
    req: Request<{}, {}, {}, IProductFilterPayload>,
    res: Response
    ) => {
    try {
        const products = await searchProducts(req.query);
        res.render("products", {
            items: products,
            queryParams: req.query
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const product = await getProduct(req.params.id);
        const similarProducts = await getSimilarForProduct(
            req.params.id);
        const allProducts = await getProducts();

        const similarItems: IProduct[] = [];
        const notSimilarItems: IProduct[] = [];

        allProducts.forEach(item => {
            if (similarProducts && similarProducts.includes(item.id)) {
                similarItems.push(item);
            } else if (item.id !== req.params.id) {
                notSimilarItems.push(item);
            }
        });

        if (product) {
            res.render("product/product", {
                item: product,
                similarProducts: similarItems,
                notSimilarProducts: notSimilarItems
            });
        } else {
            res.render("product/empty-product", {
                id: req.params.id
            });
        }
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/remove-product/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        if (req.session.username !== "admin") {
            res.status(403);
            res.send("Forbidden");
            return;
        }

        await removeProduct(req.params.id);
        res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/save/:id', async (
    req: Request<{ id: string }, {}, IProductEditData>,
    res: Response
) => {
    try {
        await updateProduct(req.params.id, req.body);
        res.redirect(`/${process.env.ADMIN_PATH}/${req.params.id}`);
    } catch (e) {
        throwServerError(res, e);
    }
});


productsRouter.post('/new-product', async (
    req: Request<{}, {}, IProductNewData>,
    res: Response
) => {
    try {
        await createProduct(req.body, (id: string) => {
            res.redirect(`/${process.env.ADMIN_PATH}/${id}`);
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

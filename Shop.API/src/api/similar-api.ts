import { Request, Response, Router } from "express";
import { connection } from "../..";
import { ISimilarEntity, SimilarAddPairsPayload, SimilarRemovePayload } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { OkPacket } from "mysql2";
import { DELETE_SIMILARS_QUERY, DELETE_SIMILARS_SECOND_ID_QUERY, INSERT_SIMILAR_PAIRS_QUERY } from "../services/queries";
import { body, param, query, validationResult } from 'express-validator';



export const similarProductsRouter = Router();

similarProductsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const [similarProducts] = await connection.query<ISimilarEntity[]>(
            "SELECT * FROM similar"
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(similarProducts);
    } catch (e) {
        console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
    }
});

similarProductsRouter.get('/:id', 
    param('id', 'id must be uuid').isUUID(),
    async (
        req: Request<{ id: string }>,
        res: Response
) => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        res.send({ errors: validResult.array() });
        return;
    }

    try {
        const prodID = req.params.id;
        const [similarProducts] = await connection.query<ISimilarEntity[]>(
            "SELECT * FROM similar WHERE product_id = ? OR product_similar_id = ?",
            [prodID, prodID]
        );
        const setOfIDs = new Set<string>();
        similarProducts.forEach(item => {
            if (item.product_id !== prodID)
                setOfIDs.add(item.product_id);
            if (item.product_similar_id !== prodID)
                setOfIDs.add(item.product_similar_id);
        });
        const arrayOfIDs = Array.from(setOfIDs);

        res.setHeader('Content-Type', 'application/json');
        res.send(arrayOfIDs);
    } catch (e) {
        console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
    }
});


similarProductsRouter.post('/add-similar', 
        body("pairs").isArray(), 
        body('pairs.*.product_id', 
            'product_id must be uuid').exists().isUUID(),
        body('pairs.*.product_similar_id', 
            'product_similar_id must be uuid').exists().isUUID(),
        async (
    req: Request<{}, {}, SimilarAddPairsPayload>,
    res: Response
) => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        res.send({ errors: validResult.array() });
        return;
    }

    try {
        const { pairs } = req.body;
        if (!pairs?.length) {
            res.status(400);
            res.send("Pairs array is empty");
            return;
        }

        const values = pairs.map((pair) => [uuidv4(), 
            pair.product_id, pair.product_similar_id]);
        await connection.query<OkPacket>(
            INSERT_SIMILAR_PAIRS_QUERY, [values]);

        res.status(201);
        res.send(`Similar pairs were added`);
    } catch (e) {
        console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
    }
});

similarProductsRouter.post('/remove-similar', 
    body('', 
        'must be array of uuids').isArray(), 
    body('*', 
        'must be uuid').isUUID(),
    async (
        req: Request<{}, {}, SimilarRemovePayload>,
        res: Response
) => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        res.send({ errors: validResult.array() });
        return;
    }

    try {
        const productIDsToRemove = req.body;
        if (!productIDsToRemove?.length) {
            res.status(400);
            res.send("Pairs array is empty");
            return;
        }

        const [info] = await connection.query<OkPacket>(
            DELETE_SIMILARS_QUERY, [[productIDsToRemove]]);

        const [infoSecondID] = await connection.query<OkPacket>(
            DELETE_SIMILARS_SECOND_ID_QUERY, [[productIDsToRemove]]);

        if (info.affectedRows === 0 
                && infoSecondID.affectedRows === 0) {
            res.status(404);
            res.send("Nothing was removed");
            return;
        }

        res.status(200);
        res.send(`All similars to products have been removed!`);
    } catch (e) {
        console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
    }
});
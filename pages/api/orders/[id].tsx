import {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from '../../../lib/mongo';
import Order from '../../../models/Order';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const {
        method,
        query: {id},
    } = req;

    await dbConnect();

    if (method === 'GET') {
        try {
            const order = await Order.findById(id);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    if (method === 'PUT') {
        try {
            const order = await Order.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

export default handler;
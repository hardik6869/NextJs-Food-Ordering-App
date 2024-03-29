import CartStyle from '../styles/Cart.module.css';
import Image from 'next/image';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {reset} from '../redux/cartSlice';
import axios, {AxiosResponse} from 'axios';
import {NextRouter, useRouter} from 'next/router';
import OrderDetaild from '../components/OrderDetaild';
import {CartState, Products} from '../interface/Interface';

const Cart = (): JSX.Element => {
    const cart = useSelector((state: CartState) => state.cart);
    const [open, setOpen] = useState<boolean>(false);
    const [cash, setCash] = useState<boolean>(false);
    const amount = cart.total;
    const currency = 'USD';
    const style: Object = {layout: 'vertical'};
    const dispatch = useDispatch();
    const router: NextRouter = useRouter();

    const createOrder = async (data: {
        customer: string;
        address: string;
        total: number;
        method: number;
    }) => {
        try {
            const res: AxiosResponse = await axios.post(
                `${process.env.BASE_URL}/orders`,
                data,
            );
            if (res.status === 201) {
                dispatch(reset());
                router.push(`/orders/${res.data._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const ButtonWrapper = ({currency, showSpinner}) => {
        const [{options, isPending}, dispatch] = usePayPalScriptReducer();
        useEffect(() => {
            dispatch({
                type: 'resetOptions',
                value: {
                    ...options,
                    currency: currency,
                },
            });
        }, [currency, showSpinner]);

        return (
            <div>
                {showSpinner && isPending && <div className="spinner" />}
                <PayPalButtons
                    style={style}
                    disabled={false}
                    forceReRender={[amount, currency, style]}
                    fundingSource={undefined}
                    createOrder={async (data, actions) => {
                        const orderId: string = await actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency as string,
                                        value: amount as unknown as string,
                                    },
                                },
                            ],
                        });
                        return orderId;
                    }}
                    onApprove={async function (data, actions) {
                        const details = await actions.order.capture();
                        const shipping = details.purchase_units[0].shipping;
                        createOrder({
                            customer: shipping.name.full_name,
                            address: shipping.address.address_line_1,
                            total: cart.total,
                            method: 1,
                        });
                    }}
                />
            </div>
        );
    };

    return (
        <div className={CartStyle.container}>
            <div className={CartStyle.left}>
                <table className={CartStyle.table}>
                    <tbody>
                        <tr className={CartStyle.trTitle}>
                            <th>Product</th>
                            <th>Name</th>
                            <th>Extras</th>
                            <th>Price</th>
                            <th>Quentity</th>
                            <th>Total</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {cart.products.map((product: Products) => (
                            <tr className={CartStyle.tr} key={product._id}>
                                <td>
                                    <div className={CartStyle.imgContainer}>
                                        <Image
                                            src={product.img}
                                            layout="fill"
                                            objectFit="cover"
                                            alt=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <span className={CartStyle.name}>
                                        {product.title}
                                    </span>
                                </td>
                                <td>
                                    <span className={CartStyle.extra}>
                                        {product.extras.map((extra) => (
                                            <span key={extra._id}>
                                                {extra.text}
                                            </span>
                                        ))}
                                    </span>
                                </td>
                                <td>
                                    <span className={CartStyle.price}>
                                        ₹{product.price}
                                    </span>
                                </td>
                                <td>
                                    <span className={CartStyle.quantity}>
                                        {product.quantity}
                                    </span>
                                </td>
                                <td>
                                    <span className={CartStyle.total}>
                                        ₹{product.price * product.quantity}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={CartStyle.right}>
                <div className={CartStyle.wrapper}>
                    <h2 className={CartStyle.title}> CARD TOTAL</h2>
                    <div className={CartStyle.totalText}>
                        <b className={CartStyle.totalTextTitle}> Subtotal: </b>₹
                        {cart.total}
                    </div>
                    <div className={CartStyle.totalText}>
                        <b className={CartStyle.totalTextTitle}> Discount: </b>
                        ₹0.00
                    </div>
                    <div className={CartStyle.totalText}>
                        <b className={CartStyle.totalTextTitle}> Total: </b>₹
                        {cart.total}
                    </div>
                    {open ? (
                        <div className={CartStyle.paymentMethods}>
                            <button
                                className={CartStyle.payButton}
                                onClick={() => setCash(true)}>
                                CASH ON DELIVERY
                            </button>
                            <PayPalScriptProvider
                                options={{
                                    'client-id':
                                        'AVDHTEY8P8E4uQ4juccR64Iif4T3UiOb9pPZMieix6MzmGnwd51Q7HjMzaTxlxjAZqKibfA5tAnILKvW',
                                    components: 'buttons',
                                    currency: 'USD',
                                    'disable-funding': 'credit,card,p24',
                                }}>
                                <ButtonWrapper
                                    currency={currency}
                                    showSpinner={false}
                                />
                            </PayPalScriptProvider>
                        </div>
                    ) : (
                        <button
                            className={CartStyle.button}
                            onClick={() => setOpen(true)}>
                            CHECKOUT NOW!
                        </button>
                    )}
                </div>
            </div>
            {cash && (
                <OrderDetaild total={cart.total} createOrder={createOrder} />
            )}
        </div>
    );
};

export default Cart;

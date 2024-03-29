import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import {
    Button,
    Card,
    CircularProgress,
    Grid,
    Link,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import useStyles from "../utils/styles";
import CheckoutWizard from "../components/CheckoutWizard";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import Cookies from "js-cookie";

function PlaceOrder() {
    const classes = useStyles();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useContext(Store);
    const {
        userInfo,
        cart: { cartItems, shippingAddress, paymentMethod },
    } = state;
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
    );
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    var usdFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    useEffect(() => {
        if (!paymentMethod) {
            router.push("/payment");
        }
    }, []);
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const placeOrderHandler = async () => {
        closeSnackbar();
        try {
            setLoading(true);
            const { data } = await axios.post("/api/orders", {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                shippingPrice,
                itemsPrice,
                taxPrice,
                totalPrice,
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                }
            });
            dispatch({ type: 'CART_CLEAR' });
            Cookies.remove('cartItems');
            setLoading(false);
            router.push(`/order/${data._id}`)
        } catch (err) {
            console.log(err);
            setLoading(false);
            enqueueSnackbar(getError(err), { variant: "error" });
        }
    };
    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={3} />
            <Typography component="h1" variant="h1">
                Place Order
            </Typography>
            <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Shipping Address
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                                {shippingAddress.country}
                            </ListItem>
                        </List>
                    </Card>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Payment Method
                                </Typography>
                            </ListItem>
                            <ListItem>{paymentMethod}</ListItem>
                        </List>
                    </Card>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Order Items
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Image</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartItems.map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>
                                                        <NextLink href={`/product/${item.slug}`} passHref>
                                                            <Link>
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    width={50}
                                                                    height={50}
                                                                />
                                                            </Link>
                                                        </NextLink>
                                                    </TableCell>
                                                    <TableCell>
                                                        <NextLink href={`/product/${item.slug}`} passHref>
                                                            <Link>
                                                                <Typography>{item.name}</Typography>
                                                            </Link>
                                                        </NextLink>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography>{item.quantity}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography>{"$" + item.price}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography variant="h2">Order Summary</Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Items:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {usdFormatter.format(itemsPrice)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Tax:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {usdFormatter.format(taxPrice)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Shipping:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {usdFormatter.format(shippingPrice)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>
                                            <strong>Total:</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            <strong>{usdFormatter.format(totalPrice)}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    onClick={placeOrderHandler}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Place Order
                                </Button>
                            </ListItem>
                            {loading && (<ListItem>
                                <CircularProgress />
                            </ListItem>)}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });

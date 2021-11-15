import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link';
import { Store } from '../utils/Store';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/checkoutWizard';

export default function Shipping() {
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm();
    const { state, dispatch } = useContext(Store);
    const { userInfo, cart: { shippingAddress } } = state;
    const router = useRouter();
    const { redirect } = router.query;
    useEffect(() => {
        if (userInfo) {
            router.push('/login?redirect=/shipping');
        }
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('state', shippingAddress.state);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
    }, []);

    const classes = useStyles();
    const submitHandler = ({ fullName, address, city, state, postalCode, country }) => {
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: { fullName, address, city, state, postalCode, country } });
        Cookies.set('shippingAddress', JSON.stringify({ fullName, address, city, state, postalCode, country }));
        router.push('/payment');
    };
    return (
        <div>
            <Layout title="Shipping Address">
                <CheckoutWizard activeStep={1} />
                <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                    <Typography component="h1" variant="h1">
                        Shipping Address
                    </Typography>
                    <List>
                        <ListItem>
                            <Controller
                                name="fullName"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.fullName)}
                                        helperText={errors.fullName ? errors.fullName.type === 'minLength' ? 'Full Name needs to be longer than 2 characters' : 'Full Name is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="address"
                                        label="Address"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.address)}
                                        helperText={errors.address ? errors.address.type === 'minLength' ? 'Address needs to be longer than 2 characters' : 'Address is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="city"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="city"
                                        label="City"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.city)}
                                        helperText={errors.city ? errors.city.type === 'minLength' ? 'City needs to be longer than 2 characters' : 'City is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="state"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="state"
                                        label="State"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.state)}
                                        helperText={errors.state ? errors.state.type === 'minLength' ? 'State needs to be longer than 2 characters' : 'State is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="postalCode"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="postalCode"
                                        label="Postal Code"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.postalCode)}
                                        helperText={errors.postalCode ? errors.postalCode.type === 'minLength' ? 'Postal Code needs to be longer than 2 characters' : 'Postal Code is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="country"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 2,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.country)}
                                        helperText={errors.country ? errors.country.type === 'minLength' ? 'Country needs to be longer than 2 characters' : 'Country is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" type="submit" fullWidth color="primary">
                                Continue
                            </Button>
                        </ListItem>
                    </List>
                </form>
            </Layout>
        </div >
    )
}

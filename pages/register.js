import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

export default function Register() {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    const { redirect } = router.query;
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, []);

    const classes = useStyles();
    const submitHandler = async ({ name, email, password, confirmPassword }) => {
        closeSnackbar();
        if (password !== confirmPassword) {
            enqueueSnackbar('Passwords do not match.', { variant: 'error' });
            return;
        }
        try {
            const { data } = await axios.post('/api/users/register', { name, email, password });
            dispatch({ type: 'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (error) {
            enqueueSnackbar(error.response.data ? error.response.data.message : error.message, { variant: 'error' });
        }
    }
    return (
        <div>
            <Layout title="Register">
                <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                    <Typography component="h1" variant="h1">
                        Register
                    </Typography>
                    <List>
                        <ListItem>
                            <Controller
                                name="name"
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
                                        id="name"
                                        label="name"
                                        inputProps={{ type: "text" }}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name ? errors.name.type === 'minLength' ? 'Name needs to be longer than 2 characters' : 'Name is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        inputProps={{ type: "email" }}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email ? errors.email.type === 'pattern' ? 'Email is not valid' : 'Email is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 6
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        inputProps={{ type: "password" }}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password ? errors.password.type === 'minLength' ? 'Password length is less than 5 characters' : 'Password is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 6
                                }}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="confirmPassword"
                                        label="Confirm Password"
                                        inputProps={{ type: "password" }}
                                        error={Boolean(errors.confirmPassword)}
                                        helperText={errors.confirmPassword ? errors.confirmPassword.type === 'minLength' ? 'Password length is less than 5 characters' : 'Password is required' : ''}
                                        {...field}
                                    ></TextField>
                                )}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" type="submit" fullWidth color="primary">
                                Register
                            </Button>
                        </ListItem>
                        <ListItem>
                            Already have an account? &nbsp;
                            <NextLink href={`/login?redirect=${redirect || '/'}`}><Link>Login</Link></NextLink>
                        </ListItem>
                    </List>
                </form>
            </Layout>
        </div >
    )
}

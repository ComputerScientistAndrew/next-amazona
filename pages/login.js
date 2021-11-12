import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function Login() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    const { redirect } = router.query;
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            dispatch({ type: 'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (error) {
            alert(error.response.data ? error.response.data.message : error.message);
        }
    }
    return (
        <div>
            <Layout title="Login">
                <form onSubmit={submitHandler} className={classes.form}>
                    <Typography component="h1" variant="h1">
                        Login
                    </Typography>
                    <List>
                        <ListItem>
                            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{ type: 'email' }} onChange={e => setEmail(e.target.value)}></TextField>
                        </ListItem>
                        <ListItem>
                            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{ type: 'password' }} onChange={e => setPassword(e.target.value)}></TextField>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" type="submit" fullWidth color="primary">
                                Login
                            </Button>
                        </ListItem>
                        <ListItem>
                            Don't have an account? &nbsp;
                            <NextLink href="/register"><Link>Register</Link></NextLink>
                        </ListItem>
                    </List>
                </form>
            </Layout>
        </div >
    )
}

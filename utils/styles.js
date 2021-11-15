import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            color: '#ffffff',
            marginLeft: 10,
        }
    },
    main: {
        minHeight: '80vh'
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem'
    },
    grow: {
        flexGrow: 1
    },
    section: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    footer: {
        marginTop: '10px',
        textAlign: 'center'
    },
    form: {
        maxWidth: 800,
        margin: '0 auto'
    },
    navbarButton: {
        color: '#ffffff',
        textTransform: 'initial'
    },
    transparentBackground: {
        backgroundColor: 'transparent',
    }
})

export default useStyles;
import { Step, StepLabel, Stepper } from '@material-ui/core'
import React from 'react'
import useStyles from '../utils/styles'

export default function CheckoutWizard({ activeStep }) {
    const classes = useStyles();
    return (
        <Stepper className={classes.transparentBackground} activeStep={activeStep} alternativeLabel>
            {
                ['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(step =>
                    (<Step key={step}><StepLabel>{step}</StepLabel></Step>)
                )
            }
        </Stepper>
    )
}

import React from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import styles from './signUp.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

const Signup = () => {
    const paperStyle = { padding: '30px 20px',height: '70 vh', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const marginTop = { marginTop: 5 }
    return (
        <Grid style={{height:'520px'}}>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Sign Up</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                <form>
                    <input className={cx('input_user')} label='name' placeholder="Enter your name" />
                    <TextField style={{width:'260px',marginTop:'5px'}} label='Email' placeholder="Enter your email" />
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel  component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <TextField style={{width:'260px'}} label='Phone Number' placeholder="Enter your phone number"   />
                    <TextField style={{width:'260px'}} label='Password' placeholder="Enter your password"/>
                    <TextField style={{width:'260px'}} label='Confirm Password' placeholder="Confirm your password"/>
                    <FormControlLabel style={{display:'block'}}
                        control={<Checkbox name="checkedA" />}
                        label="I accept the terms and conditions."
                    />
                    <Button style={{margin:'5px 100px'}} type='submit' variant='contained' color='primary'>Sign up</Button>
                </form>
            </Paper>
        </Grid>
    )
}

export default Signup;
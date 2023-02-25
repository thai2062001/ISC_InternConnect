import React from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
const Login = ({ handleChange }) => {

    const paperStyle = { padding: 20, height: '73vh', width: 300, margin: "0 auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' ,height:'50px',width:'50px'}
    const btnstyle = { margin: '8px 0' }
    const TypographyStyles1 ={display:'flex',justifyContent:'space-between',alignItems: 'center'}
    const TypographyStyles2 ={display:'flex', margin:'5px',padding:'10px 5px',justifyContent:'space-between',alignItems: 'center'}
    const GridStyle = {}
    
    return (
        <Grid style ={GridStyle} >
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2 style={{fontSize:'40px'}}>Sign In</h2>
                </Grid>
                <TextField style={{height:'40px'}} label='Username' placeholder='Enter username' fullWidth required />
                <TextField label='Password' placeholder='Enter password' type='password' fullWidth required />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="Remember me"
                />
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                <Typography style={TypographyStyles1}>
                    <Link href="#" >
                        Forgot password ?
                    </Link>
                </Typography>
                <Typography style = {TypographyStyles2} > Do you have an account ?
                    <Link href="#" onClick={() => handleChange("event", 1)} >
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login
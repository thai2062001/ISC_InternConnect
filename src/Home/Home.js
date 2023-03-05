import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography, Button } from '@material-ui/core';

const cx = classNames.bind(styles)


function Home() {
    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
          padding: theme.spacing(4),
        },
        card: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        title: {
          marginBottom: theme.spacing(2),
        },
        button: {
          marginTop: theme.spacing(2),
        },
      }));
      
      const BodyComponent = () => {
        const classes = useStyles();

        
    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('content')} >
                <div className={cx('banner')}>
                    <h1>
                        <span>Find</span> your job
                    </h1>
                    <p>
                    Lorem Ipsum is simply dummy text of the printing and
                     typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s,
                       when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                        but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                        sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
            </div>
      </div>
    );
    
}
}
export default Home;
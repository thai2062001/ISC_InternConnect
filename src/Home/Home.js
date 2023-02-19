import classNames from 'classnames/bind';
import styles from './Home.module.scss'


const cx = classNames.bind(styles)


const courses =[{
    name:'Thai',
    age:'18',
    img:'https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-tiktok-inkythuatso-2-mesa-de-trabajo-1-27-09-13-05.jpg'

},
    {
        name:'Huong',
        age:'20',
        img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwFIDYh79pYv2K6X03Mmp_Jo_0dFdoq62qhw&usqp=CAU'
}]

function Home() {
    return ( 
        <div className={cx('wrapper')}>
            <ul className={cx('item-post')}>
                {courses.map(course=>(
                    <div className={cx('content')}>
                        <img src={course.img}/>
                        <li className={cx('item')} key={course} >{course.name}</li>
                    </div>
                    
                ))}
            </ul>
        </div>
     );
}

export default Home;
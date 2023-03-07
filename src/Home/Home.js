import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { useEffect,useRef } from 'react';
const cx = classNames.bind(styles)


function Home() {


  const HandleNext = ()=>{
      let lists = document.querySelectorAll('#item');
      document.getElementById('slide').appendChild(lists[0]);
   }

   const HandlePrev = ()=>{
    let lists = document.querySelectorAll('#item');
    document.getElementById('slide').prepend(lists[lists.length -1]);
 }

  return (
    <div className={cx('container_full')}> 
<div className={cx('container')}>
  <div className={cx('title_slide')}>
    <h1>Các công ty nổi bật</h1>
  </div>
      <div className={cx('wrapper')}>
        <div id='slide' className={cx('banner')}>
          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: 'linear-gradient(90deg, rgba(100,132,187,1) 18%, rgba(100,132,187,1) 35%, rgba(100,132,187,1) 50%, rgba(64,161,211,1) 68%, rgba(48,174,222,1) 76%, rgba(0,212,255,1) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>FPT</div>
              <div className={cx('name')}>Công ty FPT</div>
              <div className={cx('type')}>IT</div>
            </div>
          </div>

          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel</div>
              <div className={cx('name')}>Công ty Viettel</div>
              <div className={cx('type')}>IT</div>
            </div>
          </div>

          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: ' radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel</div>
              <div className={cx('name')}>Công ty Viettel</div>
              <div className={cx('type')}>IT</div>
            </div>
          </div>
          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: ' radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel</div>
              <div className={cx('name')}>Công ty Viettel</div>
              <div className={cx('type')}>IT</div>
            </div>
          </div>
          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: ' radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,231) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel</div>
              <div className={cx('name')}>Công ty Viettel</div>
              <div className={cx('type')}>IT</div>
            </div>

          </div>
          <div id='item' className={cx('item')} style={{ background: 'rgb(100,132,187)', backgroundImage: ' radial-gradient(circle, rgba(174,202,1) 0%, rgba(148,187,233,1) 100%)' }}>
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel</div>
              <div className={cx('name')}>Công ty Viettel</div>
              <div className={cx('type')}>IT</div>
            </div>
          </div>

        </div>

        <div className={cx('buttons')}>
          <button className={cx('prev')} onClick={HandlePrev} id='prev'>
          <FaAngleDoubleLeft/>
          </button>
          <button onClick={HandleNext} id='next'>
            <FaAngleDoubleRight/>
          </button>
        </div>

      </div>

    </div>
    <div className={cx('introduce')}>
    <div className={cx('introduce-banner')}>
      <h1>Give me your money</h1>
    </div>
    </div>

    </div>
    
  );

}

export default Home;
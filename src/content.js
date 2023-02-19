import { tab } from '@testing-library/user-event/dist/tab'
import { useState, useEffect ,useLayoutEffect,useRef ,useMemo} from 'react'
import {unstable_HistoryRouter} from 'react-router-dom'
import axios, { Axios } from 'axios';
import jwt_decode from "jwt-decode";


// 1.useEffect(callback) (ít sài trong thực tế)
// - Gọi callback mỗi khi component re-render
// - Gọi callback sau khi component thêm element vào DOM

// 2.useEffect(callback,[])
// - Chỉ gọi callback 1 lần sau khi component mounted
// - Sử dụng khi muốn thực hiện 1 logic nào đó chỉ 1 lần sau khi được mounted và không muốn nó bị gọi lại khi re-render 
// 3.useEffect(callback,[deps]) deps ở đây là biến
// - Callback sẽ được gọi lại mỗi khi deps thay đổi

// 3.useLayoutEffect
// 1. Cập nhật lại state
// 2. Cập nhật DOM (muteted)
// 3. Gọi cleanup nếu deps thay đổi (sync)
// 4. Gọi useLayoutEffect callback (sync)
// 5. Render lại UI


// 4.useRef
// 1.Lưu lại các giá trị qua một tham chiếu bên ngoài
// Function component


//------Áp dụng cả 3 trường hợp-------------
// 1. Callback luôn được gọi sau khi component mounted
// 2. Cleanup function luôn được gọi trước khi component unmouted
// 3. Cleanup function luôn được gọi trước khi callback được gọi (trừ lần component được mounted)


// Khi unmouned component dù bất kì trương hợp nào (do người dùng,trường hợp đặc biệt...) thì cũng phải tính trước để Cleanup function để tránh rò rỉ bộ nhớ
const URL = `http://localhost:5000/admin/account`;

function Content(){

  const [email,setEmail] = useState("")
  const [password,setpassword] = useState("")
  const [account,setAccount] = useState([])

 
  useEffect(()=>{
    
  },[]);

   async function login(e){
    try{
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,password})
      // setEmail(response.data.email)
      // setpassword(response.data.password)
      console.log(response.data.token.accessToken);
      const token = response.data.token.accessToken
      var decoded = jwt_decode(token);
      console.log(decoded);
    }
    catch(error) {
      console.log(error);
    };
   }

  

return(
      <div>
        <div>
            <input
              name="username"
              placeholder="username" onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              name="password"
              placeholder="password" onChange={(e)=>setpassword(e.target.value)}
            />
          </div>
          <button onClick ={login}>submit</button>
        
      </div>

  )

}
export default Content




// const tabs = ['posts', 'comments', 'albums', 'photos', 'todos', 'users']
// function Content() {
//   const [title, setTitle] = useState('')
//   const [posts, setPosts] = useState([])
//   const [type, setType] = useState('posts')
//   const [showGoToTop,setShowGoToTop] = useState(false)


  
//   useEffect(() => {
//     fetch(`https://jsonplaceholder.typicode.com/${type}`)
//       .then(res => res.json())
//       .then(posts => {
//         setPosts(posts);
//       })
//   }, [type])



// Tạo nút move lên trên đầu
//   useEffect(()=>{
//     const handleScroll = ()=>{
//       if(window.scrollY >=200){
//         setShowGoToTop(true)
//       }else{
//         setShowGoToTop(false)
//       }

//       // setShowGoToTop(window.scrollY >=200) 
//       // Toan tử so sánh luôn trả về boalean nên viết nhanh chỉ cần dòng 45 là xong

//     }
//       window.addEventListener('scroll',handleScroll)
//       console.log('addEventListener');
      
//       // Cleanup Function: Nó sẽ chạy trước khi component unmouned và sẽ clear đi eventlistener để tránh rò rỉ bộ nhớ(memory leak)
//       return () => {
//         window.removeEventListener('scroll',handleScroll)
//         console.log('removeEventListener');
//       }

//   },[])

//   return (
//     <div >
//       {tabs.map(tab => (
//         <button key={tab} style={type === tab ? {
//           color: '#fff',
//           background: '#333'
//         } : {}} onClick={() => setType(tab)}>
//           {tab}
//         </button>
//       ))}

//       <input
//         value={title}
//         onChange={e => setTitle(e.target.value)}
//       />
//       <ul>
//         {posts.map(post => (
//           <li key={post.id}>{post.title || post.name}</li>
//         ))}
//       </ul>

//       {showGoToTop && (
//         <button style={{
//           position: 'fixed',
//           right:20,
//           bottom:20,
//         }}
//         >
//           Go to top
//         </button>
//       )}
//     </div>
//   );
// }


// Avatar 
// function Content(){
//   const [avatar,setAvatar] = useState()
 
//    useEffect(() =>{
 
//      return () =>{
//        avatar && URL.revokeObjectURL( avatar.preview)
//        // avatar && : nếu ko có avatar để khởi tạo thì chạy cái thứ 2. Nếu đã có avatar thì xóa đi để tránh rò rỉ
//        //Dùng để xóa bỏ url preview ảnh ra khỏi bộ nhớ để tránh rò rỉ bộ nhớ
//      }
//    },[avatar])
 
 
//    const handlePreviewAvatar = (e) =>{
//      const file = e.target.files[0]
 
//      file.preview = URL.createObjectURL(file)
//      //URL.createObjectURL dùng để tạo Obj để trở thành 1 url để có thể xem tạm ảnh
   
//      setAvatar(file)
//    }
 
   
//    return (
//      <div>
//        <input type="file" 
//        onChange ={handlePreviewAvatar}
//        />
//        {avatar &&(
//          <img src ={avatar.preview} alt ="background" width="80%"/>
//        )}
   
//      </div>
//    )
//  }




//Fake chat
// const lessons = [{
//   id:1,
//   name: 'ReactJS là gì? Tại sao nên học ReactJS'
// },
// {
//   id:2,
//   name:'SPA/MPA là gì?'
// },
// {
//   id:3,
//   name:'Arrow Function'
// }
// ]
// function Content(){
 
//   const [lessonId,setLessonId] = useState(1)

//   console.log(lessonId);
//   useEffect( () => {
//     const handleComment =({ detail}) =>{
//       console.log(detail);
//     }

//     window.addEventListener(`lesson-${lessonId}`,handleComment)


//     return () => {
//       window.removeEventListener(`lesson-${lessonId}`,handleComment)
//       console.log(`Đã gỡ bỏ cmt lesson-${lessonId}`);
//     }
//   },[lessonId])

//   return (
//     <div>
//       <ul>
//         {lessons.map(lesson =>(
//           <li 
//           key={lesson.id} 
//           style ={{
//               color : lessonId === lesson.id ? 'red' : '#333'
//           }}
//           onClick = {()=> setLessonId(lesson.id)}
//         >
//             {lesson.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }




// Count sử dụng uselayoutEffect để không bị nháy số
// function Content(){
//   const [count,setCounted] = useState(0)
 
//  useLayoutEffect(()=>{
//    if(count>3)
//      setCounted(0)
//  },[count])
 
 
//  const handleCount = ()=>{
//    setCounted(count + 1 )
//  }
//    return (
//      <div> 
//        <h1>{count}</h1>
//        <button onClick={handleCount}>Đếm</button>
//      </div>
//    )
//  }


// Đếm sô và stop

// function Content(){
//  const [count,setCounted] = useState(60)


//  const timerId = useRef()
//  const prevCount = useRef()
  
//  useEffect(()=>{
//   prevCount.current = count
//  },[count])

// const handleCount = ()=>{
//   timerId.current = setInterval(()=>{
//     setCounted(prev =>prev -1 )
//   },1000)

//   console.log('Start',timerId.current);
// }

// const handleStop = ()=>{
//   clearInterval(timerId.current)
//   console.log('Stop',timerId.current);
// }
// console.log(count,prevCount.current);

//   return (
//     <div> 
//       <h1>{count}</h1>
//       <button onClick={handleCount}>Đếm ngược</button>
//       <button onClick={handleStop}>Dừng đếm</button>
//     </div>
//   )
// }



//call api
// const URL = `http://localhost:5000/admin/account`;
// function Content(){

//   const [email,setEmail] = useState("")
//   const [password,setpassword] = useState("")
//   const [account,setAccount] = useState([])
 
//   useEffect(()=>{
//     const fetchData = async ()=>{
//       const result = await fetch(URL)
//       result.json().then(json=>{
//         setAccount(json)
//       })
//     }
//     fetchData();
//   },[]);


// return(
//       <div>
//         <ul>
//          {account.map(accounts => (
//           <div>
//             <li  key={accounts.id}>username:{accounts.username }</li>
//             <li key={accounts.id}>password:{accounts.password }</li>
//           </div>
          
          
//         ))}
//       </ul>
        
//       </div>

//   )

// }
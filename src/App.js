import { useState,useEffect} from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Content from './content';
import { publicRouters } from './routes';
import DefaultLayout from './Component/Layout/DefaultLayout';
import { Fragment } from 'react';
function App() {


  return (
    <Router>
      <div className="App" style={{padding:20}}>
        <Routes>
          {publicRouters.map((route,index) =>{
          
            const Page = route.component;

            let Layout = DefaultLayout
            
            if(route.layout ){
              Layout= route.layout
              
            }else if(route.layout === null){
              Layout = Fragment
            }

            return (
            <Route 
            key={index} 
            path={route.path}
             element={
             <Layout>
              <Page/>
             </Layout>
             }
             />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}




export default App;

// function App() {

//   const gifts =['Quang','Lập','Thắng','Tuấn','Phương','Uyên']
//   const [gift,setGift] = useState()
  
//   const randomGift = () =>{
//     const index = Math.floor(Math.random() * gifts.length)
//     setGift(gifts[index]);
//   }
  
//   return (
//     <div className="App" style={{padding:20}}>
//     <h1>{gift || 'Chưa tìm được người nhận thưởng'}</h1>
//     <button onClick={randomGift}>Tìm người trúng thưởng</button>
//     </div>
//   );
// }









// function App() {

//   const gifts =['Quang','Lập','Thắng','Tuấn','Phương','Uyên']
//   const [gift,setGift] = useState()
  
//   const randomGift = () =>{
//     const index = Math.floor(Math.random() * gifts.length)
//     setGift(gifts[index]);
//   }
  
//   return (
//     <div className="App" style={{padding:20}}>
//     <h1>{gift || 'Chưa tìm được người nhận thưởng'}</h1>
//     <button onClick={randomGift}>Tìm người trúng thưởng</button>
//     </div>
//   );
// }


// function App() {
//   const [checked ,setChecked] = useState([])

//   console.log(checked);
//   const handleCheck = (id) =>{
//     setChecked(prev =>{
//       const isChecked = checked.includes(id)
//       if(isChecked){
//         return checked.filter(item=> item !== id)
//       }
//       else{
//         return [...prev,id]
//       }

//     })
//   }

//   const handleSubmit = ()=>{
//     console.log({ids : checked});
//     // sau {} sẽ tự động biến data bên trong thành dạng object
//   }

  
//   return (
//     <div className="App" style={{padding:20}}>
//       {courses.map(course => (
//         <div key = {course.id}>
//           <input type="checkbox" 
//           checked ={checked.includes(course.id)}
//           onChange={()=>handleCheck(course.id)}
//           />
//         {course.name}
//         </div>
//       ))}
//       <button onClick={handleSubmit}> Register</button>
//     </div>
//   )
// }





// function App() {
//   // cách này làm được nhưng sẽ khiến web phải render lại mỗi lần thực hiện cú pháp parse
//    // const storageJobs = JSON.parse(localStorage.getItem('jobs'))
//    // console.log(storageJobs);
 
//    // const [jobs,setJobs] = useState(storageJobs ?? [])
//    // ??: nếu thằng đằng trước là Null hoặc undifined thì sẽ lấy thằng đằng sau
 
 
//    const [job,setJob] = useState('')
//    // ghi như này thì tối ưu hơn thì ko phải render lại sau lần add thứ 2
//    const [jobs,setJobs] = useState(()=>{
//      const storageJobs = JSON.parse(localStorage.getItem('jobs'))
//      console.log(storageJobs);
//      return storageJobs
//    })
 
 
//    const handleSubmit = ()=>{
//      if(job===""){
//        setJob("");
//        setJobs(jobs)
//        alert("vui lòng nhập thông tin vào ô input")
//      }
//      else{
//        setJobs(prev => {
//          const newJobs = [...prev,job]
   
//          //Save to local storage
//          const jsonJobs = JSON.stringify(newJobs)
//          localStorage.setItem('jobs',jsonJobs)
   
//          return newJobs
//        })
//        setJob('')
//      }
 
//    }
 
//    const handleDelete = (job)=>{
//      let deleteItem = jobs.filter((item)=> item !== job);
//      const jsonjob = JSON.stringify(deleteItem);
//      localStorage.setItem("jobs",jsonjob)
//      setJobs(deleteItem)
//    }
 
//    const handleEdit = (index) =>{
     
//      if(job===""){
//        alert("vui lòng nhập thông tin vào ô input")
//      }
//      else{
//        jobs.splice(index,1,job)
//        const jsonjob = JSON.stringify(jobs)
//        localStorage.setItem("Jobs",jsonjob)
//        setJobs(jobs)
//        setJob("")
//      }
//    }
 
//    return (
//      <div className="App" style={{padding:20}}>
//        <input 
//        value={job} 
//        onChange={e => setJob(e.target.value)}
//        />
//        <button onClick={handleSubmit}>Add</button>
//      <ul>
//        {jobs.map((job,index) =>(
//          <div style={{display:"flex"}}>
//            <li key = {index} style ={{marginRight:"40px",flex: 1}}> {job} </li>
           
//            <button onClick={()=>handleDelete(job)} 
//            style ={{marginRight:"40px"}}>Delete 
//            </button>
           
//            <button onClick={()=>handleEdit(index)} 
//            style ={{marginLeft:"40px"}}>
//              Edit 
//              </button>
//          </div>
         
//        ))}
       
//      </ul>
 
 
//      </div>
//    );
//  }


// function App() {

//   const [show,setshow] = useState(false)
//   return (
//     <div className="App" style={{padding:20}}>
//       {/* <button onClick={()=> setshow(!show)}>Toggle</button>
//       {show && <Content/>} */}
//       <Header></Header>
//     </div>
//   );
// }

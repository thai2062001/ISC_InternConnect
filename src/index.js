import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './Component/GlobalStyles';
const root = ReactDOM.createRoot(document.getElementById('root'));

//Fake comment

// function emitComment(id){
//     setInterval(() => {
//       window.dispatchEvent(
//         new CustomEvent(`lesson-${id}`,{
//           detail:`Nội dung comment của lesson ${id}`
//         })
//       )
//     },2000)
// }

// emitComment(1)
// emitComment(2)
// emitComment(3)

root.render(
  <React.StrictMode>
    <GlobalStyles>
      <App />
      </GlobalStyles>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

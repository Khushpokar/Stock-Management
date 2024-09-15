// src/utils/loadStyles.js
export const loadStyles = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL('./AuthForm.css', import.meta.url).href; // Path to your Home.css file
    document.head.appendChild(link);

    const link2 =  document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = new URL('bootstrap/dist/css/bootstrap.min.css', import.meta.url).href; // Path to your Home.css file
    document.head.appendChild(link2);

    const link3 =  document.createElement("link");
    link3.rel = "stylesheet";
    link3.href = new URL('./OtpVerification.css', import.meta.url).href; // Path to your Home.css file
    document.head.appendChild(link3);
    // Cleanup the CSS when component is unmounted
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  };

export const bootstrapload =()=>{
    
  const link2 =  document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = new URL('bootstrap/dist/css/bootstrap.min.css', import.meta.url).href; // Path to your Home.css file
  document.head.appendChild(link2);

  

  const link3 =  document.createElement("link");
  link3.rel = "stylesheet";
  link3.href = new URL('./OtpVerification.css', import.meta.url).href; // Path to your Home.css file
  document.head.appendChild(link3);

  

  return () => {
    document.head.removeChild(link2);
    document.head.removeChild(link3);
  };

};
  
export const Growwload =()=>{

  
  const link3 =  document.createElement("link");
  link3.rel = "stylesheet";
  link3.href = new URL('./Groww.css', import.meta.url).href; // Path to your Home.css file
  document.head.appendChild(link3);
    
  const link2 =  document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = new URL('bootstrap/dist/css/bootstrap.min.css', import.meta.url).href; // Path to your Home.css file
  document.head.appendChild(link2);

  


  

  return () => {
    document.head.removeChild(link2);
    document.head.removeChild(link3);
  };

}
const fs=require('fs')
fs.readFile('./docs/data.txt',(error,data)=>{
    if(error){
        console.log(error)
        return
    }
    console.log(data);
})
//write the text
fs.writeFile('./docs/example.txt','this is written from node js.',()=>{ 
    console.log("success......");
})
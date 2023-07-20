var http = require('http')
var fs=require('fs')
// console.log(http)
var server=http.createServer((req,res)=>{
    console.log('request made...');
     console.log(req.method,req.url);
     res.setHeader('content-Type','text/html')
     var path='./views/'
     switch(req.url)
     {
        case '/':
            path=path+'index.html'
            res.statusCode=200 //successful response
            break;
        
        case '/about':
            path=path+'about.html'
            res.statusCode=200
            break;
            default:
                path=path+"404.html"
                res.statusCode=404 //not found
                break;
           
     }
     fs.readFile(path, (error,data)=>{
        if (error){
           console.log(error.message)
           res.end(error.message)
       }

       res.end(data)

    })
})

server.listen(4000,'localhost',()=>{
    console.log('listening on port 4000...')
})

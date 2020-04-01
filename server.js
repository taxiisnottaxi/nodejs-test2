var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /************** 从这里开始看，上面不要看 ****************/

  // console.log('有个傻子发请求过来啦！路径（带查询参数）为 ' + pathWithQuery)

  if(path === '/'){
    var string = fs.readFileSync('./index.html', 'utf-8')    // 同步读取文件
    var amount = fs.readFileSync('./db', 'utf-8')    // 同步读取出来的数据类型还是string的
    string = string.replace('&&&amount&&&', amount)    // 这边是使用替换将原先字符串中的&&&amount&&&替换成db
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/style.css'){
    var string = fs.readFileSync('./style.css', 'utf-8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){
    var string = fs.readFileSync('./main.js', 'utf-8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()
  }else if(path === '/pay'){
      var amount = fs.readFileSync('./db', 'utf-8')
      var newAmount = amount - 1
      fs.writeFileSync('/db', newAmount)
      response.setHeader('Content-Type', 'application/javascript')
      response.statusCode = 200
      // response.write(`
      //   alert("success")
      //   window.location.reload()
      //   `)   // 服务器返回的在浏览器执行的JS代码，提示成功并刷新网页
      // 说明jack.com的后端程序员需要对frank.com的页面细节了解的很清楚
      // 耦合
      // response.write('amount.innerText = amount.innerText - 1')  //直接局部刷新，不做整体刷新
      response.write(`
        ${query.callback}.call(undefined, 'success')
      `)
      response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('找不到对应的路径，你需要自行修改 index.js')
  }

  console.log(method + ' ' + request.url)
  /************** 从这里结束，下面不要看 ****************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度后然后用电饭煲打开 http://localhost:' + port)
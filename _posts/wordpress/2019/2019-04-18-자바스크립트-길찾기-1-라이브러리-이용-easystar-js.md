---
title: "자바스크립트: 길찾기 1 (라이브러리 이용 - EasyStar.js)"
date: 2019-04-18
categories: 
  - "DevLog"
  - "JavaScript"
---

길찾기 알고리즘에는 여러가지가 있는데 **A\* (A Star)**라는 알고리즘이 많이 사용된다고 합니다.

라이브러리중에 **EasyStar.js** ([https://www.easystarjs.com/](https://www.easystarjs.com/)) 라는게 있는데 이걸로 길찾기 알고리즘을 직접 구현하지 않고도 사용할 수 있습니다.

```
window.onload = function() {
  
  var startPoint = {x:0, y:0}
  var endPoint = {x:4, y:0}
  
  // EasyStar.js 선언
  var es = new EasyStar.js();

  var map = [
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 2, 2, 2, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0]
  ];

    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");

      var img = new Image(); // Create new img element
      img.src = './img/sprite.png'; // Set source path

      // Draw slice
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

      
      var drawMap = function(){
        ctx.clearRect(0, 0, 300, 300)
        var dx = 0                     
        var dy = 0
        for(var i in map){ 
          for(var j in map[i]){
            if(map[i][j] == 1){
              // 돌
              ctx.drawImage(img, 50, 0, 50, 50, dx, dy, 50, 50);
              dx += 50
            } else if (map[i][j] == 2){
              // 물
              ctx.drawImage(img, 0, 50, 50, 50, dx, dy, 50, 50);
              dx += 50
            } else if (map[i][j] == 0){
              // 빈 공간
              ctx.drawImage(img, 50, 50, 50, 50, dx, dy, 50, 50);
              dx += 50
            }
          }dx = 0
          dy += 50
        }
        
        // 도착지
        ctx.fillStyle = "rgb(230,220,0)";
        ctx.fillRect (50 * endPoint.x , 50 * endPoint.y, 50, 50);
        
      }

      drawMap()
      

      
      $("#btnRun").on("click", function(){
        
        drawMap();
        
        // 사람
        ctx.drawImage(img, 0, 0, 50, 50, startPoint.x, startPoint.y, 50, 50);
        
        // 지도(배열) 지정
        es.setGrid(map)
        
        if($("#avoidWater").is(":checked")){
          es.setAcceptableTiles([0, 2]); // 건널 수 있는 타일 설정 (0: 풀, 2: 물)
        } else {
          es.setAcceptableTiles([0]);
        }
        
        // 길찾기 부분 작성
        // findPath(startX, startY, endX, endY, callback);
        es.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, function(path) {
          if (path === null) {
            console.log("Path was not found.");
          } else {
            console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
            console.log(path)
            var ix = 0
            setInterval(function(){
              if(ix <= path.length - 1) {
                console.log(path[ix].x, path[ix].y)
                drawMap()
                // 사람
                ctx.drawImage(img, 0, 0, 50, 50, path[ix].x * 50, path[ix].y * 50, 50, 50);
                ix++
              }
             
            }, 500)

          }
        });
         // 길찾기 부분 실행(invoke)
         es.calculate()
      })
      
    }
  }

```

```
<body>

  <div>
    <canvas id="canvas" width="300" height="300"></canvas>
  </div>
  <input type="checkbox" id="avoidWater">물 건너기
  <button id="btnRun">길찾기</button>

</body>
```

 

 ![](/assets/img/wp-content/uploads/2019/04/pathr1.gif)               ![](/assets/img/wp-content/uploads/2019/04/pathr2.gif)

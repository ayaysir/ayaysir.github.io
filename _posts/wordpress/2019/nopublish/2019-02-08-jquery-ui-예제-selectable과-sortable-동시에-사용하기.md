---
published: false
title: "JQuery UI 예제: Selectable과 Sortable 동시에 사용하기"
date: 2019-02-08
categories: 
  - "DevLog"
  - "JavaScript"
---

JQuery UI (일반 JQuery와는 별개인 파생 프로젝트, [https://jqueryui.com/](https://jqueryui.com/)) Selectable과 Sortable 동시에 사용하기 예제이다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
 
    <style>
        #sortable1,
        #sortable2 {
            border: 1px solid #eee;
            width: 98%;
            min-height: 20px;
            list-style-type: none;
            margin: 0;
            padding: 5px 0 0 0;
            float: left;
            margin-right: 10px;
        }
        #sortable1 .ui-selecting {
            background: background: #FECA40;
        }
        #sortable1 .ui-selecting .handle {
            background: background: #FECA40;
        }
        #sortable1 .ui-selected {
            background: #F39814;
            color: white;
        }
        #sortable1 .ui-selected .handle {
            background: #F39814;
            color: white;
        }
        #sortable1 li,
        #sortable2 li {
            border: 1px dotted grey;
            margin: 0 5px 5px 5px;
            padding: 5px;
            font-size: 1.1em;
            width: 120px;
        }
        .element:hover {
            cursor: move;
            cursor: -webkit-grab;
            cursor: grab;
        }
        .element.grabbing {
            cursor: grabbing;
            cursor: -webkit-grabbing;
        }
    </style>
</head>
 
<body>
    <ul id="sortable1" class="connectedSortable">
    </ul>
</body>
 
<script>
    $(document).ready(() => {
 
        // 다중 반복 요소 추가(HTML 단독)
        var $img = $('<img/>', {
            "class": 'element',
            src: 'https://www.ourkids.com/wp-content/uploads/2018/11/Education-Category-small.png'
        })
        for (i = 1; i <= 8; i++) {
            $('#sortable1').append($('<li/>', {
                "class": "ui-state-default"
            }).append($img.clone()).append("역사이펀" + i))
        }
 
 
        // SORTABLE
        $(function() {
            $("#sortable1").sortable({
                handle: ".handle"
            });
            $("#sortable1").selectable({
                // 한 개만 선택되도록
                selecting: function(event, ui) {
                    if ($(".ui-selected, .ui-selecting").length > 1) {
                        $(ui.selecting).removeClass("ui-selecting");
                    }
                },
                filter: "li",
                cancel: ".handle"
            });
            $('#sortable1')
                .find("li").addClass("ui-corner-all")
                .find("img").addClass("handle")
 
            // $( "#sortable1" ).disableSelection();
        });
 
        // 이미지에 마우스 올리면 커서 모양 바뀌게 하기
        $(".element").on("mousedown touchstart", function(e) {
            $(this).addClass('grabbing')
        })
 
        $(".element").on("mouseup touchend", function(e) {
            $(this).removeClass('grabbing')
        })
 
    })
</script>
</html>

```

 ![](/assets/img/wp-content/uploads/2019/02/reverse.gif)

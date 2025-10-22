---
title: "JQuery: 단위 변환 (pixel - mm - inch)"
date: 2019-01-08
categories: 
  - "DevLog"
  - "JavaScript"
---

공식은 다음과 같습니다. ([https://www.pixelto.net/px-to-mm-converter](https://www.pixelto.net/px-to-mm-converter))

```
Dpi is the pixel density or dots per inch.
96 dpi means there are 96 pixels per inch.
1 inch is equal to 25.4 millimeters.

1 inch = 25.4 mm
dpi = 96 px / in
96 px / 25.4 mm

Therefore one pixel is equal to
1 px = 25.4 mm / 96
1 px = 0.26458333 mm

1 mm = 0.0393701 inch (∵ 1/25.4)
```

DPI는 사용자의 환경에 따라 달라지는데 여기서는 96으로 가정합니다.

```
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
</head>

<body>
    <input type=number class=numberField>
    <select class=selectMeasure>
        <option>pixel</option>
        <option>mm</option>
        <option>inch</option>
    </select>
    <script>
        // 190108: 픽셀 단위 변환 (DPI 96이라고 가정)
        function measureConverter(targetObj, measurement) {

            var beforeMeasurement = targetObj.data("measurement")
            // alert(measurement + " : BEF : " + beforeMeasurement)

            var DPI = 96
            var one_px_on_mm = 25.4 / DPI // 1px = 0.26458mm

            var standardPx = 0;
            var convertedValue = 0;
            if (beforeMeasurement == 'mm') {
                standardPx = targetObj.val() / one_px_on_mm
            } else if (beforeMeasurement == 'inch') {
                standardPx = (targetObj.val() * DPI)
            } else {
                standardPx = targetObj.val()
            }
            if (measurement == 'mm') {
                convertedValue = one_px_on_mm * standardPx // mm			
            } else if (measurement == 'inch') {
                convertedValue = standardPx / DPI
            } else {
                convertedValue = standardPx
            }
            targetObj.val(convertedValue)
            targetObj.data("measurement", measurement)
            targetObj.data("standardPx", standardPx)
        }

        $('.selectMeasure').change(function() {
            measureConverter($(this).prev(), $(this).find(":selected").text())
        })
        $('.numberField').change(function() {
            measureConverter($(this), $(this).next().find(":selected").text())
        })
    </script>
</body>

</html>

```

JSFiddle 에서 실행 ([https://jsfiddle.net/vgnbu2cp/](https://jsfiddle.net/vgnbu2cp/))

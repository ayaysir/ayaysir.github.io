---
title: "PHP: 이미지 섬네일(Thumbnail) 만들기 (Imagick 이용)"
date: 2020-12-26
categories: 
  - "DevLog"
  - "PHP"
---

_Imagick_이 PHP 서버에 설치된 경우, 아래 코드를 이용하여 이미지 섬네일을 만들 수 있습니다. 저는 이용하는 호스팅 서버에 해당 프로그램이 설치가 되어 있어 별도 작업을 하지 않고 바로 사용하지만, 설치가 안된 경우에는 [링크](https://www.itopening.com/5245/)를 참고하여 설치하세요.

##### **다음 함수를 추가합니다.**

```
/**
 * 
 * Generate Thumbnail using Imagick class
 *  
 * @param string $img
 * @param string $width
 * @param string $height
 * @param int $quality
 * @return boolean on true
 * @throws Exception
 * @throws ImagickException
 */
function generateThumbnail($img, $width, $height, $quality = 90)
{
    if (is_file($img)) {
        $imagick = new Imagick(realpath($img));
        $imagick->setImageFormat('jpeg');
        $imagick->setImageCompression(Imagick::COMPRESSION_JPEG);
        $imagick->setImageCompressionQuality($quality);
        $imagick->thumbnailImage($width, $height, false, false);
        $path_parts = pathinfo($img);

        // echo $path_parts['dirname'], "\n";// 디렉토리 경로 - 파일이름만 사용하는 경우 ['dirname']은 사용하지 않음
        // echo $path_parts['filename'], "\n"; // 파일이름(확장자 제외)
        $filename_no_ext = $path_parts['dirname']."/".$path_parts['filename'];
        
        if (file_put_contents($filename_no_ext . '_thumb' . '.jpg', $imagick) === false) {
            throw new Exception("Could not put contents.");
        }
        return true;
    }
    else {
        throw new Exception("No valid image provided with {$img}.");
    }
}
```

- `$img` - 이미지 경로와 파일이름. (파일이름을 단독으로 사용하면 php 파일이 있는 디렉토리에 저장됨)
- `$width` - 섬네일의 가로 크기 (px)
- `$height` - 섬네일의 세로 크기 (px)
- `$quality` - JPEG 품질 (0~100). 기본값 90

 

참고: 경로 및 파일 이름, 확장자 가져오기 ([PHP, get file name without file extension](https://stackoverflow.com/questions/2183486/php-get-file-name-without-file-extension))

##### **사용 예시입니다.**

```
try {
    generateThumbnail('example.jpeg', 240, 134, 65);
}
catch (ImagickException $e) {
    echo $e->getMessage();
}
catch (Exception $e) {
    echo $e->getMessage();
}
```

이 코드가 실행되면 원본 파일과 동일한 위치에 섬네일 파일이 생성됩니다.

 ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-26-오후-11.34.15.png)

 

출처: [Creating a thumbnail from an uploaded image](https://stackoverflow.com/questions/11376315/creating-a-thumbnail-from-an-uploaded-image)

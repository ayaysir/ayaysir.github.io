---
title: "스프링 부트 (Spring Boot): mp3을 전송하는 컨트롤러 - 크롬 및 사파리(Safari) 브라우저에서 구간 탐색이 안되는 문제 해결 방법"
date: 2020-08-15
categories: 
  - "DevLog"
  - "Spring/JSP"
---

주소를 입력하면 MP3 파일을 다운받을 수 있는 컨트롤러를 만들고 있었습니다. 먼저 아래 글을 먼저 참고하세요. 그리고 글에 사족이 많습니다. 전체 코드는 맨 밑에 있습니다.

- 참고:[JSP, Spring: URL을 입력하면 파일이 바로 다운로드되게 하기](http://yoonbumtae.com/?p=684)

 

파일 다운로드도 잘 되고 재생도 되었습니다만, 크롬과 사파리(맥, iOS)에서 `<audio>` 태그에 넣으면 구간 탐색이 안되는 문제가 있었습니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-10.48.58.png)위는 사파리 스샷입니다. MP3 파일을 소스에 배정했는데 "`라이브 방송(live broadcast)`"이라면서 재생만 되고 일시정지조차 제대로 되지 않는 문제가 있었습니다. 게다가 파일도 끝부분을 제대로 읽어들이지 못하고 있었습니다.

먼저 크롬에서는, 헤더를 추가하는 것으로 간단하게 해결됩니다. 컨트롤러에 아래 헤더들을 추가하면 구간 탐색이 정상적으로 됩니다. (전체 코드는 밑에 있습니다.)

```
response.setHeader("Accept-Ranges", "bytes");
response.setHeader("Content-Length", initFile.length() + "");
```

`“Accept-ranges”`를 `“bytes”`로 설정하고, `“Content-Length”`에 바이트 단위로 파일 길이를 넣어주면 됩니다. ([MDN 링크](https://developer.mozilla.org/ko/docs/Web/HTTP/Range_requests))

 

문제는 사파리입니다. 사파리에서는 `<audio>` 태그에서 욕이 나올 만큼 황당한 문제가 있었습니다. 사파리에서는 mp3를 불러올 때 0-1 바이트 범위의 처음 2바이트의 의미 없는 리퀘스트를 보냅니다. 그 리퀘스트에서 제대로 된 응답이 없으면, 이 파일은 제대로된 파일이 아니라고 간주하고 멋대로 "`라이브 방송`"이라는 메시지를 띄우며 구간 탐색은 물론 일시정지도 제대로 못하게 합니다. 맨 처음 스샷 리퀘스트의 `Range: byte=0-1` 부분입니다.

 

해외에서도 이 문제는 오래 전부터 존재했던 것 같습니다. 스택오버플로에서 관련 글 하나를 링크합니다.

- [HTML5 <audio> Safari live broadcast vs not](https://stackoverflow.com/questions/1995589/html5-audio-safari-live-broadcast-vs-not)

이 글에서 자세한 해결 방법을 알려주지 않았으나, 사파리 리퀘스트 과정이 독특하며 Range에 대응하라는 답변이 나왔습니다. "Safari는 미디어를 다운로드하는 데 완전히 뇌손상을 입은(braindamaged) 접근 방식을 가지고 있습니다."라는 평까지 나왔습니다. (전적으로 동감하는 바입니다.)

이러한 해결 방법을 바탕으로 문제를 해결하려 했으나, 리퀘스트 범위가 0~1바이트라는게 무슨 의미인지도 몰랐고, 기존의 `FileInputStream`으로는 파일의 일부를 잘라 전하는 방법을 찾기 어려웠습니다.

자바에서 파일을 어떻게 잘라야하나 알아보는 중에 `RandomAccessFile`이라는 것이 있었습니다. 여기의 `seek()` 메소드를 이용하면 파일의 특정 위치부터 탐색 한 뒤, 잘라서 전송할 수 있습니다.

 

```
try(RandomAccessFile randomAccessFile = new RandomAccessFile(initFile, "r");
    ServletOutputStream sos = response.getOutputStream();	){

    Integer bufferSize = 1024, data = 0;
    byte[] b = new byte[bufferSize];
    Long count = startRange;
    Long requestSize = endRange - startRange + 1;

    randomAccessFile.seek(startRange);
    while(true) {

        if(requestSize <= 2) {
            sos.flush();
            break;
        }

        data = randomAccessFile.read(b, 0, b.length);

        if(count <= endRange) {
            sos.write(b, 0, data);
            count += bufferSize;
            randomAccessFile.seek(count);
        } else {
            break;
        }

    }

    sos.flush();
}

```

`RandomAccessFile`에 대한 것은 추후 따로 글을 작성하도록 하겠습니다. 위의 예제 코드를 보면 `randomAccessFile`을 생성하고, `seek(시작 지점)` 으로부터 `read`할 수 있는 기능이 있습니다. 요청 범위에 맞게 파일을 잘라 `sos`에 `write()` 한 후 `flush()` 하면 됩니다.

이러한 방법으로 파일의 1~2바이트를 전송하려고 시도하였습니다. 하지만 사파리가 처음에 요청한 0-1 범위 리퀘스트는 파일을 1~2바이트로 잘라서 보내라는 의미가 아니었습니다. 저는 계속 파일을 1바이트만 보낼 수 있을지 고민하고 있었는데, 사실은 1바이트를 보내라는 게 아니었던 것 같습니다.

 

```
if(requestSize < bufferSize) {
    // Range byte 0-1은 아래 의미가 아님.
    // data = randomAccessFile.read(b, 0, requestSize.intValue());
    // sos.write(b, 0, data);

    sos.flush();
    break;
}
```

위의 주석 처리한 부분은 동작이 되지 않았는데, 여러 시도를 해보다 혹시나 해서 그냥 아무 데이터도 넣지 않고 `sos.flush()` 만 시켰는데 이렇게 하니 어이없게도 사파리에서도 "`라이브 방송`"이 사라지고 구간 탐색이 가능해지게 되었습니다.

 

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-11.28.12.png)

아직 파일을 분할하는 과정에서 약간의 속도 지연이 있거나, 혹시 파일 무결성에 손상이 있지 않을 지 문제를 더 살펴봐야겠지만, 일단 mp3 파일은 원래 파일대로 잘 읽고 탐색도 잘 되는 것 같습니다.

아이폰에서도 정상 동작합니다.

 ![](/assets/img/wp-content/uploads/2020/08/IMG_1493.png)

 

#### **소스 코드**

https://gist.github.com/ayaysir/dea411fa31e7d638f1e637e8fcc131f1

---
title: "Java 예제: URL로부터 파일 다운로드(ReadableByteChannel 이용)"
date: 2019-01-21
categories: 
  - "DevLog"
  - "Java"

tags: 
  - "java"
---

웹브라우저를 통하지 않고 자바 자체에서 파일 다운로드를 하는 예제입니다. `Channels`는 유틸리티 메소드로 `Channel`과 `Stream`에 필요한 작업들을 제공합니다. `new Channel(InputStream in)`은 인풋스트림(`InputStream`)을 새로운 `ReadableByteChannel`(채널)로 만들어주는데, **`Channel`**이란 하드웨어 장치, 파일, 네트워크 소켓 또는 하나 이상의 고유 한 I/O 작업을 수행 할 수 있는 프로그램 구성 요소와 같은 엔터티에 대한 열린 연결을 나타내는 것이라고 합니다. 파일을 주고받기 위한 일종의 통로(nexus)로 해석하면 되겠습니다. 파일 작성을 위한 스트림인 `FileOutputStream`에서 채널을 받은 다음(`getChannel()`, `FileChannel` 타입 반환) 채널의 `transferForm` 메소드를 사용해 파일을 rbc 채널로부터 읽어 FOS로 전송합니다.

참고: [Channel](https://docs.oracle.com/javase/7/docs/api/java/nio/channels/Channel.html), [ReadableByteChannel](https://docs.oracle.com/javase/7/docs/api/java/nio/channels/ReadableByteChannel.html), [Channels](https://docs.oracle.com/javase/7/docs/api/java/nio/channels/Channels.html)

```
import java.io.FileOutputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

public class FileDownload {

  public static void main(String[] args) {
    String address = "https://www.7-zip.org/a/7z1806-x64.exe";	// 주소 입력
    
    try {
      String fileName = address.substring(
          address.lastIndexOf("/") + 1, address.length());

      URL website = new URL(address);
      ReadableByteChannel rbc = Channels.newChannel(website.openStream());
      FileOutputStream fos = new FileOutputStream(fileName);
      
      fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);	// 처음부터 끝까지 다운로드
      fos.close();
      
      System.out.println("파일 다운로드되었음");
      
    } catch (Exception e) {
      e.printStackTrace();
    } 		
    
  }

}
```

```
파일 다운로드되었음
```

 ![](/assets/img/wp-content/uploads/2019/01/fileDownload-e1568811595888.png)

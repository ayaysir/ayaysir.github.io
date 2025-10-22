---
title: "자바(Java)에 프로세싱(Processing) 라이브러리 Minim을 설치하는 방법 + 예제: 주파수 그래프가 있는 오디오 플레이어"
date: 2019-03-11
categories: 
  - "DevLog"
  - "Java"
  - "Processing"
---

노래 파일을 불러와 500 구간으로 쪼갠 뒤 각각 구간의 평균 주파수를 리스트에 삽입해 **_사운드클라우드_**의 플레이어 비슷한 효과를 내는 예제입니다. 이 기능을 사용하려면 Minim이라는 Processing기반의 라이브러리가 필요합니다. (참고: [Processing: 미디어아트 프로그래밍 언어 기초](http://yoonbumtae.com/?p=500))

 

### Minim을 사용해 음악 파일의 주파수를 분석

-  주파수 분석은 고속 푸리에 변환(FFT) 방식.
-  **Minim**은 음악 재생, 분석과 관련하여 다양한 기능을 제공하는 외부 라이브러리로 원래 **Processing** 언어의 라이브러리인데 프로세싱 언어 자체가 JVM 기반이므로 자바에서도 사용 가능.

Minim은 원래 자바의 라이브러리가 아니었기 때문에 사용은 가능하더라도 별도의 설정 과정을 거쳐야 합니다.

#### 1\. Maven Dependency(혹은 외부 jar 파일) 추가

```
<repositories>
    <repository>
        <id>clojars-repository</id>
        <name>Clojars Repository</name>
        <url>http://clojars.org/repo/</url>
    </repository>
</repositories>
 
    <!-- https://mvnrepository.com/artifact/ddf.minim/ddf.minim -->
    <dependency>
        <groupId>ddf.minim</groupId>
        <artifactId>ddf.minim</artifactId>
        <version>2.2.0</version>
    </dependency>
```

[https://mvnrepository.com/artifact/ddf.minim/ddf.minim/2.2.0](https://mvnrepository.com/artifact/ddf.minim/ddf.minim/2.2.0)

 

#### 2\. MP3 파일의 주파수를 분석하는 코드 작성.

**코드**: [https://gist.github.com/ayaysir/09d47421dd3f72e94262a715e6cb2f67](https://gist.github.com/ayaysir/09d47421dd3f72e94262a715e6cb2f67)

https://gist.github.com/ayaysir/09d47421dd3f72e94262a715e6cb2f67

 

대략적인 과정은

- MP3 파일을 읽고 파일의 정보를 바탕으로 `ddf.minim.analysis.FFT` 객체를 생성하는데, `timeSize`(버퍼 사이즈) 설정시 **2의 제곱의 수만 가능**하므로 제곱의 수와 제일 근접한 `timeSize`를 설정할 수 있도록 하였습니다. 500으로 나눈 이유는 그래프의 x축 개수를 500개로 정했기 때문입니다.
- 음악 파일의 전체 스펙트럼을 2차원 배열로 내보낸 뒤 2차원 배열의 `timeSize`당 부분을 평균을 산출해 단일 배열로 옮깁니다.
- `min`, `max` 정보는 오디오 플레이어에서 그래프를 그리는 기준을 잡는 데 사용합니다.
- Minim을 사용하려면 복잡한 과정을 거쳐야되는데 **MinimImpl**이라는 클래스에서 `getInstance`로 간단하게 줄일 수 있다. ([https://github.com/ddf/Minim/issues/48](https://github.com/ddf/Minim/issues/48))

 

**MinimImpl**을 패키지 내에 위치시킨 후 임포트해서 다음과 같이 사용합니다. `Minim minim = MinimImpl.getMinimInstance();`

```
import ddf.minim.Minim;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 * This is a simple implementation of Minim requirements in order to be able to
 * use it outside Processing; in plain Java programs.
 *
 * Usage:
 * Minim instance = MinimImpl.getMinimInstance();
 *
 * Quote from Minim documentation:
 * -----------------------------------------------------------------------------
 * If you are using Minim outside of Processing, then the constructor of Minim
 * requires an Object that can handle two important file system operations
 * so that it doesn’t have to worry about details of the current environment.
 *
 * These two methods are:
 *      String sketchPath( String fileName )
 *      InputStream createInput( String fileName )
 *
 * These are methods that are defined in Processing,
 * which Minim was originally designed to cleanly interface with.
 * The sketchPath method is expected to transform a filename into an absolute path and
 * is used when attempting to create an AudioRecorder (see below).
 * The createInput method is used when loading files and is expected to take a filename,
 * which is not necessarily an absolute path, and return an InputStream that
 * can be used to read the file.
 * For example, in Processing, the createInput method will search in the data folder,
 * the sketch folder, handle URLs, and absolute paths.
 * If you are using Minim outside of Processing,
 * you can handle whatever cases are appropriate for your project.
 * -----------------------------------------------------------------------------
 *
 * Author : Gregory Kotsaftis
 * License: Public Domain.
 */
public final class MinimImpl {

    /**
     * Use this method to obtain a valid Minim instance!
     */
    public static Minim getMinimInstance()
    {
        return new Minim(new MinimImpl());
    }

    /**
     * Override required method.
     */
    public String sketchPath(String fileName)
    {
        return( new File(fileName).getAbsolutePath() );
    }

    /**
     * Override required method.
     */
    public InputStream createInput(String fileName)
        throws FileNotFoundException
    {
        return( new FileInputStream(new File(fileName)) );
    }

}
```

#### 3\. 만들어진 주파수 정보를 바탕으로 오디오 플레이어(자바스크립트) 제작

**코드**: [https://gist.github.com/ayaysir/30c05be68e9201bcf6a9c56d9231741c](https://gist.github.com/ayaysir/30c05be68e9201bcf6a9c56d9231741c)

**결과**: [http://yoonbumtae.com/music/pastorale/](http://yoonbumtae.com/music/pastorale/)

https://gist.github.com/ayaysir/30c05be68e9201bcf6a9c56d9231741c

 

![](./assets/img/wp-content/uploads/2019/03/스크린샷_2018-11-11_오후_10.32.56.png)

지금은 각 과정이 전부 따로 진행되고 있지만, 만약 실제로 서비스할 수 있는(사운드클라우드와 비슷한) 오디오 플레이어를 **전통적 MVC 웹 서비스 형태**로 제작한다고 한다면

- 음악의 주파수 분석은 파일 업로드 후 최대한 빠르게 진행되어야 합니다
- 매 재생마다 주파수를 분석하는게 아닌 최초 한 번만 분석한 뒤 데이터베이스에 저장하는 형태가 좋을 것 같습니다.
- 음악 파일을 재생할 경우 주파수 정보는 컨트롤러를 통해 **JSON**  등의 형태로 불러들여 플레이어 전면에 그래프를 그립니다.

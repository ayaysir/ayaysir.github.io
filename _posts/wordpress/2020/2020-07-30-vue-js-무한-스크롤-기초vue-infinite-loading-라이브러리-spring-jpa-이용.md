---
published: false
title: "Vue.js: 무한 스크롤 기초(Vue-infinite-loading 라이브러리 + Spring JPA 이용)"
date: 2020-07-30
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

Vue.js에서 무한 스크롤(무한 페이징, 스크롤 페이징)을 적용하는 방법입니다. [Vue-infinite-loading](https://peachscript.github.io/vue-infinite-loading/) 이라는 라이브러리를 사용하면 무한 스크롤을 쉽게 구현할 수 있습니다.

원리는 특정 영역, 일반적으로 화면 맨 아래에 화면이 이동하면 Vue.js 에서 목록을 관리하는 배열에 추가 데이터를 AJAX 로 더하여 다시 렌더링하는 방식입니다.

이 예제는 별도의 예외 상황에 대한 고려 없이 단순하게 목록을 30개씩 가져오는 것으로 가정하고 있습니다.

## 방법

### **1) Vue-infinite-loading npm 설치**

터미널을 열고 프로젝트 루트 디렉토리에서 다음 명령어를 입력하세요.

```sh
npm install vue-infinite-loading -S
```

 

### **2) 백엔드 서버에서 글 목록을 n개씩 끊어서 보내도록 페이징 지정하기**

이 부분은 프레임워크, 사용 라이브러리에 따라 천차만별이며 저는 Spring JPA를 사용했습니다. 이 부분의 자세한 내용은 맨 밑 참고 부분에 있습니다.

```java
@GetMapping("/api/idol/uwasa/pages/{pageNum}")
public List<UwasaEntityDTO> getUwasaByPageRequest(@PathVariable Integer pageNum) {
    PageRequest pageRequest = PageRequest.of(pageNum, 30);
    return uwasaEntityService.findByPageRequest(pageRequest);
}
```

프론트엔드에서는 앞으로 가져와야 될 페이지(또는 글의 `id` 번호)를 보내고 서버는 그것을 받고 해당 페이지(또는 글 `id` 번호 이후/이전의 글 목록) 데이터를 보냅니다. 페이지 번호는 `0`부터 시작합니다.

 

### **3) Vue.js 컴포넌트에 태그 넣기**

먼저 글 목록이 나오는 부분의 제일 밑에 다음 태그를 넣습니다.

```html
<infinite-loading @infinite="infiniteHandler" spinner="waveDots">
  <div slot="no-more" style="color: rgb(102, 102, 102); font-size: 14px; padding: 10px 0px;">목록의 끝입니다 :)</div>
</infinite-loading>
```

`inifinteHandler`는 나중에 `methods`에서 구현할 것이고, `spinner`는 데이터를 가져올 때 표시하는 바람개비 아이콘으로 `default`, `spiral`, `circles`, `bubbles`, `waveDots` 다섯 종류가 있습니다. `<div slot>` 부분은 옵션이며 지정하지 않으면 기본 메시지 ( `No more data :)` ) 가 나옵니다.

참고로 `<template>`의 전체 코드는 다음과 같습니다.



```html
<template>
  <div class="topic">
        <audio id="tts-audio-main"></audio>
        <div class="each-row" v-for="(uwasa, rowIndex) in lineCarriagedTopicData" v-bind:key="rowIndex">
          .....목록 정보 표시.....
        </div>
        <infinite-loading @infinite="infiniteHandler" spinner="waveDots">
          <div slot="no-more" style="color: rgb(102, 102, 102); font-size: 14px; padding: 10px 0px;">목록의 끝입니다 :)</div>
        </infinite-loading>
  </div>
</template>
```

 

### **4) 라이브러리 import 후 컴포넌트에 추가**

```js
import InfiniteLoading from 'vue-infinite-loading';

export default {

  name: 'Topic',
  components: {
    InfiniteLoading
  },
}
```

4번부터 6번까지 과정은 `<script>` 태그 안에서 작성합니다.

 

### **5) data에 limit 선언, created에 초기 데이터 로딩 구현**

```js
export default {
  name: 'Topic',
  data() {
      return {
          topicData: [],
          limit: 0 // 무한스크롤 되면서 갱신될 페이지 또는 글 번호를 저장하는 변수 
      }
  },
  created() {
      async function getTopicFromApi() {
          try {
              const init = await fetch(`/api/idol/uwasa/pages/0`, {method: "GET"})
              const data = await init.json()

              return data
          } catch(exc) {
              console.error(exc)
          }
      }

      getTopicFromApi().then(data => {
          console.log("fromAPI", data)
          this.topicData = data
      })
  }
}
```

`limit`는 무한스크롤이 진행되면서 다음에 불러올 페이지 번호 또는 아이디를 업데이트할 때 사용하는 변수입니다. 그리고 `created`에서 첫 화면에 보여줄 초기 정보를 가져옵니다.

처음에는 `0`번 페이지를 가져오고, 그 다음에는 `1`번 페이지부터 순차적으로 가져옵니다,

2020.8,25 추가 - `created` 에서 불러오지 않고 `limit`를 `0`부터 시작하면 됩니다. 위의 코드는 잘못된 코드로 `data` 의 `limit`를 0으로 시작하고 `created` 내의 AJAX 부분을 지워주세요.

 



### **6) methods에 infiniteHandler 구현**

```js
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'Topic',
  methods: {
    infiniteHandler($state) {
      const EACH_LEN = 30

      fetch("/api/idol/uwasa/pages/" + (this.limit), {method: "get"}).then(resp => {
        return resp.json()
      }).then(data => {
        setTimeout(() => {
          if(data.length) {
            this.topicData = this.topicData.concat(data)
            $state.loaded()
            this.limit += 1
            console.log("after", this.topicData.length, this.limit)

            // 끝 지정(No more data) - 데이터가 EACH_LEN개 미만이면 
            if(data.length / EACH_LEN < 1) {
              $state.complete()
            }
          } else {
            // 끝 지정(No more data)
            $state.complete()
          }
        }, 1000)
      }).catch(err => {
        console.error(err);
      })
    }
  }
}
```

- `inifiniteHandler` 메소드에 무한스크롤이 동작할 때 수행할 작업을 작성합니다.
- `fetch`를 통해 AJAX로 다음 목록을 가져옵니다. 이 때 무한스크롤이 수행되면 `limit`(여기서는 페이지 번호를 뜻합니다.)를 1씩 증가시켜 request url을 통해 다음 페이지를 가져올 수 있도록 합니다.
- 1초의 `setTimeout`을 통해 자연스러운 데이터 로딩을 연출합니다.
- `this.topicData.concat(data)` - 배열 형태의 데이터인 `this.topicData`에 AJAX로 새로 받은 `data` 배열을 덧붙입니다. 배열을 업데이트하면 화면 렌더링은 Vue.js가 알아서 새로 그려줍니다.
- `$state.loaded()` - 데이터 로드가 전부 수행되었다는 것을 알려줍니다. 다음 리퀘스트가 있을 때까지 대기 상태로 들어가게 됩니다.
- `$state.complete()` - 더 이상 불러올 데이터가 없을 때 사용합니다. 이후에는 데이터가 없다는 메시지를 표시하고 더 이상 무한스크롤 작업을 수행하지 않습니다.

 

## **결과**

{% youtube "https://www.youtube.com/watch?v=0rgryiHlwjk" %}

[예제 사이트에서 보기](http://dere.yoonbumtae.com/) (개발중인 사이트이므로 나중에 변경될 수 있습니다.)

 


## **참고: 백엔드(스프링 부트 -JPA) 코드**

```java
@Getter
@NoArgsConstructor
@Entity
public class UwasaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 실질적 키
    private String idolNameJa;

    private Integer topicNum;

    @Column(columnDefinition = "TEXT")
    private String uwasaJa;

    @Column(columnDefinition = "TEXT")
    private String uwasaKo;

    @Builder
    public UwasaEntity(String idolNameJa, Integer topicNum, String uwasaJa, String uwasaKo) {
        this.idolNameJa = idolNameJa;
        this.topicNum = topicNum;
        this.uwasaJa = uwasaJa;
        this.uwasaKo = uwasaKo;
    }
}
```

```java
package com.example.deretopic.domain.uwasa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UwasaRepository extends JpaRepository<UwasaEntity, Long> {
}

```

```java
package com.example.deretopic.service;

import com.example.deretopic.domain.uwasa.UwasaRepository;
import com.example.deretopic.web.dto.UwasaEntityDTO;
import com.example.deretopic.web.dto.UwasaEntitySaveDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UwasaEntityService {

    private final UwasaRepository uwasaRepository;

    @Transactional
    public Long save(UwasaEntitySaveDTO uwasaEntitySaveDTO) {
        return uwasaRepository.save(uwasaEntitySaveDTO.toEntity()).getId();
    }

    @Transactional
    public List<UwasaEntityDTO> findAll() {
        return uwasaRepository.findAll().stream()
                .map(UwasaEntityDTO::new)
                .collect(Collectors.toList());
    }

    public List<UwasaEntityDTO> findByPageRequest(PageRequest pageRequest) {
        return uwasaRepository.findAll(pageRequest).stream()
                .map(UwasaEntityDTO::new)
                .collect(Collectors.toList());
    }
}

```

```java
package com.example.deretopic.web;

import com.example.deretopic.service.IdolEntityService;
import com.example.deretopic.service.UwasaEntityService;
import com.example.deretopic.web.dto.UwasaEntityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class IdolApiController {

    private final IdolEntityService idolEntityService;
    private final UwasaEntityService uwasaEntityService;

    // api / idol / {작업} / {이름}

    // ...............

    @GetMapping("/api/idol/uwasa")
    public List<UwasaEntityDTO> getAllUwasa() {
        return uwasaEntityService.findAll();
    }

    @GetMapping("/api/idol/uwasa/pages/{pageNum}")
    public List<UwasaEntityDTO> getUwasaByPageRequest(@PathVariable Integer pageNum) {
        PageRequest pageRequest = PageRequest.of(pageNum, 30);
        return uwasaEntityService.findByPageRequest(pageRequest);
    }
}

```

---
title: "스프링 부트(Spring Boot) 미디 플레이어 만들기 (3): 다음 곡 연속 재생 기능 & 미디 정보 업데이트 및 삭제"
date: 2020-08-18
categories: 
  - "DevLog"
  - "Spring/JSP"
---

\[rcblock id="2655"\]

이전 글

- [스프링 부트(Spring Boot) 미디 플레이어 만들기 (1): Timidity++, LAME을 이용해 미디(midi) 파일을 mp3로 변환하는 메소드 만들기](http://yoonbumtae.com/?p=2819)
- [스프링 부트(Spring Boot) 미디 플레이어 만들기 (2): 업로드 페이지, 임시 재생 플레이어 만들기](http://yoonbumtae.com/?p=2878)

 

##### **현재까지 완성된 미디 플레이어 (임시) 바로 가기**

이 서비스는 AWS 프리티어 기간 만료로 인해 폐쇄하였습니다.서비스 당시 모습을 영상 기록으로 확인할 수 있습니다.

https://www.youtube.com/watch?v=ZqUtpc7yEYQ

##### **다음 곡 연속 재생 기능**

이전 버전에서는 한 곡만 재생하고 끝이었는데, 곡이 끝나면 다음 곡을 자동으로 재생하도록 바꾸었습니다.

```
<table class="table table-hover" id="table-info">
    <thead>
        <tr class="head-title">
            <th scope="col" style="width: 60px">ID</th>
            <th scope="col" >제목</th>
            <th scope="col" style="width: 20%">업로더</th>
        </tr>
    </thead>
    <tbody id="table-info-tbody">
        <tr>......</tr>
    </tbody>
</table>
```

```
// 현재 재생중인 곡 정보를 담는 객체
const currentPlay = {
    trEl: null
}

// ajax로 곡 목록을 가져와 새로운 $tr을 테이블에 append
fetch("/api/v1/midi", {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(song => {
            const $tr = document.createElement("tr")
            $tr.setAttribute("title", song.originalFileName + ` | 업로드 일자: [${song.createdDate}]`)
            $tr.setAttribute("data-id", song.id)
            $tr.innerHTML = `<th scope="row">${song.id}</th>
            <td class="song-title"><span class="text-muted">[${song.category}]</span> ${song.customTitle}</td>
            <td>${song.userId}</td>`
            document.getElementById("table-info-tbody").appendChild($tr)

        })
    })

// 아이디를 정보로 받아 오디오를 재생하는 함수
function loadAudio(audioCtx, id) {

    audioCtx.loop = false
    audioCtx.src = "/api/v1/midi/mp3/" + id
    audioCtx.load()
    audioCtx.play()

}

// 제목을 클릭하면 노래가 재생
document.addEventListener("click", e => {
    if (e.target && e.target.classList.contains("song-title")) {
        const audio = document.getElementById("audio-player")
        const parentEl = e.target.parentElement
        loadAudio(audio, parentEl.dataset.id)
        currentPlay.trEl = parentEl // 현재 재생중인 곡의 tr을 currentPlay.trEl에 저장
        // audio.src = "http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/13.01.mp3"
    }
})

// 곡이 끝나면 (ended) tr.nextSibling으로 다음 곡을 찾아 재생
document.getElementById("audio-player").addEventListener("ended", e => {
    const audio = e.target
    const nextEl = currentPlay.trEl.nextSibling || document.querySelector("#table-info tbody tr")
    loadAudio(audio, nextEl.dataset.id)
    currentPlay.trEl = nextEl // 현재 재생중인 곡의 tr을 currentPlay.trEl에 저장

})
```

아이폰에서도 정상 작동하며, 백그라운드 상태라도 다음곡으로 잘 이동합니다.

 

##### **목록 오름차순 / 내림차순 토글 기능**

- [자바스크립트: 테이블의 tbody 내용 뒤집기(reverse)](http://yoonbumtae.com/?p=2901)

 

##### **업로드된 미디 파일 정보 업데이트 기능 (수정/삭제)**

단순한 CRUD 과정이므로 코드는 깃허브 링크로 대체합니다.

- [소스코드 변경 히스토리](https://github.com/ayaysir/awsboard/commit/e6ee178bc5341ee48b7f103981034d1797c5c516)

파일 정보를 삭제한 후에는 원본 미디 파일과 변환된 mp3 파일도 같이 처리를 해야 하기 때문에 이 부분을 반영했습니다. 저는 파일을 삭제하기보다 특정 폴더에 이동시키는 방법을 택했습니다. 파일을 이동하는 방법은 `file.renameTo(newFile)` 을 이용해 새로운 경로로 이동시킬 수 있습니다.

```
@DeleteMapping(DEFAULT_URI + "/{id}")
public Long deleteMidi(@PathVariable Long id,
                       @LoginUser SessionUser user) {

    if(user != null) {
        MidiResponseDTO midi = midiService.findById(id);
        if(user.getRole().equalsIgnoreCase("ADMIN")
                ||  midi.getUserId().equals(user.getId())) {
            midiService.delete(id);

            // 파일 삭제
            // mp3 파일 경로 지정
            String rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
            String basePath = rootPath + "/" + "app/midi";
            String midiPath = basePath + midi.getOriginalMidiPath();
            String mp3Path = basePath + midi.getOriginalMp3Path();

            File midiFile = new File(midiPath);
            File mp3File = new File(mp3Path);
            File toDeleteDir = new File(basePath + "/to_delete");

            if(!toDeleteDir.exists()) {
                toDeleteDir.mkdirs();
                System.out.println("mkdirs: /to_delete");
            }

            // 파일 to_delete 디렉토리로 이동
            midiFile.renameTo(new File(basePath + "/to_delete/" + midiFile.getName()));
            mp3File.renameTo(new File(basePath + "/to_delete/" + mp3File.getName()));

            return id;
        }

    }

    return -99L;
}

```

 

\[caption id="attachment\_2909" align="alignnone" width="2232"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.05.16.png) 지오디 노래 정보를 지오디 - 거짓말로 변경합니다. 업데이트 아이콘을 누르면\[/caption\]

 

\[caption id="attachment\_2910" align="alignnone" width="476"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.05.32.png) 정보가 변경됩니다.\[/caption\]

 

\[caption id="attachment\_2911" align="alignnone" width="2238"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.06.06.png) 목록에 정상적으로 반영되었습니다.\[/caption\]

 

\[caption id="attachment\_2912" align="alignnone" width="713"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.06.58.png) 236번부터 239 까지 파일을 삭제하려고 합니다.\[/caption\]

 

\[caption id="attachment\_2913" align="alignnone" width="465"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.07.31.png) 삭제가 완료되면 삭제 완료 메시지가 표시됩니다.\[/caption\]

 

\[caption id="attachment\_2914" align="alignnone" width="2030"\]![](./assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-18-오후-11.08.04.png) 삭제 내역이 반영되었습니다.\[/caption\]

 

\[caption id="attachment\_2915" align="alignnone" width="2420"\]![](./assets/img/wp-content/uploads/2020/08/-2020-08-18-오후-11.32.01-e1597761384907.png) 운영자는 모든 파일에 대한 정보를 수정/삭제할 수 있고, 일반 회원은 자신의 업로드 내역만 업데이트 할 수 있습니다. 4번 아이디로 로그인하면 4번이 업로드한 미디 파일만 변경할 수 잇습니다.\[/caption\]

---
title: "스프링 부트(Spring Boot) 미디 플레이어 만들기 (2): 업로드 페이지, 임시 재생 플레이어 만들기"
date: 2020-08-15
categories: 
  - "DevLog"
  - "Spring/JSP"
---

\[rcblock id="2655"\]

이전 글: [스프링 부트(Spring Boot) 미디 플레이어 만들기 (1): Timidity++, LAME을 이용해 미디(midi) 파일을 mp3로 변환하는 메소드 만들기](http://yoonbumtae.com/?p=2819)

 

##### **현재까지 완성된 미디 플레이어 (임시) 바로 가기**

이 서비스는 AWS 프리티어 기간 만료로 인해 폐쇄하였습니다.서비스 당시 모습을 영상 기록으로 확인할 수 있습니다.

{% youtube "https://www.youtube.com/watch?v=ZqUtpc7yEYQ" %}

 

##### **현재 버전에서의 TimidityRunner**

```
package com.example.awsboard.util;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class TimidityRunner {

    // 여기로 보낼 때 루트 패스 포함해서 보냄.
    public static Boolean convertMidiToMp3(String midiPath, String mp3Path) throws IOException {

        Integer lastIndexOfDot = mp3Path.lastIndexOf(".");
        String wavPath = mp3Path.substring(0, lastIndexOfDot) + ".wav";
//        String mp3Path = midiPath.substring(0, lastIndexOfDot) + ".mp3";

        String[] midiCmd = {"/usr/local/bin/timidity", midiPath, "-o", wavPath, "-Ow"};
        System.out.println("** run >>>> " + midiCmd[0] + " " + midiCmd[1]
                + " " + midiCmd[2] + " " + midiCmd[3] + " " + midiCmd[4]);
        ProcessBuilder midiBuilder = new ProcessBuilder(midiCmd);
        midiBuilder.redirectErrorStream(true);

        Process midiProcess = midiBuilder.start();
        InputStream is = midiProcess.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        String line = null;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        System.out.println("==========================================");

        // wav 파일 생성 후
        File wavFile = new File(wavPath);
        if(wavFile.exists() && wavFile.length() > 0) {
            String[] lameCmd = {"/usr/local/bin/lame", wavPath, mp3Path};
            ProcessBuilder lameBuilder = new ProcessBuilder(lameCmd);
            lameBuilder.redirectErrorStream(true);

            Process lameProcess = lameBuilder.start();
            is = lameProcess.getInputStream();
            reader = new BufferedReader(new InputStreamReader(is));

            line = null;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            // mp3 파일 있는지 체크
            File mp3File = new File(mp3Path);
            if(mp3File.exists() && mp3File.length() > 0) {
                System.out.println(">> Convert succeeded.");
                wavFile.delete();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    public static String getHash(String path) throws IOException, NoSuchAlgorithmException {

        MessageDigest messageDigest = MessageDigest.getInstance("MD5");
        FileInputStream fileInputStream = new FileInputStream(path);

        byte[] dataBytes = new byte[1024];

        Integer nRead = 0;
        while((nRead = fileInputStream.read(dataBytes)) != -1) {
            messageDigest.update(dataBytes, 0, nRead);
        }

        byte[] mdBytes = messageDigest.digest();

        StringBuffer stringBuffer = new StringBuffer();
        for(Integer i = 0; i < mdBytes.length; i++) {
            stringBuffer.append(Integer.toString((mdBytes[i] & 0xff) + 0x100, 16)).substring(1);
        }

        return stringBuffer.toString();

    }

    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {

        String midiPath = "/Users/yoonbumtae/Documents/midi/canyon.mid";
        String mp3Path = "/Users/yoonbumtae/Documents/midi/mp3/canyon.mp3";

        File mp3Dir = new File("/Users/yoonbumtae/Documents/midi/mp3/");
        if(!mp3Dir.exists())    mp3Dir.mkdirs();

        System.out.println(TimidityRunner.getHash(midiPath));
        TimidityRunner.convertMidiToMp3(midiPath, mp3Path);

    }
}
```

 

##### **미디 정보 저장 테이블(엔티티) 생성**

이전에 만들었던 `TimidityRunner`를 바탕으로 미디 플레이어를 만들기로 하였습니다. 미디 파일이 업로드되면 재생할 때마다 실시간 변환을 택할지, 아니면 mp3를 변환해둔 파일을 서버에 저장한 뒤 재생하는 방식을 택할지 둘 중 선택하다가 제가 현재 AWS EC2 프리티어 서비스를 이용하고 있고 지금 상황에서 실시간 변환은 서버에 부하가 많이 가기 때문에 사용자가 미디 파일을 업로드하면 서버에서 mp3를 저장하고, 나중에 플레이어에서 재생할 때 mp3 파일을 가져와 재생하는 방식을 택했습니다.

그러면 midi 파일과 mp3 파일의 경로, 원래 이름, 해시값 등을 저장하는 테이블(엔티티)가 새로 필요합니다. 참고로 재생 정보로 _카테고리_와 _사용자 지정 제목_이 있습니다. _카테고리_는 폴더와 비슷한 의미이고 _사용자 지정 제목_은 원래 파일명과 다른 이름을 사용자가 지정할 수 있다는 의미입니다.

```
package com.example.awsboard.domain.midi;

import com.example.awsboard.domain.BaseTimeEntity;
import com.example.awsboard.web.dto.midi.MidiRequestDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
@Entity
public class Midi extends BaseTimeEntity {

    @Id // PK 필드
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 생성규칙
    private Long id;

    private Long userId;    // 업로드한 사람

    private String category;

    private String customTitle;

    private String hash;

    private String originalMidiPath;

    private String originalMp3Path;

    private String originalFileName;

    @Builder
    public Midi(Long userId, String category, String customTitle,
                String hash, String originalMidiPath, String originalMp3Path,
                String originalFileName) {
        this.userId = userId;
        this.category = category;
        this.customTitle = customTitle;
        this.hash = hash;
        this.originalMidiPath = originalMidiPath;
        this.originalMp3Path = originalMp3Path;
        this.originalFileName = originalFileName;
    }

    public void update(MidiRequestDTO dto) {
        // userid는 변경될 수 없음
        this.category = dto.getCategory() != null ? dto.getCategory() : this.category;
        this.customTitle = dto.getCustomTitle() != null ? dto.getCustomTitle() : this.customTitle;
        this.hash = dto.getHash() != null ? dto.getHash() : this.hash;
        this.originalMidiPath = dto.getOriginalMidiPath() != null ? dto.getOriginalMidiPath() : this.originalMidiPath;
        this.originalMp3Path = dto.getOriginalMp3Path() != null ? dto.getOriginalMp3Path() : this.originalMp3Path;
    }
}

```

```
package com.example.awsboard.domain.midi;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MidiRepository extends JpaRepository<Midi, Long> {

    Midi findByHash(String hash);
}

```

 

##### **Midi 엔티티의 서비스 클래스 작성**

```
package com.example.awsboard.service.posts;

import com.example.awsboard.domain.midi.Midi;
import com.example.awsboard.domain.midi.MidiRepository;
import com.example.awsboard.web.dto.midi.MidiPublicResponseDTO;
import com.example.awsboard.web.dto.midi.MidiRequestDTO;
import com.example.awsboard.web.dto.midi.MidiResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MidiService {
    private final MidiRepository midiRepository;

    @Transactional
    public Long save(MidiRequestDTO requestDTO) {
        return midiRepository.save(requestDTO.toEnity()).getId();
    }

    @Transactional
    public Long update(Long id, MidiRequestDTO requestDTO) {
        Midi midi = midiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일이 없습니다. id=" + id));
        midi.update(requestDTO);
        return midi.getId();
    }

    @Transactional
    public void delete(Long id) {
        Midi midi = midiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일이 없습니다. id=" + id));
        midiRepository.delete(midi);
    }

    public MidiResponseDTO findById(Long id) {
        Midi midi = midiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일이 없습니다. id=" + id));

        return new MidiResponseDTO(midi);
    }

    @Transactional(readOnly = true)
    public List<MidiPublicResponseDTO> findAll() {
        return midiRepository.findAll().stream()
                .map(MidiPublicResponseDTO::new)
                .collect(Collectors.toList());
    }

}

```

CRUD에 대응할 수 있는 서비스를 작성하였습니다. 현재는 업로드 및 목록 받기, mp3 파일 받기만 가능하지만 나중을 위해 update, delete도 미리 만들었습니다.

 

##### **미디파일 업로드 API 구현**

미디파일을 여러 개 업로드할 수 있는 기능을 구현하였습니다. [스프링 부트(Spring Boot): 파일 업로드 처리하기 (한 개, 여러 개)](http://yoonbumtae.com/?p=2834) 이 글을 참고해 미디파일을 `MultipartFile` 리스트로 여러 개 받을 수 있도록 하였습니다. 카테고리 및 사용자 지정 제목 정보도 받을 수 있게 제작하였습니다.

현재는 `MultipartFile`로 되어있지만 미디 파일은 대부분 파일 크기가 매우 작기(수십 KB 단위가 대부분입니다.) 때문에 나중에 BASE64 포맷을 이용해 업로드 방식을 변경할지 고려하고 있습니다. 원래 파일 크기가 작아서 BASE64로 변환해도 오버헤드가 적고 JSON 에 포함해서 보낼 수 있기 때문에 이점이 있습니다.

컨트롤러 내의 `PostMapping` 부분입니다.

```
package com.example.awsboard.web;

import com.example.awsboard.config.auth.LoginUser;
import com.example.awsboard.config.auth.dto.SessionUser;
import com.example.awsboard.service.posts.MidiService;
import com.example.awsboard.util.TimidityRunner;
import com.example.awsboard.web.dto.midi.MidiPublicResponseDTO;
import com.example.awsboard.web.dto.midi.MidiRequestDTO;
import com.example.awsboard.web.dto.midi.MidiResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;

@RequiredArgsConstructor
@RestController
public class MidiApiController {

    private final MidiService midiService;
    private final String DEFAULT_URI = "/api/v1/midi";

    @PostMapping(DEFAULT_URI)
    public Map<String, Object> uploadMultipleMidi(@RequestParam("files") List<MultipartFile> files,
                                           @RequestParam("categories") List<String> categories,
                                           @RequestParam("titles") List<String> titles,
                                           @LoginUser SessionUser user, HttpServletRequest request) throws Exception {
        String rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
        String basePath = rootPath + "/" + "app/midi";
        String ourUrl = request.getRequestURL().toString().replace(request.getRequestURI(),"");

        Map<String, Object> result = new HashMap<>();

        if(files.size() == 0) {
            result.put("status", "NoFile");
            result.put("successList", null);
            result.put("failedList", null);

            return result;
        }

        if(!user.getRole().equalsIgnoreCase("ADMIN") && files.size() > 5) {
            result.put("status", "NotAllowManyFile");
            result.put("successList", null);
            result.put("failedList", null);

            return result;
        }

        System.out.println(">>> " + rootPath);
        System.out.println(">>> " + basePath);

        File originalDir = new File(basePath + "/original");
        File mp3Dir = new File(basePath + "/mp3");

        // 디렉토리가 없으면 만든다.
        if(!originalDir.exists()) {
            originalDir.mkdirs();
            System.out.println("mkdirs: original");
        }
        if(!mp3Dir.exists()) {
            mp3Dir.mkdirs();
            System.out.println("mkdirs: mp3");
        }

        List<Map<String, String>> successList = new ArrayList<>();
        List<String> urlList = new ArrayList<>();
        List<String> failedList = new ArrayList<>();
        MultipartFile file = null;

        for(int i = 0; i < files.size(); i++) {

            file = files.get(i);

            String originalName = file.getOriginalFilename();
            String filePath = basePath + "/original/" + originalName;
            // String mp3Name = file.getOriginalFilename().substring(0, originalName.lastIndexOf("."));
            String mp3Name = UUID.randomUUID().toString();
            String mp3Path = basePath + "/mp3/" + mp3Name+ ".mp3";

            File dest = new File(filePath);
            file.transferTo(dest);

            // 변환
            Boolean isConverted = false;
            try {
                isConverted = TimidityRunner.convertMidiToMp3(filePath, mp3Path);
            } catch(IOException e) {
                System.err.println(e);
                isConverted = false;
            }

            // 변환 성공시 데이터베이스에 정보 입력
            if(isConverted) {
                Long id = midiService.save(MidiRequestDTO.builder()
                        .category(categories.get(i))
                        .customTitle(titles.get(i))
                        .hash(TimidityRunner.getHash(filePath))
                        .originalMidiPath("/original/" + originalName)
                        .originalMp3Path("/mp3/" + mp3Name+ ".mp3")
                        .originalFileName(originalName)
                        .userId(user.getId())
                        .build());
                Map<String, String> urlPair = new HashMap<>();
                urlPair.put("originalName", originalName);
                urlPair.put("url", ourUrl + "/api/v1/midi/mp3/" + id);
                successList.add(urlPair);

            } else {
                failedList.add(originalName);
            }
        }

        if(successList.size() > 0 && failedList.size() == 0) {
            result.put("status", "AllFileSuccess");
        } else if(successList.size() > 0 && failedList.size() > 0) {
            result.put("status", "SomeFileSuccess");
        } else if (successList.size() > 0){
            result.put("status", "AllFileFailed");
        }
        result.put("successList", successList);
        result.put("failedList", failedList);
        System.out.println(">>>>>> Auth user >>>>> " + user);
        return result;
    }

    // ............... //

}

```

 

미디 파일과 부가 정보를 파라미터로 가져온 후, 파일이 정상적으로 변환되었으면 `successList`에 넣고, 실패하거나 예외가 발생하면 `failedList`에 넣습니다. 변환이 다 끝나면 변환 상태 메시지와 성공/실패 목록을 JSON으로 반환합니다.

HTML 뷰에서도 처리하였지만 업로드된 파일이 0개이면 작업을 진행하지 않도록 하도록 처리하였습니다. 또 일반 회원(USER)은 최대 5개까지만 업로드하도록 하였습니다. (누가 이 글을 볼 것이며 회원가입까지 해서 업로드할지는 모르겠으나..) 저는 ADMIN 계정이기 때문에 무한대로 업로드할 수 있습니다.

기타 컨트롤러단에서 발생할 수 있는 돌발 상황에 대한 대비는 추가적으로 계속 할 예정입니다.

약간 특이한 부분이라면 MP3 파일 이름을 저장할 때 `UUID.randomUUID().toString();` 를 사용해 고유 값으로 지정했다는 점입니다. DB에 저장하고 나중에 아이디를 바탕으로 특정 mp3 파일을 가져올 때 사용합니다.

 

##### **다음은 업로드 뷰 페이지(Thymeleaf) 입니다.**

```
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>미디파일 업로드</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <style>
        #info-tr-proto {
            display: none;
        }

    </style>

</head>

<body>

    <div class="container">

        <h2 class="mt-2">파일 업로드</h2>

        <!-- <form method="post" action="/api/v1/midi/" enctype="multipart/form-data">-->
        <!-- <input multiple type="file" name="files" id="field-file">-->
        <!-- <input name="customTitle" value="eee">-->
        <!-- <input name="userId" value="33">-->
        <!-- <button>submit</button>-->
        <!-- </form>-->

        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <label class="col-form-label" for="field-file">업로드할 파일 선택</label>
                    <div class="input-group mb-3">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="field-file" multiple>
                            <label class="custom-file-label" for="field-file">파일을 선택하세요.</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="form-group">
                    <label class="col-form-label" for="field-custom-category">카테고리 일괄변경</label>
                    <div class="input-group mb-3">
                        <div class="custom-file">
                            <input type="text" class="form-control" placeholder="카테고리명을 입력하세요." id="field-custom-category">
                        </div>
                        <div class="input-group-append">
                            <button class="input-group-text" id="btn-change-category">변경</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="form-group">
            <button class="btn btn-secondary" id="btn-reset">초기화</button>
            <button class="btn btn-primary" id="btn-upload">
                <span class="spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="message">모든 파일 업로드</span>
            </button>
        </div>

        <table class="table table-hover" id="table-info">
            <thead>
                <tr>
                    <th scope="col">파일명</th>
                    <th scope="col">카테고리</th>
                    <th scope="col">사용자 설정 제목</th>
                    <th scope="col">크기</th>
                </tr>
            </thead>
            <tbody id="table-info-tbody">
                <tr id="info-tr-proto">
                    <th scope="row" class="file-name">Default</th>
                    <td class="category">
                        <input type="text" placeholder="카테고리명을 입력하세요." class="form-control form-control-sm">
                    </td>
                    <td class="custom-title">
                        <input type="text" placeholder="제목을 입력하세요." class="form-control form-control-sm">
                    </td>
                    <td class="file-size">Column content</td>
                </tr>

            </tbody>
        </table>

        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">업로드 결과</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="upload-result">성공/실패</p>
                        <p>성공: <span class="success-count">0</span></p>
                        <p>실패: <span class="failed-count">0</span></p>
                        <p><a th:href="@{/midi/list}">미디파일 목록 가기</a></p>
                    </div>
                    <div class="modal-footer">
                        <!-- <button type="button" class="btn btn-primary">Save changes</button>-->
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script>
        $("#btn-upload .spinner").hide()

        const tbody = $("#table-info-tbody")
        
        function resetAll() {
            $("#field-file").get(0).value = ""
            $("#table-info-tbody tr:not(#info-tr-proto)").remove()
        }

        $("#field-file").on("change", e => {
            if($("#field-file").get(0).length >= 1) {
                resetAll()
            } else {
                $("#table-info-tbody tr:not(#info-tr-proto)").remove()
            }
            const evTarget = e.target
            console.log(evTarget.files)
            Array.from(evTarget.files).forEach(file => {
                if (file.type === "audio/midi") {
                    const clone = $("#info-tr-proto").clone()

                    clone.find(".file-name").text(file.name)
                    clone.find(".category input").val("Uploaded")

                    const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."))
                    clone.find(".custom-title input").val(fileNameWithoutExt)
                    clone.find(".file-size").text(Math.ceil(file.size / 1000) + " KB")
                    clone.show()
                    clone.attr("id", "")

                    tbody.append(clone)
                } else {
                    console.log(file.name, "미디 파일만 업로드할 수 있습니다.")
                }
            })
        })

        $("#btn-change-category").on("click", e => {
            const catStr = $("#field-custom-category").val()
            tbody.find(".category input").val(catStr !== "" ? catStr : "Uploaded")
        })

        $("#btn-upload").on("click", e => {
            const files = $("#field-file").get(0).files

            if(files.length == 0) {
                alert("업로드할 파일을 선택하세요.")
                return false
            }

            const categories = $("#table-info-tbody tr:not(#info-tr-proto) .category input").map((i, el) => $(el).val())
            const titles = $("#table-info-tbody tr:not(#info-tr-proto) .custom-title input").map((i, el) => $(el).val())
            console.log(categories, titles)

            const formData = new FormData()
            Array.from(files).forEach((file, i) => {
                formData.append("files", file)
                formData.append("categories", categories[i])
                formData.append("titles", titles[i])
            })

            const entries = formData.entries()

            $("#btn-upload .spinner").show()
            $("#btn-upload .message").text("작업을 처리하고 있습니다.....")
            fetch("/api/v1/midi/", {
                    method: "POST",
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)

                    if(data.status == "NotAllowManyFile") {
                        alert("일반 회원은 최대 5개의 파일만 업로드할 수 우 있습니다.")
                        return
                    }
                
                    $(".modal").find(".upload-result").text(data.status)
                    $(".modal").find(".success-count").text(data.successList.length)
                    $(".modal").find(".failed-count").text(data.failedList.length)
                    $(".modal").modal("show")
                
                    resetAll()

                })
                .catch(err => {
                    console.error(err)
                
                    $(".modal").find(".upload-result").text("파일 전송에 실패했습니다.")
                    $(".modal").modal("show")
                
                    resetAll()
                })
                .finally(() => {
                    $("#btn-upload .spinner").hide()
                    $("#btn-upload .message").text("모든 파일 업로드")
                
                })
        })
        
        $("#btn-reset").on("click", e => {
            resetAll()
        })

    </script>

</body>

</html>

```

 

대충 요약하자면 파일 업로드하면 목록으로 받고 카테고리, 제목 정보 수정할 수 있고, 파일과 정보를 한 번에 모아 업로드 할 수 있는 기능이 있는 페이지 입니다.

JS, CSS는 추후 기능 보강이 되고 안정화되면 분리할 예정입니다.

 

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-1.08.23.png)

업로드에서 미디 파일을 여러 개 선택하면 위 그림처럼 리스트가 뜹니다. 워크래프트 2 배경음악 파일이라서 카테고리를 "Warcraft II" 로 일괄 변경하였습니다. 업로드 버튼을 누르면 버튼에 로딩 이미지가 추가됩니다. 업로드가 완료되면 결과창이 나옵니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-1.10.09.png)

\[caption id="attachment\_2881" align="alignnone" width="588"\] ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-1.10.28.png) 업로드 결과를 JSON 으로 반환\[/caption\]

 

##### **변환된 MP3 파일을 클라이언트로 보내는 API 만들기**

크롬에서 구간 탐색(seeking)이 가능하게 하려면 response header 설정을 해야 합니다. "Accept-ranges"를 "bytes"로 설정하고, "Content-Length"에 바이트 단위로 파일 길이를 넣어주면 됩니다. ([MDN 링크](https://developer.mozilla.org/ko/docs/Web/HTTP/Range_requests))

ㅂㅅ같은 사파리 브라우저때문에 이 부분은 문제가 많이 복잡해서 설명 및 코드는 별도의 글에서 설명하겠습니다.

- [스프링 부트 (Spring Boot): mp3을 전송하는 컨트롤러 &#8211; 크롬 및 사파리(Safari) 브라우저에서 구간 탐색이 안되는 문제 해결 방법](http://yoonbumtae.com/?p=2891)

 

##### **미디 재생 플레이어 페이지(임시) 만들기**

```
<html lang="ko" xmlns:th="http://www.thymeleaf.org">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>미디파일 업로드</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <style>
        .song-title {
            cursor: pointer;
        }

        #audio-player {
            width: 100%;
        }
    </style>

</head>

<body>

    <div class="container">
        <div class="row mt-3">
            <div class="col-7">
                <h2>미디파일 목록 (임시)</h2>
                <p>제목을 클릭하면 재생됩니다. <a th:href="@{/midi/upload}" href="#" class="btn btn-primary btn-sm">업로드</a></p>
            </div>
            <div class="col-5">
                <div>
                    <audio id="audio-player" controls></audio>
                </div>
            </div>
        </div>
        <table class="table table-hover" id="table-info">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">제목</th>
                    <th scope="col">업로더</th>
                </tr>
            </thead>
            <tbody id="table-info-tbody">
                <!-- <tr id="info-tr-proto">-->
                <!-- <th scope="row" class="file-name">Default</th>-->
                <!-- <td class="category">-->
                <!-- <input type="text" placeholder="카테고리명을 입력하세요." class="form-control form-control-sm">-->
                <!-- </td>-->
                <!-- <td class="custom-title">-->
                <!-- <input type="text" placeholder="제목을 입력하세요." class="form-control form-control-sm">-->
                <!-- </td>-->
                <!-- <td class="file-size">Column content</td>-->
                <!-- </tr>-->

            </tbody>
        </table>

    </div>

    <script>
        const example = [{
                "id": 1,
                "userId": 1,
                "category": "Uploaded",
                "customTitle": "amazonia",
                "originalFileName": "amazonia.mid"
            },
            {
                "id": 2,
                "userId": 1,
                "category": "Uploaded",
                "customTitle": "ample",
                "originalFileName": "ample.mid"
            },
            {
                "id": 3,
                "userId": 1,
                "category": "Uploaded",
                "customTitle": "arsenal-mixed-4bell-mid0",
                "originalFileName": "arsenal-mixed-4bell-mid0.mid"
            }
        ]

        fetch("/api/v1/midi", {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => {
                data.forEach(song => {
                    const $tr = document.createElement("tr");
                    $tr.innerHTML = `<th scope="row">${song.id}</th>
                    <td class="song-title" data-id=${song.id}><span class="text-muted">[${song.category}]</span> ${song.customTitle}</td>
                    <td>${song.userId}</td>`
                    document.getElementById("table-info-tbody").appendChild($tr)

                })
            })

        document.addEventListener("click", e => {
            if (e.target && e.target.classList.contains("song-title")) {
                const audio = document.getElementById("audio-player")
                audio.pause()
                audio.loop = false
                audio.src = "/api/v1/midi/mp3/" + e.target.dataset.id
                // audio.src = "http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/13.01.mp3"
                audio.play()
            }
        })
    </script>

</body></html>

```

일단 '재생 기능만 구현'이라는 목적 하에 만들었습니다. 제목을 클릭하면 업로드된 노래가 재생이 됩니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-5.21.35.png)

{% youtube "https://www.youtube.com/watch?v=xUl4sOQkBno" %}

아이폰에서도 정상 재생되며 백그라운드에서도 정상 동작 합니다. 제가 예전에 만들었던 라이브러리를 사용한 [미디 플레이어](http://yoonbumtae.com/music/midi/)는 백그라운드 재생이 안되었는데, 이 점은 해결된 것 같습니다.

앞으로 구현할 내용은 다음과 같습니다.

- 미디파일 정보 수정, 미디파일 삭제
- 연속 재생 기능
- 구간 반복 재생 기능
- 사용자별 플레이리스트 기능(추가, 변경, 삭제)

 

여유가 된다면 언젠가는 다음 기능도 시도해볼 예정입니다.

- 그래픽 이퀄라이저
- 사용자별로 MIDI 파일에 대한 재생 속도, 음높이, 리버브 변경 정보를 저장하고 재생하는 사용자 맞춤 재생 기능
- 미디파일 업로드 포맷을 BASE64로 변경
- 결제 기능 (업로드 한도 해제, 광고 제거 등)
- 변환 과정 실시간 통보 기능

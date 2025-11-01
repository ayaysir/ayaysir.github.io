---
title: "macOS: 아마존 EC2에서 내 PC로 다운로드 (scp 이용)"
date: 2020-12-14
categories: 
  - "DevLog"
  - "CI/CD"
---

[macOS: 내 컴퓨터에서 아마존 EC2로 파일 업로드 (scp 사용)](http://yoonbumtae.com/?p=2799)

내 PC의 로컬 터미널에서 scp 명령어를 실행합니다.

scp -i \[pem\_file\] \[EC2에 있는 다운로드할 파일 경로와 이름\] \[user\_id\]@\[`ec2_public_ip`\]:\[로컬 PC 경로\]

- `pem_file` – 아마존 EC2 인스턴스를 만들 때 발급받은 pem키 파일의 경로를 입력합니다.
- `user_id` – 터미널에 접속하면 보이는 빨간색 부분 (또는 루트 디렉토리에서 `pwd`를 누르면 `home/` 뒤에 나오는 정보)이 유저 아이디입니다. ![](/assets/img/wp-content/uploads/2020/07/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2020-07-29-%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE-4.47.40.png)
- `ec2_public_ip` – 퍼블릭 DNS나 퍼블릭 IP(v4) 중 하나를 사용합니다.
- `[EC2에 있는 다운로드할 파일 경로와 이름]` - 내 PC로 다운로드하고자 하는 EC2에 있는 파일의 경로와 이름을 입력합니다.
- `[로컬 PC 경로]` - 다운로드할 폴더 위치를 입력합니다. 참고로 사용자 루트 폴더에 저장하려면 `~/` 을 입력합니다.

 

#### **예제**

```
scp -i "~/..경로../key.pem" userid@ec-a-b-c-d-e.amazonaws.com:~/resources/sound.tar.gz ~/destiny_folder/
```

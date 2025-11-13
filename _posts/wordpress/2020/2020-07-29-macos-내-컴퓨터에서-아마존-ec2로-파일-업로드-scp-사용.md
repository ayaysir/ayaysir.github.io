---
title: "macOS: 내 컴퓨터에서 아마존 EC2로 파일 업로드 (scp 사용)"
date: 2020-07-29
categories: 
  - "DevLog"
  - "CI/CD"
---

참고 [블로그](https://ict-nroo.tistory.com/40)

#### **문법**

```
scp -i [pem_file] [upload_file] [user_id]@[ec2_public_IP]:[transfer_address]
```

- `pem_file` - 아마존 EC2 인스턴스를 만들 때 발급받은 pem키 파일의 경로를 입력합니다.
- `user_id` - 터미널에 접속하면 보이는 빨간색 부분 (또는 루트 디렉토리에서 `pwd`를 누르면 `home/` 뒤에 나오는 정보)이 유저 아이디입니다. ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-29-pm-4.47.40.png)
- `ec2_public_ip` - 퍼블릭 DNS나 퍼블릭 IP(v4) 중 하나를 사용합니다. ![](/assets/img/wp-content/uploads/2020/07/-2020-07-29-pm-4.28.44-e1596009393987.png)
- `transfer_address` - 루트 디렉토리를 기준으로 파일이 업로드될 경로를 입력합니다. 주의할 점은 디렉토리를 경로로 입력하여야 하고 이미 생성된 디렉토리만 가능합니다.
- 아마존 EC2에서 내 컴퓨터로 다운로드 하고자 할 경우 `scp -i [pem_file] [user_id]@[ec2_public_IP]:[transfer_address] [download_file]` 처럼 서로 위치를 바꿔주면 됩니다.

 

#### **예제**

```
scp -i /Users/xxxxxx/pem_dir/key_for_ec2.pem /Users/xxxxxx/resources/lots.tgz user-id@299.299.299.299:~/resouces/
```

EC2 인스턴스의 `[루트 디렉토리]/resources` 는 미리 생성되어 있어야 합니다.

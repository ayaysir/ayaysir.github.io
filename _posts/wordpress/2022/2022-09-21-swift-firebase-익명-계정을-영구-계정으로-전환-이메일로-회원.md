---
title: "Swift + Firebase: 익명 계정을 영구 계정으로 전환 (이메일로 회원가입)"
date: 2022-09-21
categories: 
  - "DevLog"
  - "Swift UIKit"
  - "Firebase"
---

#### **참고**

- [Apple 플랫폼에서 익명으로 Firebase에 인증](https://firebase.google.com/docs/auth/ios/anonymous-auth?hl=ko#swift_7)

익명 인증 (Authenticate with Firebase Anonymously)과 관련된 내용은 위 공식 매뉴얼을 참고하면 됩니다. 다만 매뉴얼 중 '익명 계정을 영구 계정으로 전환'에 대한 설명이 다소 헷갈리게 적혀 있어 이에 대해 보충합니다.

 

#### **상황**

##### **기존**

익명 로그인이 존재하지 않고, '좋아요' 버튼을 누르려면 무조건 회원 가입이 되어 있어야 합니다.

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-21-오후-11.53.07.jpg)

 

##### **변경**

익명 로그인을 추가하였고, 익명 유저 상태에서도 `좋아요` 버튼을 누를 수 있게 되었습니다. 이 상태에서 익명 로그인 상태에서 눌렀던 좋아요 정보가 새로 회원 가입을 해서 영구 계정이 되더라도 좋아요 정보가 유지되도록 하고 싶습니다.

\[gallery size="full" ids="4814,4817,4816"\]

 

 

#### **방법**

##### **기존 코드 (이메일로 회원가입)**

```
Auth.auth().createUser(withEmail: userEmail, password: userPassword) { [self] authResult, error in
 
    // ... //
}
```

이메일(`userEmail`)과 비밀번호(`password`)로 새로 가입한 뒤, 해당 유저를 인증 상태로 만듭니다. 만약 익명 로그인 상태에서 이 작업을 실행하면, 기존 익명 유저는 로그아웃되고 새로 가입한 회원이 새로운 UID로 인증됩니다.

- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 기초 로그인 로그아웃 구현 (스토리보드)](http://yoonbumtae.com/?p=4090)
- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 회원 가입 기능 구현 1 (스토리보드)](http://yoonbumtae.com/?p=4099)

 

##### **변경 코드**

위 기존 코드를 지우고 아래 코드로 대체합니다.

```
if let user = Auth.auth().currentUser, user.isAnonymous {
    let credential = EmailAuthProvider.credential(withEmail: userEmail, password: userPassword)
    user.link(with: credential) { [self] authResult, error in
        // ... //
    }
}
```

 

라인 번호별 참고

1. 현재 로그인 되어 있으나(`Auth.auth().currentUser`가 `nil`이 아님), 익명 상태(`user.isAnonymous`)인 경우
2. 이메일과 비밀번호가 담긴 `Credential` 객체를 생성합니다. 가입이 되어있지 않아도 상관없습니다.
3. 이 Credential 객체를 현재 익명 유저와 연결시켜 영구 계정으로 승격시킵니다. 즉, `UID`는 회원 가입 전과 후가 같습니다.

 

회원 가입 과정을 마치면 익명 계정이 이메일을 사용하는 영구 계정으로 승격됩니다.

 

\[rcblock id="4560"\]

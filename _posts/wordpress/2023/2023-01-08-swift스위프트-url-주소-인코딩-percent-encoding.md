---
title: "Swift(스위프트): URL 주소 인코딩 (Percent Encoding)"
date: 2023-01-08
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

Swift에서 `URL(string:)`를 사용하여 텍스트로 된 주소를 이용해 `URL` 인스턴스를 생성하려고 하는데 한글 등이 포함되어 있으면 `nil`이 반환되는 경우가 있습니다. 일반적으로 URL은 _**Percent Encoding**_이라고 하는 특수한 인코딩을 사용하며 Swift의 `URL`은 자동 인코딩을 지원하지 않기 때문에 퍼센트 인코딩에서 허용하지 않는 문자를 입력하면 에러가 발생하는 것입니다.

- [퍼센트 인코딩 (위키백과)](https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9)

예를 들면 크롬에서 아래와 같이 한글이 포함된 URL을 복사해서

 ![](/assets/img/wp-content/uploads/2023/01/스크린샷-2023-01-08-오후-12.56.25.png)

아무 곳에나 붙여넣기 하면 한글 부분이 아래와 같이 퍼센트 인코딩으로 변환됩니다.

> https://ko.wikipedia.org/wiki/**%ED%8D%BC%EC%84%BC%ED%8A%B8\_%EC%9D%B8%EC%BD%94%EB%94%A9**

 

### **방법**

원래 스트링에 `.addingPercentEncoding`을 추가합니다.

```
import Foundation

let original = "https://ko.wikipedia.org/wiki/퍼센트_인코딩"
let escaped = originalString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) // Optional
print(escaped!)
```

- `withAllowedChracters`: 퍼센트 인코딩을 하지 않는 문자 범위를 선택합니다.
    - URL쿼리문에서 사용하는 문자 (`:`이나 `/` 등)을 허용하는 옵션인 `.urlQueryAllowed`를 선택했습니다.
- 참고로 아래와 같은 다양한 종류가 있습니다.
    
    ```
    /// Returns a character set containing the characters in Unicode General Category Cc and Cf.
    public static var controlCharacters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category Zs and `CHARACTER TABULATION (U+0009)`.
    public static var whitespaces: CharacterSet { get }
    
    /// Returns a character set containing characters in Unicode General Category Z*, `U+000A ~ U+000D`, and `U+0085`.
    public static var whitespacesAndNewlines: CharacterSet { get }
    
    /// Returns a character set containing the characters in the category of Decimal Numbers.
    public static var decimalDigits: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category L* & M*.
    public static var letters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category Ll.
    public static var lowercaseLetters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category Lu and Lt.
    public static var uppercaseLetters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category M*.
    public static var nonBaseCharacters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Categories L*, M*, and N*.
    public static var alphanumerics: CharacterSet { get }
    
    /// Returns a character set containing individual Unicode characters that can also be represented as composed character sequences (such as for letters with accents), by the definition of "standard decomposition" in version 3.2 of the Unicode character encoding standard.
    public static var decomposables: CharacterSet { get }
    
    /// Returns a character set containing values in the category of Non-Characters or that have not yet been defined in version 3.2 of the Unicode standard.
    public static var illegalCharacters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category P*.
    public static var punctuationCharacters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category Lt.
    public static var capitalizedLetters: CharacterSet { get }
    
    /// Returns a character set containing the characters in Unicode General Category S*.
    public static var symbols: CharacterSet { get }
    
    /// Returns a character set containing the newline characters (`U+000A ~ U+000D`, `U+0085`, `U+2028`, and `U+2029`).
    public static var newlines: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a user URL subcomponent.
    public static var urlUserAllowed: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a password URL subcomponent.
    public static var urlPasswordAllowed: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a host URL subcomponent.
    public static var urlHostAllowed: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a path URL component.
    public static var urlPathAllowed: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a query URL component.
    public static var urlQueryAllowed: CharacterSet { get }
    
    /// Returns the character set for characters allowed in a fragment URL component.
    public static var urlFragmentAllowed: CharacterSet { get }
    ```
    
     

출력 결과는 다음과 같습니다.

```
https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9
```

 

자주 사용하는 경우 `extension`으로 추가할 수도 있습니다.

```
extension String {
    var urlEncoded: String? {
        return self.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
    }
}
```

 

이제 이 인코딩된 주소를 통해 `URL` 인스턴스를 생성하면 `nil`이 반환되지 않을 수 있습니다.

 

참고

- [Swift - encoded URL](https://stackoverflow.com/questions/24551816/swift-encode-url)
- [Swift(스위프트): URL 관련 기능 요약 (URL, URLComponents, URLSession)](http://yoonbumtae.com/?p=3499)

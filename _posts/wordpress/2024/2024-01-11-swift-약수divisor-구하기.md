---
title: "Swift: 약수(divisor) 구하기"
date: 2024-01-11
categories: 
  - "DevLog"
  - "Swift"
---

#### **약수**

약수는 어떤 정수를 다른 정수로 나누어 떨어지게 하는 정수를 말합니다. 즉, 어떤 수를 다른 수로 나눌 때 나머지가 0이 되는 수들이 해당 수의 약수입니다.

예를 들어, 6의 약수는 1, 2, 3, 6이고, 12의 약수는 1, 2, 3, 4, 6, 12입니다. 약수는 양수일 필요는 없으며, 음수나 0도 가능합니다. 또한, 1과 자기 자신도 항상 어떤 수의 약수입니다.

 

##### **구현 1 - 시간복잡도 O(n)**

```
func findDivisors(of number: Int) -> [Int] {
    var divisors: [Int] = []

    for i in 1...number {
        if number % i == 0 {
            divisors.append(i)
        }
    }

    return divisors
}

// 사용 예시
let numberToFindDivisors = 12
let divisors = findDivisors(of: numberToFindDivisors)
print("약수는: \(divisors)") // 약수는: [1, 2, 3, 4, 6, 12]
```

- `1`부터 주어진 숫자 `number`까지의 모든 수를 확인하면서 나누어 떨어지는 수를 약수로 간주하여 배열에 추가합니다. 이후에 해당 배열을 반환합니다.
- 각 숫자에 대해 나머지를 확인하고, 나머지가 0이면 약수로 판별하는 방식이기 때문에 숫자 n에 대해 1부터 n까지 모든 수를 확인하므로 시간 복잡도는 `O(n)`입니다.

 

##### **구현 2 - 시간복잡도 O(√n)**

```
func findDivisorsEfficiently(of number: Int) -> [Int] {
    var divisors: [Int] = []

    // 1부터 제곱근까지 확인
    for i in 1...Int(Double(number).squareRoot()) {
        if number % i == 0 {
            divisors.append(i)

            // 제곱근 이상의 약수도 추가 (중복 방지)
            if i != number / i {
                divisors.append(number / i)
            }
        }
    }

    return divisors
}

// 사용 예시
let numberToFindDivisors = 12
let divisors = findDivisorsEfficiently(of: numberToFindDivisors)
print("약수는: \(divisors)") // 약수는: [1, 12, 2, 6, 3, 4]
```

- `1`부터 `제곱근`까지만 확인하면서 나누어 떨어지는 경우를 찾습니다.
    - 전부 확인하지 않고 제곱근까지만 확인하므로 시간복잡도는 `O(√n)`입니다.
- 이때, 약수를 찾으면서 동시에 해당 약수의 짝도 찾아서 배열에 추가합니다. 중복을 피하기 위해 제곱근까지만 확인하면서 나누어 떨어지는 경우에 해당 약수를 배열에 추가하고, 동시에 그 약수의 짝, 즉 "상대 약수"도 추가합니다.
    - `100`의 약수는 `1, 2, 4, 5, 10, 20, 25, 50, 100`입니다.
    - `1, 2, 4, 5`까지만 확인하면서 나누어 떨어지는 경우를 찾습니다.
    - 1이 100의 약수이면, `100 / 1 = 100` 역시 약수입니다. 마찬가지로, 2의 경우 `100 / 2 = 50`이 약수입니다.
    - 이렇게 중복을 피하기 위해 상대적으로 작은 약수와 큰 약수를 함께 추가합니다.
- 이러한 계산 방식으로 인해 결과 배열은 정렬되지 않은 상태로 출력됩니다.

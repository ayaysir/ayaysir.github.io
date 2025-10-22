---
title: "Swift(스위프트): 달력 그리기 (2) → Interface Builder 스토리보드 GUI 방식으로 그리기"
date: 2023-02-05
categories: 
  - "DevLog"
  - "Swift"
---

##### **이전 글**

- [Swift(스위프트): 달력 그리기 (1) → 달력 데이터 분석](http://yoonbumtae.com/?p=5271)

 

### **소개**

_이전 글 [달력 그리기 (1)](http://yoonbumtae.com/?p=5271) 포스트에 대한 내용이 먼저 숙지되어야 진행할 수 있습니다._

이전 포스트에서 달력의 데이터를 마련하는 방법에 대해 알아봤는데, 이를 바탕으로 스토리보드 인터페이스 빌더(Interface Builder)를 이용해 GUI 방식으로 달력을 그리는 방법에 대해 알아보겠습니다.

컬렉션 뷰(`UICollectionView`)를 이용하며, 컬렉션 뷰의 사이즈를 조정하면 해당 사이즈에 맞게 자동으로 달력의 레이아웃도 조절되는 것에 중점을 맞추겠습니다.

\[caption id="attachment\_5286" align="alignnone" width="414"\]![](./assets/img/wp-content/uploads/2023/02/Simulator-Screen-Shot-iPhone-11-2023-02-05-at-22.48.29-복사본.jpg) 컬렉션 뷰의 사이즈에 맞춰 달력을 그립니다.\[/caption\]

 

\[caption id="attachment\_5287" align="alignnone" width="707"\]![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-05-오후-10.49.45.jpg) 컬렉션 뷰의 사이즈를 줄이면 달력 레이아웃도 자동으로 맞춰 줄어듭니다.\[/caption\]

 

##### **출처**

- [Creating a Custom Calendar Control for iOS](https://www.kodeco.com/10787749-creating-a-custom-calendar-control-for-ios)

 

#### **스토리보드의 뷰 컨트롤러에 요소 추가**

뷰 컨트롤러에 아래와 같이 요소들을 추가합니다.

![](./assets/img/wp-content/uploads/2023/02/달력-스크린샷-2023-02-05-오후-11.15.09.jpg)

- **제목**
    - `2023년 2월`과 같이 현재 연월을 표시합니다.
- **컬렉션 뷰**
    - **헤더**: `일 ~ 토`와 같이 상단에 요일을 작성합니다.
        - `Horizontal Stack View`를 추가하고, 안에 `일 월 화 수 목 금 토` 각각 7개의 레이블을 추가
    - **컬렉션 뷰 셀**: 해당 일에 대한 숫자가 표시됩니다.
- **버튼**
    - `Prev`: 현재 표시되는 달의 이전 달(한달 전)으로 이동
    - `Next`: 현재 표시되는 달의 다음 달(한달 후)으로 이동
    - 예) `2023년 2월`에서 `Prev`를 누르면 `2023년 1월`, `Next`를 누르면 `2023년 3월`로 이동

 

**참고**

- [iOS 프로그래밍: 컬렉션 뷰 (Swift, 스토리보드) – 컬렉션 뷰 추가, 커스텀 셀 작성](http://yoonbumtae.com/?p=3418)
- [Swift(스위프트): 버튼(UIButton)에서 이미지 오른쪽으로 옮기기 / 이미지와 레이블 간 간격 띄우기 (스토리보드)](http://yoonbumtae.com/?p=5278)

 

#### **스토리보드와 뷰 컨트롤러 코드 간 연결**

![](./assets/img/wp-content/uploads/2023/02/Calnedar_스크린샷-2023-02-05-오후-11.41.00.jpg)![](./assets/img/wp-content/uploads/2023/02/Calnedar_스크린샷-2023-02-05-오후-11.41.20.jpg)

- **@IBOutlet**
    - `calendarCollectionView`: 달력의 컬렉션 뷰
    - `lblCalendarTitle`: 달력 제목 레이블
- **@IBAction**
    - `btnActPrevMonth`: 이전 달로 이동
    - `btnActNextMonth`: 다음 달로 이동

 

**참고**

- [iOS 프로그래밍: 스토리보드에서 요소를 추가한 뒤 아웃렛 변수와 액션 함수로 연결하기](http://yoonbumtae.com/?p=2160)

 

#### **컬렉션 뷰 셀에 식별자(Identifier)와 클래스 지정하기**

날짜 표시 칸으로 사용되는 컬렉션 뷰 셀은 고유의 형식을 지녀야 하기 때문에 커스터마이징 할 필요가 있습니다.

컬렉션 뷰의 셀(하나만 있음)을 클릭하고 오른쪽 설정 패널에서

- `Identity Inspector`에서 `Custom Class`를 `DayCell`로 지정 ![](./assets/img/wp-content/uploads/2023/02/Calnedar_스크린샷-2023-02-05-오후-11.41.41.jpg)
- `Attribute Inspector`에서 `Identifier`를 `DayCell`로 지정 ![](./assets/img/wp-content/uploads/2023/02/Calnedar_스크린샷-2023-02-05-오후-11.41.37.jpg)

합니다.

\[the\_ad id="3513"\]

 

#### **프로젝트에 달력 데이터 생성 클래스 (CalendarData) 추가**

[이전 포스트](http://yoonbumtae.com/?p=5271)의 내용을 바탕으로 데이터 생성 과정을 클래스화시킨 아래 코드를 프로젝트에 추가합니다.

```
import Foundation

struct Day {
    /// Date 인스턴스.
    let date: Date
    
    /// 화면에 표시될 숫자.
    /// 예) Date 인스턴스가 2022년 1월 25일이라면 -> 25
    let number: String
    
    /// 이 날짜가 선택되었는지 여부.
    let isSelected: Bool
    
    /// 이 날짜가 현재 달 내에 있는지 추적.
    /// 예) 1월 달력을 그리고자 할 떄 Date 인스턴스가 1월 25일이라면 true, 2월 1일이라면 false
    let isWithinDisplayedMonth: Bool
}

struct MonthMetadata {
    /// 해당 달의 총 일수, 예를 들어 1월은 31일까지 있으므로 31
    let numberOfDays: Int
    
    /// 해당 달의 첫 Date
    let firstDay: Date
    
    /// 해당 달의 첫 Date가 무슨 요일인지 반환, 일 ~ 토 => 1 ~ 7
    /// 예) 수요일이라면 4
    let firstDayWeekday: Int
}

```

```
import UIKit

enum CalendarDataError: Error {
    case metadataGeneration
}

class CalendarData {
    typealias DateHandler = (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    let changedBaseDateHandler: DateHandler
    
    private var baseDate: Date {
        didSet {
            days = generateDaysInMonth(for: baseDate)
            // collectionView.reloadData()
            //
            // headerView.baseDate = baseDate
            changedBaseDateHandler(baseDate)
        }
    }
    
    var selectedDate: Date {
        didSet {
            days = generateDaysInMonth(for: self.baseDate)
        }
    }
    private(set) var days: [Day] = []
    
    /// baseDate가 속한 달에서 주(week)의 수는 몇개인지 반환
    var numberOfWeeksInBaseDate: Int {
      calendar.range(of: .weekOfMonth, in: .month, for: baseDate)?.count ?? 0
    }
    
    private lazy var dateFormatterOnlyD: DateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "d"
        return dateFormatter
    }()

    private lazy var dateFormatterCalendarTitle: DateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.calendar = Calendar(identifier: .gregorian)
        dateFormatter.locale = Locale.autoupdatingCurrent
        dateFormatter.setLocalizedDateFormatFromTemplate("MMMM y")
        return dateFormatter
    }()
    
    var localizedCalendarTitle: String {
        return dateFormatterCalendarTitle.string(from: baseDate)
    }
    
    init(baseDate: Date, changedBaseDateHandler: @escaping DateHandler) {
        self.baseDate = baseDate
        self.changedBaseDateHandler = changedBaseDateHandler
        self.selectedDate = baseDate
        
        days = generateDaysInMonth(for: self.baseDate)
    }
    
    // MARK: - Methods
    
    func moveMonth(value: Int) {
        baseDate = calendar.date(byAdding: .month, value: value, to: baseDate) ?? baseDate
    }
    
    // MARK: - Generating a Month’s Metadata
     
    ///  Date를 기준으로 월별 메타데이터인 MonthMetaData 인스턴스를 생성.
    private func monthMetadata(for baseDate: Date) throws -> MonthMetadata {
        // You ask the calendar for the number of days in baseDate‘s month, then you get the first day of that month.
        guard
            let numberOfDaysInMonth = calendar.range(of: .day, in: .month, for: baseDate)?.count,
            let firstDayOfMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: baseDate))
        else {
            // Both of the previous calls return optional values. If either returns nil, the code throws an error and returns.
            throw CalendarDataError.metadataGeneration
        }
        
        // You get the weekday value, a number between one and seven that represents which day of the week the first day of the month falls on.
        // weekday: 주일, 평일: 일요일 이외의 6일간을 가리키는 경우와 토·일요일 이외의 5일간을 가리키는 경우가 있음.
        let firstDayWeekday: Int = calendar.component(.weekday, from: firstDayOfMonth)
        
        // Finally, you use these values to create an instance of MonthMetadata and return it.
        return MonthMetadata(
            numberOfDays: numberOfDaysInMonth,
            firstDay: firstDayOfMonth,
            firstDayWeekday: firstDayWeekday)
    }

    /// Adds or subtracts an offset from a Date to produce a new one, and return its result.
    private func generateDay(offsetBy dayOffset: Int, for baseDate: Date, isWithinDisplayedMonth: Bool) -> Day {
        let date = calendar.date(byAdding: .day, value: dayOffset, to: baseDate) ?? baseDate
        
        return Day(
            date: date,
            number: dateFormatterOnlyD.string(from: date),
            isSelected: calendar.isDate(date, inSameDayAs: selectedDate),
            isWithinDisplayedMonth: isWithinDisplayedMonth)
    }

    /// Takes the first day of the displayed month and returns an array of Day objects.
    private func generateStartOfNextMonth(using firstDayOfDisplayedMonth: Date) -> [Day] {
        // Retrieve the last day of the displayed month. If this fails, you return an empty array.
        guard let lastDayInMonth = calendar.date(
            byAdding: DateComponents(month: 1, day: -1),
            to: firstDayOfDisplayedMonth) else {
            return []
        }
        
        // Calculate the number of extra days you need to fill the last row of the calendar.
        // For instance, if the last day of the month is a Saturday, the result is zero and you return an empty array.
        let additionalDays = 7 - calendar.component(.weekday, from: lastDayInMonth)
        guard additionalDays > 0 else {
            return []
        }
        
        /*
         Create a Range<Int> from one to the value of additionalDays, as in the previous section.
         Then, it transforms this into an array of Days.
         This time, generateDay(offsetBy:for:isWithinDisplayedMonth:) adds the current day in the loop to lastDayInMonth
         to generate the days at the beginning of the next month.
         */
        let days: [Day] = (1...additionalDays)
            .map {
                generateDay(offsetBy: $0, for: lastDayInMonth, isWithinDisplayedMonth: false)
            }
        
        return days
    }

    /// Takes in a Date and returns an array of Days.
    private func generateDaysInMonth(for baseDate: Date) -> [Day] {
        // Retrieve the metadata you need about the month, using monthMetadata(for:).
        // If something goes wrong here, the app can’t function. As a result, it terminates with a fatalError.
        guard let metadata = try? monthMetadata(for: baseDate) else {
            fatalError("An error occurred when generating the metadata for \(baseDate)")
        }
        
        let numberOfDaysInMonth = metadata.numberOfDays
        let offsetInInitialRow = metadata.firstDayWeekday
        let firstDayOfMonth = metadata.firstDay
        
        /*
         If a month starts on a day other than Sunday, you add the last few days from the previous month at the beginning.
         This avoids gaps in a month’s first row. Here, you create a Range<Int> that handles this scenario.
         For example, if a month starts on Friday, offsetInInitialRow would add five extra days to even up the row.
         You then transform this range into [Day], using map(_:).
         */
        var days: [Day] = (1..<(numberOfDaysInMonth + offsetInInitialRow))
            .map { day in
                // Check if the current day in the loop is within the current month or part of the previous month.
                let isWithinDisplayedMonth = day >= offsetInInitialRow
                
                // Calculate the offset that day is from the first day of the month. If day is in the previous month, this value will be negative.
                let dayOffset = isWithinDisplayedMonth ? day - offsetInInitialRow : -(offsetInInitialRow - day)
                
                // Call generateDay(offsetBy:for:isWithinDisplayedMonth:), which adds or subtracts an offset from a Date to produce a new one, and return its result.
                return generateDay(offsetBy: dayOffset, for: firstDayOfMonth, isWithinDisplayedMonth: isWithinDisplayedMonth)
            }
        
        days += generateStartOfNextMonth(using: firstDayOfMonth)
        
        return days
    }
}

```

- 달력 데이터 클래스에 대한 구현 방법 및 자세한 원리는 [이전 포스트](http://yoonbumtae.com/?p=5271)에 설명되어 있습니다.

\[the\_ad id="3020"\]

 

#### **CalendarData의 인스턴스 변수를 뷰 컨트롤러에 추가**

뷰 컨트롤러의 멤버 변수로 아래를 추가합니다.

```
private var calendarData: CalendarData!
```

나중에 `viewDidLoad(_:)`에서 초기화됩니다.

 

#### **DayCell 클래스 작성**

달력의 셀에 대한 커스텀 클래스가 필요합니다. 프로젝트에 다음 코드를 추가하고, `@IBOutlet` 연결을 수행합니다. (연결되지 않으면 프로젝트 창을 껐다 켜면 됩니다.)

![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-06-오전-12.04.29.jpg)

```
class DayCell: UICollectionViewCell {
    @IBOutlet weak var lblNumber: UILabel!
    
    func configure(day: Day) {
        lblNumber.textColor = day.isWithinDisplayedMonth ? .label : .systemGray3
        lblNumber.text = "\(day.number)"
        self.backgroundColor = day.isSelected ? .systemPink : .systemYellow
    }
}
```

- `lblNumber`: 숫자가 표시될 레이블
- `configure` 함수는 셀의 내용을 채우는 부분으로, `Day` 타입의 인스턴스를 받습니다.
    - **lblNumber.textColor = ...**
        - 현재 달에 속하였다면 레이블의 기본 색(`.label`; 라이트 모드에서 검은색)으로 표시하고, 아니라면 회색(`.systemGray3`)으로 표시합니다.
    - **self.backgroundColor = ...**
        - 일자 선택 기능(Select Date)에서 특정 일을 선택한 경우, 해당 셀의 배경은 `.systemPink`이고, 아니라면 `기본 색`입니다. (여기서는 학습 목적을 위해 `.systemYellow` 색을 지정했습니다.)

 

#### **뷰 컨트롤러의 viewDidLoad(\_:) 내부에 내용 추가**

```
override func viewDidLoad() {
    super.viewDidLoad()

    // 1
    calendarCollectionView.delegate = self
    calendarCollectionView.dataSource = self
    
    // 2
    calendarData = CalendarData(baseDate: Date(), changedBaseDateHandler: { date in
        // ... baseDate가 변경되면 해야 할 작업을 작성, 컬렉션 뷰 리로드 등 ... //
    })

    // 3
    lblCalendarTitle.text = calendarData.localizedCalendarTitle
}
```

1. 컬렉션 뷰와 뷰 컨트롤러 간 `delegate`, `dataSource` 연결을 수행합니다.
2. `calendarData`를 초기화합니다.
3. 달력 타이틀을 지정합니다.

 

`CalendarData`의 `changeBaseDateHandler`는 `CalendarData` 인스턴스에서 `baseDate`(기준 일자)가 변경되었을 경우 해야 할 작업을 지정합니다. `Prev`, `Next` 버튼을 누르면 기준 일자가 변경됩니다.

아래의 해야 할 작업 목록을 코드로 작성합니다.

1. 컬렉션 뷰를 변경된 데이터 기준으로 다시 로드 (`reloadData()`)
2. 달력의 제목을 변경

```
calendarData = CalendarData(baseDate: Date(), changedBaseDateHandler: { date in
    self.calendarCollectionView.reloadData()
    self.lblCalendarTitle.text = self.calendarData.localizedCalendarTitle
})
```

 

#### **기준 일자 변경 부분 구현 - Prev, Next 버튼**

`Prev`, `Next` 버튼을 누르면 달력의 표시 월(month)가 바뀌어야 합니다. `calendarData.baseDate`를 변경해서 기준 일자를 변경합니다. 기준 일자가 변경되면 위 섹션에서 지정한 핸들러 `changedBaseDateHandler`가 실행되면서 달력을 다시 그립니다.

```
@IBAction func btnActPrevMonth(_ sender: Any) {
    calendarData.moveMonth(value: -1)
}

@IBAction func btnActNextMonth(_ sender: Any) {
    calendarData.moveMonth(value: 1)
}
```

참고로 `CalendarData`의 `moveMonth`는 아래와 같이 되어 있습니다.

```
func moveMonth(value: Int) {
    baseDate = calendar.date(byAdding: .month, value: value, to: baseDate) ?? baseDate
}
```

 

#### **셀이 달력의 한 줄(Line)을 7칸씩 채우도록 Flow Layout 조절**

`UICollectionViewDelegateFlowLayout`의 `collectionView(...sizeForItemAt...)`을 이용하면 한 셀의 너비(width)와 높이(height)를 지정할 수 있습니다. `UICollectionViewDelegateFlowLayout`을 준수하는 아래 `extension`을 추가합니다.

```
extension CalendarViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = Int(calendarCollectionView.frame.width / 7)
        let height = Int(calendarCollectionView.frame.height - 50) / calendarData.numberOfWeeksInBaseDate
        
        return CGSize(width: width, height: height)
    }
}
```

- 먼저 인터페이스 빌더의 컬렉션 뷰의 설정에서 `Estimate Size`는 `None`으로 지정해야 합니다.
- **width**
    - 현재 컬렉션 뷰의 프레임 너비를 `7`칸으로 나눠서 셀이 한 줄마다 7칸씩 차도록 합니다.
- **height**
    - `numberOfWeeksInBaseDate`는 현재 표시되는 달이 몇 개의 주(week)를 가지고 있는지를 나타냅니다.
    - 보통 `5`개이나, `6`이 반환되는 경우도 있습니다.
    - 프레임의 전체 높이에서 `50`을 뺀 높이를 주 수로 나누면 한 셀의 높이가 나옵니다.
    - 프레임의 전체 높이에서 `50`을 뺀 이유: 50은 헤더의 높이인데 헤더의 높이 사이즈를 빼야 실제 표시 부분의 높이가 나오기 때문입니다.
        - 위의 코드는 하드코딩으로 `50`을 지정했습니다.
        - 실제 적용시에는 하드코딩을 피하는 방식으로 헤더의 사이즈를 뺴는 것을 권장합니다.
- `return CGSize(width:height:)` 형태로 너비와 높이를 지정합니다.

 

#### **컬렉션 뷰의 DataSource, Delegate 구현**

실제 달력의 내용을 채우는 과정은 `DataSource` 프로토콜에서 지정된 메서드를 이용해야 합니다.

`UICollectionViewDelegate`, `UICollectionViewDataSource`를 준수하는 `extension`을 추가한 뒤, 다음과 같이 코드를 작성합니다.

```
extension CalendarViewController: UICollectionViewDelegate, UICollectionViewDataSource {
    // 1
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        calendarData.days.count
    }
    
    // 2
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell =  collectionView.dequeueReusableCell(withReuseIdentifier: "DayCell", for: indexPath) as? DayCell else {
            fatalError("Cell is not initialized.")
        }
        
        cell.configure(day: calendarData.days[indexPath.row])
        
        return cell
    }
    
    // 3
    func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        switch kind {
        case UICollectionView.elementKindSectionHeader:
            return collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: "CalendarHeaderView", for: indexPath)
        default:
            fatalError("Not allowed.")
        }
    }
    
    // 4
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let day = calendarData.days[indexPath.row]
        calendarData.selectedDate = day.date
        collectionView.reloadData()
    }
}
```

1. **...numberOfItemsInSection...**
    - 셀의 총 개수를 지정합니다.
    - `calendarData`의 `days` 배열은 표시해야 할 `Day` 인스턴스를 담고 있으며, 이 배열의 총 원소 개수가 표시해야 할 셀의 개수가 됩니다.
2. **...cellForItemAt...**
    - 각 셀의 인스턴스 및 표시될 내용을 지정하는 부분입니다.
3. **...viewForSupplementaryElementOfKind...**
    - 셀의 헤더 뷰를 표시하려면 이 부분을 반드시 추가해야 합니다.
    - 헤더 뷰의 `Identifier`를 `CalendarHeaderView`로 지정합니다.![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-06-오전-12.20.12.jpg)
    - `kind`가 헤더 뷰(`.elementKindSectionHeader`)인 경우, `collectionView. dequeueReusableSupplementaryView`를 통해 헤더 뷰 인스턴스를 반환합니다.
    - 참고: [iOS ) UICollectionReusableView](https://zeddios.tistory.com/998)
4. **...didSelectItemAt...**
    - 셀을 선택한 경우 해당 셀에 해당하는 날짜를 하이라이트 표시합니다.

\[the\_ad id="1801"\]

 

#### **동작 확인**

빌드 및 실행하고, 아래와 같이 동작하는지 확인합니다.

http://www.giphy.com/gifs/SyXQOKZlvxk1eiorIb

- 달력이 칸수에 맞게 제대로 그려집니다.
- `Prev`, `Next` 버튼을 클릭하면 이전 달 또는 다음 달로 이동합니다.
- 날짜를 클릭하면 해당 날짜가 하이라이트됩니다.
- 다른 달로 이동했다 돌아와도 해당 날짜에 하이라이트가 유지됩니다.

 

##### **전체 코드**

https://gist.github.com/ayaysir/7323ed9e717c7fdb868342376c05e21a

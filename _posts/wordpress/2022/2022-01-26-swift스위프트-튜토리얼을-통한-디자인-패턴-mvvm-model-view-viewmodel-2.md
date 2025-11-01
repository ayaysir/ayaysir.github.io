---
title: "Swift(스위프트): 튜토리얼을 통한 디자인 패턴: MVVM (Model-View-ViewModel) 2"
date: 2022-01-26
categories: 
  - "DevLog"
  - "Swift"
---

\[rcblock id="4384"\]

#### **원문**

- [MVVM in iOS Swift](https://medium.com/@abhilash.mathur1891/mvvm-in-ios-swift-aa1448a66fb4)

 

 ![](/assets/img/wp-content/uploads/2022/01/1_pFVk0tVSIkeSYD7RZ2sVaw.png)

새 애플리케이션을 구축할 때마다 항상 새 프로젝트에 어떤 아키텍처 패턴을 선택해야 하는지에 궁금할 수 있습니다. iOS에서 가장 많이 사용되는 아키텍처 패턴은 MVC입니다. 대부분의 개발자는 프로젝트에 MVC 패턴을 사용합니다. 소규모 프로젝트에는 MVC가 잘 작동하지만 프로젝트 크기가 증가하기 시작하면 소스 코드가 지저분해지기 시작합니다.

아키텍처 패턴을 사용하는 것이 좋다는 것을 알고 있지만, 모든 프로젝트에서 아키텍처 패턴을 엄격하게 따르지는 않아야 합니다. 모든 아키텍처 패턴이 대부분을 커버할 만큼 충분히 좋은 것은 아닙니다. 모든 아키텍처 패턴에는 장단점이 있습니다. 프로젝트에 많은 모듈이 있는 경우 해당 모듈에 따라 아키텍처 패턴도 결정할 수 있습니다. 일부 모듈은 MVVM과 잘 어울리지만 새 모듈은 MVVM과 잘 작동하지 않을 수 있으므로 대신 MVP(Model-View-Presenter), VIPER(View-Interactor-Presenter-Entity-Routing)와 같은 다른 아키텍처 패턴을 사용하세요. 따라서 단일 아키텍처 패턴에 완전히 의존해서는 안 되며 대신 모듈에 따라 확인할 수도 있습니다.

(참고: [MVC, MVVM, MVP, VIPER, VIP를 알아봅시다.](https://dev-leeyang.tistory.com/21))

인터넷을 통해 MVVM 패턴의 정의와 단점 및 장점을 설명하는 많은 글들이 있습니다. 따라서 여기에서는 정의를 나열하는 대신 패턴의 실제 구현에 더 중점을 둘 것입니다.

 

#### **시작하기**

이 프로젝트에서는 MVVM 디자인 패턴을 사용하여 간단한 애플리케이션을 빌드합니다. 대부분의 애플리케이션에는 서버(API)에서 데이터를 가져와 UI에 표시해야 하는 뷰 컨트롤러(UI)가 있습니다. MVVM 패턴을 사용하여 동일한 동작을 구현합니다.

이것은 구현을 완료시 예상되는 앱의 출력 화면입니다.

 ![](/assets/img/wp-content/uploads/2022/01/1_f6oVGW9hytmcYJfwTk-VAg-e1642951051586.png)

 

여기서 우리는 인터넷을 통해 공개적으로 사용 가능한 더미 웹 서비스를 사용할 것입니다. 이 웹 서비스는 직원 데이터 목록에 대한 리스폰스(response)를 제공하며 이 목록을 테이블 뷰에 표시합니다.

[http://dummy.restapiexample.com/api/v1/employees](http://dummy.restapiexample.com/api/v1/employees)

 

#### **MVVM 구성 요소의 개요와 역할**

- 뷰 컨트롤러 (View Controller): UI 관련 작업만 수행합니다. 예를 들어 정보 표시 및 가져오기 등의 작업이 있습니다.. 뷰 컨트롤러는 뷰 레이어의 일부입니다.
- 뷰모델 (View Model): 뷰 컨트롤러로부터 정보를 수신하고 이 모든 정보를 처리한 뒤 뷰 컨트롤러로 다시 보냅니다.
- 모델 (Model): MVC에서와 같은 모델입니다. 뷰모델에서 사용하고 뷰모델이 새 업데이트 정보를 보낼 때마다 모델도 업데이트합니다.

 

코드를 구성하고 해당 그룹에 필요한 파일을 생성해 보겠습니다. 각 그룹(Models, ViewModels, API Service)에 하나씩 3개의 새 파일을 만들었습니다.

 ![](/assets/img/wp-content/uploads/2022/01/1_eBCALKsqlQzihmJMayDxdw-e1642951849734.png)

 

#### **모델 (Model)**

모델은 단순 데이터를 나타냅니다. 단순히 데이터를 보유하고 비즈니스 로직과 아무 관련이 없습니다. 우리가 API에서 기대하는 단순한 데이터 구조라고 간단히 말할 수 있습니다. 여기에서 위 URL에 대한 리스폰스를 확인한 뒤 이 리스폰스에 대응하는 모델 클래스를 생성합니다. 직접 모델을 만들거나 [온라인 모델 생성기 사이트](https://app.quicktype.io/)를 사용할 수 있습니다.

```
// MARK: - Employee
struct Employees: Codable {
    let status: String
    let data: [EmployeeData]
}

// MARK: - EmployeeData
struct EmployeeData: Codable {
    let id, employeeName, employeeSalary, employeeAge: String
    let profileImage: String

    enum CodingKeys: String, CodingKey {
        case id
        case employeeName = "employee_name"
        case employeeSalary = "employee_salary"
        case employeeAge = "employee_age"
        case profileImage = "profile_image"
    }
}
```

애플리케이션의 실행 과정은 이렇습니다

1. 뷰 컨트롤러가 호출되고 뷰는 뷰 모델에 대한 참조를 갖게 됩니다.
2. 뷰는 사용자의 액션(user action)을 수행하고 뷰모델을 호출합니다.
3. 뷰모델은 `APIService`를 요청하고 `APIService`는 뷰 델에 응답(response)을 보냅니다.
4. 리스폰스(응답)를 받으면 뷰모델은 바인딩을 통해 뷰에 알립니다.
5. 뷰는 데이터로 UI를 업데이트합니다.

 

이제 소스 코드를 순서대로 작성합니다. 먼저 뷰 컨트롤러가 호출되고 뷰 컨트롤러에서 뷰모델 클래스(`EmployeesViewModel`)를 호출합니다. 지금 둘 사이를 바인딩을 하지 않고 나중에 할 것입니다.

 ![](/assets/img/wp-content/uploads/2022/01/1_HccY4GnopV4Dg-oQkGERPQ-e1642952581923.png)

 

#### **뷰모델 (View Model)**

뷰 모델은 이 아키텍처 패턴의 주요 구성 요소입니다. 뷰모델은 뷰가 무엇인지 또는 뷰가 무엇을 하는지 결코 알지 못합니다. 이것은 이 아키텍처를 더욱 테스트 가능한 상태(more testable)로 만들고 뷰에서 복잡성(complexity)을 제거합니다.

뷰모델(`EmployeesViewModel`)에서 `APIService` 클래스를 호출하여 서버에서 데이터를 가져옵니다.

 ![](/assets/img/wp-content/uploads/2022/01/1_5JmqmJnowCuBs4wJMHqlFQ-e1642952809116.png)

뷰모델 클래스에 이 코드를 작성하면 `APIService` 클래스를 구현하지 않았기 때문에 오류가 발생합니다. 이제 `APIService` 클래스를 구현해 보겠습니다.

 

#### **API Service**

`APIService` 클래스는 `URLSession` 클래스를 사용하여 직원 데이터를 가져오는 간단한 클래스입니다. 여기에서 모든 네트워킹 모델을 사용하여 서버에서 데이터를 가져올 수 있습니다. 뷰모델 클래스에서 `APIService` 클래스를 호출합니다.

```
import Foundation

class APIService: NSObject {
    
    private let sourcesURL = URL(string: "http://dummy.restapiexample.com/api/v1/employees")!
    
    func apiToGetEmployeeData(completion : @escaping (Employees) -> ()) {
        URLSession.shared.dataTask(with: sourcesURL) { (data, urlResponse, error) in
            if let data = data {
                
                let jsonDecoder = JSONDecoder()
                
                let empData = try! jsonDecoder.decode(Employees.self, from: data)
                    completion(empData)
            }
        }.resume()
    }
}
```

일단 뷰모델 클래스에서 API 리스폰스를 받았습니다. 이제 뷰 컨트롤러와 뷰모델을 바인딩할 차례입니다.

 

#### **MVVM 바인딩**

MVVM 바인딩은 우리 프로젝트에서 중요한 역할을 합니다. 뷰모델과 뷰 컨트롤러 간에 통신하는 방법이 중요합니다. 우리는 여러 가지 방법으로 바인딩을 할 수 있습니다.

 

```
import Foundation

class EmployeesViewModel: NSObject {
    
    private var apiService: APIService!
    private(set) var empData: Employees! {
        didSet {
            self.bindEmployeeViewModelToController()
        }
    }
    
    var bindEmployeeViewModelToController : (() -> ()) = {}
    
    override init() {
        super.init()
        self.apiService =  APIService()
        callFuncToGetEmpData()
    }
    
    func callFuncToGetEmpData() {
        self.apiService.apiToGetEmployeeData { (empData) in
            self.empData = empData
        }
    }
}
```

`bindEmployeeViewModelToController`라는 이름으로 뷰모델 클래스에 프로퍼티를 생성합니다. (12번 라인) 이 프로퍼티는 뷰 컨트롤러에서 클래스에서 호출해야 합니다.

`APIService`에서 해당 결과를 검색하고 뷰에 변경 사항이 있음을 알리는 직원(모델) 유형의 `empData`라는 이름으로 뷰모델 클래스에 다른 속성을 생성합니다. (6 ~ 10 라인)

`empData`는 API 서비스에서 받은 응답으로 설정됩니다. 프로퍼티 옵저버를 이용하여 API의 응답으로 `empData`에 값을 받는 즉시 `empData`의 `didSet`을 호출하고 `empData`의 `didSet` 내부에서 `bindEmployeeViewModelToController()`를 호출했습니다.

뷰모델에서 데이터를 수신하면 이제 UI를 업데이트할 차례입니다.

 

#### **뷰 (View)**

뷰모델 클래스에서 데이터를 수신하려면 뷰 컨트롤러 클래스 내부에 뷰모델 속성을 연결해야 합니다.

```
self.employeeViewModel.bindEmployeeViewModelToController = {
    self.updateDataSource()
}
```

 

```
import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var employeeTableView: UITableView!
    
    private var employeeViewModel: EmployeesViewModel!
    
    private var dataSource : EmployeeTableViewDataSource<EmployeeTableViewCell, EmployeeData>!
    

    override func viewDidLoad() {
        super.viewDidLoad()
        callToViewModelForUIUpdate()
    }
    
    func callToViewModelForUIUpdate(){
        
        self.employeeViewModel =  EmployeesViewModel()
        self.employeeViewModel.bindEmployeeViewModelToController = {
            self.updateDataSource()
        }
    }
    
    func updateDataSource(){
        
        self.dataSource = EmployeeTableViewDataSource(cellIdentifier: "EmployeeTableViewCell", items: self.employeeViewModel.empData.data, configureCell: { (cell, evm) in
            cell.employeeIdLabel.text = evm.id
            cell.employeeNameLabel.text = evm.employeeName
        })
        
        DispatchQueue.main.async {
            self.employeeTableView.dataSource = self.dataSource
            self.employeeTableView.reloadData()
        }
    }
    
}

```

 

UI를 업데이트하기 위해 뷰 컨트롤러에 테이블 뷰 코드를 작성할 수도 있지만 뷰 컨트롤러를 덜 지저분한 모듈식으로 만들기 위해 여기에서 `UITableViewDataSource`에서 확장되는 별도의 클래스 `EmployeeTableViewDataSource`를 만들것입니다.

```
import Foundation
import UIKit

class EmployeeTableViewDataSource<CELL : UITableViewCell, T> : NSObject, UITableViewDataSource {
    
    private var cellIdentifier : String!
    private var items : [T]!
    var configureCell : (CELL, T) -> () = {_, _ in }
    
    
    init(cellIdentifier: String, items: [T], configureCell: @escaping (CELL, T) -> ()) {
        self.cellIdentifier = cellIdentifier
        self.items =  items
        self.configureCell = configureCell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        items.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
         let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as! CELL
        
        let item = self.items[indexPath.row]
        self.configureCell(cell, item)
        return cell
    }
}
```

 

모든 아키텍처 패턴에는 장단점이 있다고 이미 말했듯이 MVVM 패턴을 사용하면 단점도 있습니다.

- 초보자의 경우 MVVM을 구현하기 어려울 것입니다.
- UI가 단순한 앱, MVVM은 과도할 수 있습니다.
- 더 큰 앱의 경우 데이터 바인딩이 복잡하므로 디버깅이 어렵습니다.

 

#### **소스 코드**

이 데모 앱의 소스 코드는 [MVVM\_Swift 저장소](https://github.com/AbMathur/MVVM_Swift.git)로 GitHub에 있습니다. 저장소를 Clone하고 MVVM 앱으로 플레이할 수 있습니다.

\[rcblock id="4384"\]

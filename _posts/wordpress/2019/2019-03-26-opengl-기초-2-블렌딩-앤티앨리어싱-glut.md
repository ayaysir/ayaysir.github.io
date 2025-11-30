---
title: "OpenGL 기초 요약 2: 블렌딩, 앤티앨리어싱, GLUT"
date: 2019-03-26
categories: 
  - "DevLog"
  - "OpenGL"
tags: 
  - "opengl"
---

- 출처: [http://soen.kr/lecture/library/opengl/opengl-5.htm](http://soen.kr/lecture/library/opengl/opengl-5.htm)

## 11\. 블렌딩

블렌딩은 색상 버퍼에 이미 기록되어 있는 값과 새로 그려지는 값의 논리 연산 방법을 지정한다. 다른 모드를 사용하면 두 값을 논리적으로 연산한 결과를 써 넣음으로써 특이한 효과를 낼 수 있다. 블렌딩 기능은 `glEnable(GL_BLEND);` 로 사용한다.

블렌딩은 색상 버퍼에 이미 기록되어 있는 값 `D`와 새로 기록되는 값 `S`와의 연산을 정의한다. 연산 방법은 다음 두 함수로 지정한다.

`void glBlendFunc(GLenum sfactor, GLenum dfactor);` `void glBlendEquation(GLenum mode);`

`sfactor`와 `dfactor`는 S색상과 D색상에 각각 적용할 연산식을 정의하며 `mode`는 두 연산 결과를 합칠 방법을 정의한다. 모드에 따른 연산식은 다음과 같다.

 ![](/assets/img/wp-content/uploads/2019/03/gl7.png)

`S`와 `D`에 적용되는 연산식의 종류는 다음과 같다.

 ![](/assets/img/wp-content/uploads/2019/03/gl8.png)

연산식에 의해 R, G, B, A 색상 요소 각각에 곱해지는 `FR`, `FG`, `FB`, `FA` 함수가 정의되고 이 함수가 각 색상 요소에 적용됨으로써 중간식이 생성되며 두 중간식을 연산하여 최종 색상을 도출한다. 색상 요소가 아닌 상수와도 연산을 하는데 이때 사용할 상수는 다음 함수로 지정한다.

`void glBlendColor(GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha);`

디폴트 상수는 `(0,0,0,0)`인 검정색이다. 다음 함수는 좀 더 상세한 연산 방법을 지정한다. `GLBlendFunc`는 RGB 색상 요소와 알파 요소를 같이 연산하는데 비해 이 함수는 두 요소에 대해 각각 다른 블렌딩 함수를 지정한다. 지정 가능한 연산의 종류는 동일하다.

`void glBlendFuncSeparate(GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha);` `void glBlendEquationSeparate(GLenum modeRGB, GLenum modeAlpha);`

```c
#include <windows.h>
#include <gl/glut.h>

void DoDisplay();
void DoKeyboard(unsigned char key, int x, int y);
void DoMenu(int value);

GLfloat Alpha = 0.5f;
GLenum Src = GL_SRC_ALPHA;  // (AS, AS, AS, AS)
GLenum Dest = GL_ONE_MINUS_SRC_ALPHA;   // (1-AS, 1-AS, 1-AS, 1-AS)

int APIENTRY WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance
       ,LPSTR lpszCmdParam,int nCmdShow){
     glutCreateWindow("OpenGL");
     glutDisplayFunc(DoDisplay);
     glutKeyboardFunc(DoKeyboard);
     glutCreateMenu(DoMenu);
     glutAddMenuEntry("Opaque", 1);
     glutAddMenuEntry("Traslucent", 2);
     glutAttachMenu(GLUT_RIGHT_BUTTON);
     glutMainLoop();
     return 0;
}

void DoKeyboard(unsigned char key, int x, int y)
{
     switch(key) {
     case 'q':
          Alpha += 0.1;
          break;
     case 'a':
          Alpha -= 0.1;
          break;
     }

     glutPostRedisplay();
}

void DoMenu(int value)
{
     switch(value) {
     case 1:
          Src = GL_ONE; // (1, 1, 1, 1)
          Dest = GL_ZERO; // (0, 0, 0, 0)
          break;
     case 2:
          Src = GL_SRC_ALPHA;   // (AS, AS, AS, AS)
          Dest = GL_ONE_MINUS_SRC_ALPHA;    // (1-AS, 1-AS, 1-AS, 1-AS)
          break;
     }

     glutPostRedisplay();
}

void DoDisplay()
{
     glClearColor(1, 1, 1, 1); 
     glClear(GL_COLOR_BUFFER_BIT);

     glEnable(GL_BLEND);
     glBlendFunc(Src, Dest);

     glColor3f(0, 0, 1);    // blue
     glRectf(-0.5, 0.8, 0.5, 0.0);

     glColor4f(1, 0, 0, Alpha);  // red with opacity
     glBegin(GL_TRIANGLES);
     glVertex2f(0.0, 0.5);
     glVertex2f(-0.5, -0.5);
     glVertex2f(0.5, -0.5);
     glEnd();
     glFlush();
}

```

 

![](https://media.giphy.com/media/XbfsjDIeOJOXJ3pQXf/giphy.gif)

 

 

이 예제에서 반투명 출력에 사용한 블렌드 연산식은 다음과 같다.

`glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);`

삼각형의 알파값이 0.4라고 했을 때 `GL_SRC_ALPHA`의 블렌딩 함수는 `(AS, AS, AS, AS)`이다. 그래서 S의 각 색상 요소에 0.4가 곱해진다. `GL_ONE_MINUS_SRC_ALPHA`의 블렌딩 함수는 모두 _1 - AS_ 이므로 D의 각 색상 요소에 0.6이 곱해진다. 두 연산 결과를 연산하는 모드는 디폴트인 `GL_FUNC_ADD`이므로 두 값을 **더해** 최종 색상을 결정한다.

```
= (0.4 * 1 + 0.6 * 0, 0.4 * 0 + 0.6 * 0, 0.4 * 0 + 0.6 * 1, 0.4 * 0.4 + 0.6 * 0.6)
= (0.4 * (1, 0, 0, 0.4) + 0.6 * (0, 0, 1, 0.6))
∴ 0.4 * 빨간색 + 0.6 * 파란색
```

불투명 모드일 때는 다음 블렌드 연산식을 사용한다.

glBlendFunc(GL\_ONE, GL\_ZERO);

이 식은 S의 모든 색상 요소에 1을 곱한다는 것은 곧 S의 색상을 그대로 유지한다는 뜻이고 D의 모든 색상 요소에 0을 곱한다는 것은 D의 색상을 완전히 무시한다는 뜻이다. 그러므로 D 색상은 S에 덮여서 안 보이게 되는 것이다.

 

## 12\. 앤티 앨리어싱

컴퓨터 화면은 색상 경계가 뚜렷할수록 경계면이 어색해서 이질감이 더해 보인다. 디지털 화면에서 나타나는 계단 현상 등을 알리아스라고 하며 이런 현상을 제거 또는 감소시키는 기술을 안티 알리아싱(Anti Aliasing)이라고 한다.

알리아스를 제거하려면 두 색상의 경계면에 중간색을 삽입하는 기법이 흔히 사용된다. 예를 들어 흰색과 검정색 사이에 회색을 단계적으로 삽입하는 식이다. 이 기능은 블렌딩 연산을 사용하므로 블렌딩 기능을 켜야 한다. 그리고 다음 함수로 점, 선, 다각형에 대해 안티 알리아싱을 적용한다.

- `glEnable(GL_POINT_SMOOTH);`
- `glEnable(GL_LINE_SMOOTH);`
- `glEnable(GL_POLYGON_SMOOTH);`

컴퓨터의 세계에서 속도와 품질은 항상 반비례 관계에 있다. 속도를 내려면 품질을 희생해야 하고 고품질을 얻으려면 시간이 오래 걸릴 수밖에 없다. 다음 함수는 OpenGL 라이브러리에게 무엇을 더 우선시할 것인지 힌트를 제공한다.

`void glHint(GLenum target, GLenum mode);`

`target`은 옵션 조정의 대상이고 `mode`는 옵션을 어떻게 조정할 것인가를 지정한다. 조정 가능한 옵션 목록은 다음과 같다.

```c
GL_FOG_HINT
GL_GENERATE_MIPMAP_HINT
GL_LINE_SMOOTH_HINT
GL_PERSPECTIVE_CORRECTION_HINT
GL_POINT_SMOOTH_HINT
GL_POLYGON_SMOOTH_HINT
GL_TEXTURE_COMPRESSION_HINT
GL_FRAGMENT_SHADER_DERIVATIVE_HINT
```

각 타겟에 대해 `mode`로 힌트를 준다. 속도가 최우선일 때는 `GL_FASTEST` 모드를 지정하고 품질이 중요할 때는 `GL_NICEST`로 지정한다. 어느 것이나 상관없다면 `GL_DONT_CARE`로 지정하며 이 값이 디폴트이다.

힌트는 강제적인 명령이 아니며 어디까지나 특정 기능이 어떤 식으로 구현되었으면 좋겠다는 희망 사항을 밝히는 것 뿐이어서 반드시 지정한대로 동작한다는 법은 없다. 힌트를 실제 그리기에 적용할 것인가 아닌가는 드라이버가 결정한다.

```c
#include <windows.h>
#include <gl/glut.h>

void DoDisplay();
void DoMenu(int value);
BOOLEAN bAlias;
BOOLEAN bHint;

int APIENTRY WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance
                     ,LPSTR lpszCmdParam,int nCmdShow)
{
    glutCreateWindow("OpenGL");
    glutDisplayFunc(DoDisplay);
    glutCreateMenu(DoMenu);
    glutAddMenuEntry("Alias ON", 1);
    glutAddMenuEntry("Alias OFF", 2);
    glutAddMenuEntry("Hint ON", 3);
    glutAddMenuEntry("Hint OFF", 4);
    glutAttachMenu(GLUT_RIGHT_BUTTON);
    glutMainLoop();
    return 0;
}

void DoMenu(int value)
{
    switch(value)
    {
    case 1:
        bAlias = TRUE;
        break;
    case 2:
        bAlias = FALSE;
        break;
    case 3:
        bHint = TRUE;
        break;
    case 4:
        bHint = FALSE;
        break;
    }

    glutPostRedisplay();
}

void DoDisplay()
{
    glClear(GL_COLOR_BUFFER_BIT);

    // 블랜딩이 켜져 있어야 알리아싱이 제대로 된다.
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // 안티 알리아싱 on, off
    if (bAlias)
    {
        glEnable(GL_POINT_SMOOTH);
        glEnable(GL_LINE_SMOOTH);
        glEnable(GL_POLYGON_SMOOTH);
    }
    else
    {
        glDisable(GL_POINT_SMOOTH);
        glDisable(GL_LINE_SMOOTH);
        glDisable(GL_POLYGON_SMOOTH);
    }

    // 고품질 출력을 위한 힌트
    glHint(GL_POINT_SMOOTH_HINT, bHint ? GL_NICEST:GL_FASTEST);
    glHint(GL_LINE_SMOOTH_HINT, bHint ? GL_NICEST:GL_FASTEST);
    glHint(GL_POLYGON_SMOOTH_HINT, bHint ? GL_NICEST:GL_FASTEST);

    glPointSize(10.0);
    glColor3f(1, 1, 1);

    glBegin(GL_POINTS);

    glVertex2f(0.0, 0.8);
    glEnd();

    glLineWidth(5);
    glBegin(GL_LINE_STRIP);
    glVertex2f(-0.8, 0.7);
    glVertex2f(0.8, 0.5);
    glEnd();

    glBegin(GL_POLYGON);
    glColor3f(1, 0, 0);
    glVertex2f(0.0, 0.4);
    glColor3f(0, 1, 0);
    glVertex2f(-0.4, 0.0);
    glColor3f(0, 0, 1);
    glVertex2f(0.0, -0.4);
    glColor3f(1, 1, 0);
    glVertex2f(0.4, 0.0);

    glEnd();
    glFlush();

}
```

![](/assets/img/wp-content/uploads/2019/03/gl9-e1578999778372.png)

## 13\. GLUT

GLUT의 고수준 인터페이스는 기반 운영체제들을 완벽하게 추상화하여 플랫폼 독립성을 제공한다. GLUT이 제공하는 기능은 그래픽과는 거의 상관없는 기능들이며 쉽게 말해서 그래픽을 그리기 위한 껍데기를 만들어 주는 것이다.

`void glutInit(int *argcp, char **argv);`

이 함수는 GLUT 라이브러리를 초기화하고 기반 플랫폼의 윈도우 시스템과 연결한다. 인수는 main으로부터 전달받은 `argc`의 주소와 `argv`의 배열을 전달하는데 argc가 내부에서 변경될 수도 있으므로 반드시 참조로 전달해야 한다. 명령행 인수는 윈도우 시스템 초기화 방법에 대한 정보를 제공하는데 주로 X 윈도우를 위한 것들이며 다른 시스템에는 해당되지 않는다.

`glutInit` 함수가 하는 가장 중요한 일은 에러 처리이다. 윈도우 시스템과 연결할 수 없다거나 해당 운영체제가 그래픽 인터페이스를 제공하지 않는다면 에러 메시지를 출력하고 프로그램을 강제 종료하는 극단적인 방어가 주된 임무이다.

GLUT의 가장 중요한 기능은 그래픽을 출력할 수 있는 윈도우를 생성하는 것이다.

- `void glutInitWindowSize(int width, int height);`
- `void glutInitWindowPosition(int x, int y);`

윈도우의 크기는 의미가 약간 다른데 창의 크기를 지정하는 것이 아니라 작업영역의 크기를 지정함을 주의하자. 창의 크기는 작업영역 크기에 타이틀 바와 경계선이 더해지므로 지정한 크기보다 조금 더 크게 생성된다.

다음 함수는 디스플레이 모드를 설정한다.

`void glutInitDisplayMode(unsigned int mode);`

디스플레이 모드는 그리기 표면의 주요 특징들을 결정한다.

 

 ![](/assets/img/wp-content/uploads/2019/03/gl10-1.png)

윈도우의 위치와 크기, 디스플레이 모드까지 결정했으면 다음 함수를 호출하여 윈도우를 생성한다. 그래픽을 출력하려면 필수적으로 호출해야 하는 함수이다.

`int glutCreateWindow(char *name);`

윈도우는 상단에 제목을 가지는데 제목 문자열을 인수로 지정한다. 단순한 문자열이므로 원하는대로 지정하면 된다. 윈도우를 지칭하는 유일한 ID가 리턴되는데 이 ID는 차후 윈도우를 관리할 때 사용된다.

다음 함수는 메시지 루프를 실행한다.

`void glutMainLoop(void);`

모든 윈도우 시스템은 이벤트 드리븐 방식으로 동작한다. 이 함수는 계속 실행되면서 사용자나 시스템에 의해 발생한 메시지를 받아 메시지 처리 함수를 호출하는 중요한 역할을 한다.

메시지를 처리하는 콜백 함수는 메시지 루프로 들어가기 전에 다음 함수들로 미리 등록해 두어야 한다.

- `void glutDisplayFunc(void (*func)(void));`
- `void glutKeyboardFunc(void (*func)(unsigned char key, int x, int y));`
- `void glutMouseFunc(void (*func)(int button, int state, int x, int y));`
- `void glutReshapeFunc(void (*func)(int width, int height));`

화면을 그릴 때, 키보드 입력을 받았을 때, 마우스 입력을 받았을 때, 윈도우 크기가 변경되었을 때 호출할 함수를 등록하는 것이다.

사용자의 지시를 받아 그래픽 상태를 변경한다거나 변수값을 실행중에 바꿔 변화를 관찰해 보려면 입력 기능이 필수적이다. 매번 변수값을 바꿔 재 컴파일해 보기는 너무 번거롭다.  다음 함수들로 콜백을 지정하면 입력시 해당 함수가 호출된다.

- `void glutKeyboardFunc(void (*func)(unsigned char key, int x, int y));`
- `void glutSpecialFunc(void (*func)(int key, int x, int y));`
- `void glutMouseFunc(void (*func)(int button, int state, int x, int y));`

각 콜백이 등록하는 입력 함수의 원형은 인수 목록의 함수 포인터 타입에 명시되어 있다.

(키보드 예제는 11번 블렌딩 예제 코드 참조)

`Mouse` 함수는 마우스 버튼 입력을 받는다. 이 함수는 마우스 버튼의 누름과 놓음만 인식할 뿐이며 이동시에는 호출되지 않는다. 마우스 이동시의 이벤트 콜백은 다음 두 함수로 지정한다.

- `void glutMotionFunc(void (*func)(int x, int y));`
- `void glutPassiveMotionFunc(void (*func)(int x, int y));`

 

다음 예제는 키보드와 마우스 입력을 받아 도형의 색상이나 위치를 변경한다.

```c
#include <windows.h>
#include <gl/glut.h>
#include <stdio.h>

void DoDisplay();
void DoKeyboard(unsigned char key, int x, int y);
void DoSpecial(int key, int x, int y);
void DoMouse(int button, int state, int x, int y);

const GLfloat size = 0.2;
const GLfloat step = 0.01;  // 이동거리

GLfloat nx, ny;
GLboolean bGray = GL_FALSE;

int APIENTRY WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance
                     ,LPSTR lpszCmdParam,int nCmdShow)
{
    glutCreateWindow("OpenGL");
    glutDisplayFunc(DoDisplay);
    glutKeyboardFunc(DoKeyboard);
    glutSpecialFunc(DoSpecial);
    glutMouseFunc(DoMouse);
    glutMainLoop();
    return 0;
}

void DoKeyboard(unsigned char key, int x, int y)
{
    switch(key)
    {
    case 'r':
    case 'R':
        glClearColor(1.0, 0.0, 0.0, 1.0);
        break;
    case 'g':
    case 'G':
        glClearColor(0.0, 1.0, 0.0, 1.0);
        break;
    case 'b':
    case 'B':
        glClearColor(0.0, 0.0, 1.0, 1.0);
        break;
    }
    glutPostRedisplay();
}

void DoSpecial(int key, int x, int y)
{
    switch(key)
    {
    case GLUT_KEY_LEFT:
        nx -= step;
        break;
    case GLUT_KEY_RIGHT:
        nx += step;
        break;
    case GLUT_KEY_UP:
        ny += step;
        break;
    case GLUT_KEY_DOWN:
        ny -= step;
        break;
    }

    char info[128];
    sprintf(info, "x=%.2f, y=%.2f", nx, ny);
    glutSetWindowTitle(info);
    glutPostRedisplay();
}

void DoMouse(int button, int state, int x, int y)
{
    if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN)
    {
        bGray = !bGray;
        glutPostRedisplay();
    }
}

void DoDisplay()
{
    glClear(GL_COLOR_BUFFER_BIT);

    if (bGray)
    {
        glColor3f(0.5, 0.5, 0.5);
    }
    else
    {
        glColor3f(1.0, 1.0, 1.0);
    }

    glBegin(GL_POLYGON);
    glVertex2f(nx, ny + size);  // 키보드 이동 거리만큼 좌표 이동
    glVertex2f(nx - size, ny - size);
    glVertex2f(nx + size, ny - size);
    glEnd();
    glFlush();
}

```

 

<!-- https://gph.is/g/4be8GAO -->
<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/Q7XUJOso6vkiT96PDv" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>
 

`void glutPostRedisplay(void);`

이 함수는 윈도우가 다시 그려져야 함을 표시하기만 할 뿐 즉시 그리기를 하지는 않는다. 다시 그릴 필요가 있음(전문 용어로 무효하다고 표현한다)을 표시만 해 놓으면 메시지 루프가 적당한 때에 Display 콜백을 호출하도록 되어 있다.

팝업 메뉴는 다음 함수로 생성한다.

`int glutCreateMenu(void (*func)(int value));`

인수로 메뉴 항목을 선택했을 때 호출될 콜백 함수를 지정한다. 콜백 함수는 선택된 메뉴 항목의 ID를 인수로 전달받는다. 콜백은 메뉴 항목의 ID에 따라 대응되는 처리를 할 것이다. 이 함수는 메뉴 생성 후 메뉴의 ID를 리턴하는데 이 ID를 다음 함수로 전달함으로써 현재 메뉴로 지정한다.

`void glutSetMenu(int menu);` `int glutGetMenu(void);`

새로 생성된 메뉴는 자동으로 현재 메뉴가 되므로 굳이 `glutSetMenu`를 호출하지 않아도 상관없다. 둘 이상의 메뉴를 생성해 놓고 번갈아 사용하고 싶을 때 glutSetMenu가 필요하다. 다음 함수는 메뉴를 파괴한다.

`void glutDestroyMenu(int menu);`

메뉴는 껍데기일 뿐이므로 이 안에 실제 명령에 해당하는 내용물을 채워야 한다. 메뉴 내에 메뉴 항목이나 서브 메뉴는 다음 함수로 추가한다. 캡션 문자열과 항목의 ID를 지정한다.

`void glutAddMenuEntry(char *name, int value);` `void glutAddSubMenu(char *name, int menu);`

다음 함수들은 메뉴를 마우스 버튼에 부착하거나 뗀다. 어떤 동작에 대해 메뉴를 호출할 것인지를 지정하는데 `GLUT_LEFT_BUTTON`, `GLUT_MIDDLE_BUTTON`, `GLUT_RIGHT_BUTTON` 중 하나의 값을 지정하되 메뉴는 통상 마우스 오른쪽 버튼에 부착한다.

`void glutAttachMenu(int button);` `void glutDetachMenu(int button);`

다음 함수는 메뉴 항목을 실행중에 변경한다. 순서값으로 변경 대상 항목을 지정하고 새로운 캡션, 새로운 ID를 지정한다. 순서값은 위쪽부터 순서대로 1이다.

`void glutChangeToMenuEntry(int entry, char *name, int value);`

 

다음 예제는 팝업 메뉴로 도형의 색상과 배경 색상을 변경한다.

```c
#include <windows.h>
#include <gl/glut.h>

void DoDisplay();
void DoMenu(int value);

int APIENTRY WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance
                     ,LPSTR lpszCmdParam,int nCmdShow)
{
    glutCreateWindow("OpenGL");

    // 서브 메뉴 미리 준비
    GLint SubMenu = glutCreateMenu(DoMenu);
    glutAddMenuEntry("Red", 4);
    glutAddMenuEntry("Green", 5);
    glutAddMenuEntry("Blue", 6);

    // 메인 메뉴 생성
    glutCreateMenu(DoMenu);
    glutAddMenuEntry("White", 1);
    glutAddMenuEntry("Black", 2);
    glutAddMenuEntry("Gray", 3);

    // 서브 메뉴를 메인 메뉴에 붙인다.
    glutAddSubMenu("Triangle Color", SubMenu);
    glutAttachMenu(GLUT_RIGHT_BUTTON);

    glutDisplayFunc(DoDisplay);
    glColor3f(1.0, 0.0, 0.0);
    glutMainLoop();

    return 0;

}

void DoMenu(int value)
{
    switch(value)
    {
    case 1:
        glClearColor(1.0, 1.0, 1.0, 1.0);
        break;
    case 2:
        glClearColor(0.0, 0.0, 0.0, 1.0);
        break;
    case 3:
        glClearColor(0.5, 0.5, 0.5, 1.0);
        break;
    case 4:
        glColor3f(1.0, 0.0, 0.0);
        break;
    case 5:
        glColor3f(0.0, 1.0, 0.0);
        break;
    case 6:
        glColor3f(0.0, 0.0, 1.0);
        break;
    }
    glutPostRedisplay();

}

void DoDisplay()
{
    glClear(GL_COLOR_BUFFER_BIT);

    glBegin(GL_TRIANGLES);
    glVertex2f(0.0, 0.5);
    glVertex2f(-0.5, -0.5);
    glVertex2f(0.5, -0.5);
    glEnd();
    glFlush();
}

```

 

<!-- https://gph.is/g/ZYm6pWn -->
<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/YpTo1IgULqeuKhfYQS" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

## 14\. GLUT: 애니메이션

GLUT은 반복적인 처리가 필요할 때 주로 사용되는 타이머 이벤트도 제공한다. 타이머 구현은 운영체제마다 다르지만 GLUT의 다음 함수를 호출하면 운영체제에 상관없이 타이머를 만들 수 있다. 다음 함수로 타이머 콜백 함수를 등록한다.

`void glutTimerFunc(unsigned int millis, void (*func)(int value), int value);`

`millis` 후에 `func` 함수를 호출하며 인수로 `value`를 전달한다. value는 타이머 콜백으로 전달되어 작업 거리를 지시하는데 타이머의 용도가 하나뿐이라면 아무 값이나 주어도 상관없다. 콜백을 등록해 놓으면 `millis` 후에 콜백 함수가 호출된다. 주의할 것은 일반적인 타이머와는 달리 주기적으로 호출되는 것이 아니라 딱 한번만 호출된다는 것이다.

타이머의 용도는 여러 가지가 있지만 대표적인 예가 애니메이션이다. 일정한 간격으로 출력을 계속 바꾸면 그림이 움직이는 것처럼 보인다. 애니메이션을 할 때는 더블 버퍼링을 사용하는 것이 좋다. 한 버퍼에서 지웠다 그리기를 계속 반복하면 깜박거림이 발생하여 눈에 거슬리므로 두 개의 버퍼를 교대로 사용한다. 초기화시에 `GLUT_DOUBLE` 플래그를 전달하면 OpenGL은 두 개의 버퍼를 준비한다.

`glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);`

두 버퍼는 각각 전면(Front buffer 또는 On Screen Buffer), 후면(Back Buffer 또는 Off Screen Buffer)라고 부른다. 전면 버퍼는 현재 화면에 출력된 버퍼이며 백 버퍼는 안쪽에 숨겨진 버퍼이다. 더블 버퍼링 옵션이 켜지면 그래픽 카드는 항상 전면 버퍼를 모니터에 뿌리지만 모든 그리기 동작은 백 버퍼에서 수행된다. 그래서 그리는 중간 과정이 사용자 눈에 보이지 않으며 깜박거림도 없다. 백 버퍼에 그림을 다 그렸으면 다음 함수로 버퍼를 통째로 교체한다.

`glutSwapBuffers();`

버퍼를 교체하는 것 자체가 출력이므로 `glFlush`는 호출하지 않아도 상관없다.

다음 예제는 삼각형 도형을 좌우로 이동시키는 간단한 애니메이션을 보여준다.

```c
#include <windows.h>
#include <gl/glut.h>

void DoDisplay();
void DoTimer(int value);

const GLfloat size = 0.2;
GLfloat x;
GLfloat dx = 0.02;

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance
       , LPSTR lpszCmdParam,int nCmdShow)
{

     glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB); // 두 개의 버퍼 준비
     glutCreateWindow("OpenGL");
     glutDisplayFunc(DoDisplay);
     glutTimerFunc(30, DoTimer, 1);
     glutMainLoop();
     return 0;
}

void DoTimer(int value)
{
     x += dx;
     // 삼각형 가로 길이가 캔버스 범위를 벗어날 경우
     if (x + size > 1 || x - size < -1) {
          dx *= -1;
     }
     glutPostRedisplay();
     glutTimerFunc(30, DoTimer, 1);
}

void DoDisplay()
{
     glClear(GL_COLOR_BUFFER_BIT);

     glBegin(GL_POLYGON);
     glVertex2f(x, size);
     glVertex2f(x - size, -size);
     glVertex2f(x + size, -size);
     glEnd();
     glutSwapBuffers(); // 버퍼 교체
}

```

<!-- https://gph.is/g/E0l7QJ8 -->

<div style="width:100%;height:0;padding-bottom:38%;position:relative;"><iframe src="https://giphy.com/embed/lMCxAyFAupoJhAyYmK" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

DoTimer의 마지막 줄에서 자기 자신을 0.03초 후에 다시 호출함으로써 이동이 계속 반복된다. 이 처리가 생략되면 타이머는 딱 한번만 호출되므로 애니메이션이 실행되지 않을 것이다.

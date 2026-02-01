Product Requirement Document: 성장코치 '도경'

Overview

심리적 방어기제를 넘어 커리어 목표로 이끄는 에이전틱 코칭 솔루션

본 PRD는 대학생 및 취준생의 실행력을 높이고 커리어 방향성을 잡아주는 PC 웹 기반 서비스를 정의합니다.
핵심 비전은 사용자가 강의 계획서나 공지사항을 업로드하면 AI가 이를 분석하여 일정을 등록하고, 사용자가 심리적 저항(하기 싫음, 두려움)을 느낄 때 **AI 코치 '도경'**이 대화를 통해 멘탈을 케어하며 실행 가능한 단위로 일정을 재조정해주는 것입니다.

Goals

Key Functional Requirements (Must-haves)

Smart Task Parser: PDF(강의 계획서), 이미지(공지사항)를 업로드하면 Upstage OCR을 통해 과업명, 마감일, 중요도를 추출하여 DB화.

Calendar-First UI: 메인 화면은 직관적인 주간/월간 캘린더 형태로 구성하며, 추출된 일정을 시각적으로 배치.

Collapsible AI Coach (Sidebar): 우측 사이드바(토글 가능)에서 언제든 '도경'이와 대화할 수 있으며, 대화 내용은 캘린더 데이터와 실시간 연동.

Emotional Diagnosis to Action: 대화를 통해 사용자의 감정 상태(불안, 회피)를 진단하고, 이를 바탕으로 스케줄을 변경하거나 쪼개서 제안(Rescheduling).

Career Alignment Dashboard (학습 기록지): 수행한 과업이 사용자의 목표 직무(예: PM)와 얼마나 연관되어 있는지 분석해주는 별도의 '회고/기록' 페이지 제공.

PC Web Optimization: 학습 및 계획 수립이 주로 이루어지는 데스크탑 환경(Chrome 1920x1080)에 최적화된 UX.

Non-Goals

What we are NOT building

General Purpose Calendar: 생일, 기념일, 친구 약속 등 단순 생활 일정을 관리하는 범용 캘린더 기능은 우선순위에서 배제 (Google Cal 대체 아님).

Mobile Native App: 이번 버전에서는 PC Web에 집중하며, 모바일 앱 개발은 포함하지 않음.

Job Posting Portal: 채용 공고를 검색하거나 추천해주는 기능은 제외 (내부 데이터 분석에 집중).

Social Features: 친구와 일정을 공유하거나 경쟁하는 기능은 포함하지 않음.

Audience

Primary User: The "Anxious Achiever"

이 서비스의 주 사용자는 "바쁘게 살지만 불안한" 고학년 대학생입니다.

그들은 데스크탑(노트북) 앞에서 과제를 하고 강의를 듣습니다.

그들은 **"계획을 세우는 것"**까지는 잘하지만, **"실행하는 순간"**에 완벽주의나 두려움으로 인해 유튜브를 보며 회피하는 경향이 있습니다.

그들은 단순한 '알림(Notification)'보다는, 나의 상황을 이해해주고 "일단 이것부터 하자"고 다독여주는 **'페이스메이커'**를 원합니다.

Existing solutions and issues

Why current tools fail

Notion & Planners:

Issue: '입력' 자체가 노동입니다. 강의 계획서를 보고 일일이 타이핑해야 하며, 심리적 케어 기능이 전혀 없습니다.

Google Calendar:

Issue: 시간 관리는 해주지만 '방향성'을 알려주지 않습니다. 이 일이 내 커리어에 도움이 되는지 알 수 없습니다.

School Counseling Center:

Issue: 접근성이 낮고, 새벽 시간이나 시험 기간 등 가장 필요할 때 즉각적인 도움을 받을 수 없습니다.

Assumptions

Core beliefs validated by persona

Interaction: 사용자는 일정 관리(캘린더)를 메인으로 보면서, 필요할 때만 AI(사이드바)를 호출하여 상담받는 하이브리드 UX를 선호할 것이다.

Data Input: 사용자는 귀찮은 타이핑 대신 '파일 업로드(PDF, 이미지)' 방식을 압도적으로 선호할 것이다.

Trust: 사용자는 자신의 솔직한 감정("지금 너무 하기 싫어")을 털어놓았을 때, AI가 비판하지 않고 공감해준다면 행동 제안을 수용할 것이다.

Device: 심도 있는 계획 수립과 회고는 모바일보다 PC 환경에서 이루어진다.

Constraints

Technical & Design Boundaries

Frontend: React.js 기반의 Single Page Application (SPA).

Backend: Python 기반 (FastAPI 또는 Django) - Upstage/Solar API 연동 필수.

AI Models:

문서 파싱: Upstage Document AI (OCR).

추론 및 코칭: Upstage Solar LLM.

Design System: 신뢰감을 주는 차분한 톤앤매너 (파스텔 톤), 텍스트 가독성 최우선.

Performance: 문서 업로드 후 파싱 완료까지 15초 이내 응답 목표.

Key use cases

1. Smart Parsing & Scheduling (Onboarding)

User Action: 사용자가 "데이터베이스 수업 강의계획서.pdf"를 드래그 앤 드롭으로 업로드한다.

System Action:

Upstage Document AI가 표 구조를 인식하여 [과제명, 마감일, 설명]을 추출.

Solar가 해당 과제의 중요도와 소요 시간을 추론.

캘린더 UI에 해당 일정들을 '제안 상태(Draft)'로 배치하여 보여줌.

사용자가 "확인" 버튼을 누르면 최종 등록.

2. Mental Care & Micro-Action (Daily Loop)

User Action: 캘린더의 '중간고사 공부' 일정을 클릭하지 않고 계속 미루고 있다. 사이드바 챗을 열어 "아 진짜 시작하기 싫다..."라고 입력한다.

System Action:

감정 진단: Solar가 사용자의 발화에서 '회피(Avoidance)'와 '압박감(Pressure)'을 감지.

공감 및 제안: "준비할 게 많아서 막막하시군요. 다 할 필요 없어요. 지금 딱 10분만 '목차 읽기'만 해볼까요?"라고 응답.

UI 반영: 사용자가 "응, 그건 할 수 있어"라고 하면, 캘린더의 3시간짜리 '공부' 블록을 10분짜리 '목차 읽기' 블록으로 실시간 변경.

3. Career Alignment Check (Retrospective)

User Action: '학습 기록지' 탭으로 이동한다.

System Action:

지난주에 완료한 태스크들을 분석.

사용자의 목표(예: PM)와 비교하여 **"이번 주는 기획 역량 관련 활동이 70%였어요. 잘하고 있습니다!"**와 같은 피드백 제공.

부족한 역량을 채울 수 있는 다음 주 행동 가이드 제시.

Research

User Research (Persona Validation)

Q: 왜 계획을 지키지 못하는가?

인터뷰 결과, 80% 이상의 대학생이 "해야 하는 건 알지만, 잘하고 싶은 마음에 시작을 미루다가(완벽주의) 결국 포기한다"고 응답.

-> 결론: 강압적인 알림이 아니라, 심리적 부담을 덜어주는 'Task Slicing(잘게 쪼개기)' 기능이 필수적임.

Technical Research (Feasibility)

Q: Upstage Document AI의 파싱 정확도는?

테스트 결과, 정형화된 표(Table)뿐만 아니라 비정형 텍스트에서도 날짜와 핵심 키워드 추출 성능이 우수함.

단, 손글씨의 경우 인식률 변동이 있으므로 사용자가 수정할 수 있는 'Edit Mode' UI가 반드시 필요함.
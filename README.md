# wanted_pre_onboarding
Wanted 프리 온보딩 백엔드 코스 4차 선발과제

## 1. 요구사항 분석
### Modeling

![](https://i.imgur.com/DsY75jP.png)
채용을 위한 웹 서비스 ER Diagram

- 한 개의 회사가 여러 개의 채용공고를 업로드 할 수 있어야 하므로, Company 와 JobPosting 은 One-to-Many relation을 가집니다. 
- JobApplication은 여러 다른 User가 같은 JobPosting에 대하여 지원할 수 있으므로 JobApplication과 JobPosting은 One-to-Many relation을 가집니다.
- 사용자(User)는 1회만 지원(JobApplication)이 가능하므로, User 와 JobApplication은 One-to-One relation을 가집니다.

각 모델의 필드명과 설명은 다음과 같습니다.

#### Company(회사)
- id : 회사 id 
- name : 회사 명 
- country : 회사 국가
- region : 회사 지역 

#### JobPosting(채용공고)
- id : 채용공고 id
- compenstation : 채용 보상금
- technique : 사용 기술
- content : 채용 내용
- companyId : 회사 id

#### User(사용자)
- id : 사용자 id
- name : 사용자 이름
- email : 사용자 이메일

#### JobApplication(지원)
- jobPostingId : 채용공고 id
- userId : 사용자 id

<br />

### Required APIs
#### Company
- create company
- find a company 
- find many companies
- delete company 

#### JobPosting
- create job posting (요구사항 1)
- find job postings with search functionality (요구사항 4-1, 4-2)
- find a detailed job posting (요구사항 5)
- update job posting (요구사항 2)
- delete job posting (요구사항 3)

#### User
- create user
- find users
- find a user 
- delete user 

#### JobApplication
- create job application (요구사항 6)
- find job applications
- find a job application by userId
- find a job application by jobPostingId
- delete job application


## 2. 구현 
### Tech Stack
- NestJS (Node.js)
- TypeORM (ORM)
- mysql (RDBMS)

### Database 생성 및 App 과 연결 
- Database 는 docker mysql:8 image를 상용하여 컨테이너로 로컬 환경에 구동시켰습니다. 
- TypeORM configuration을 위하여 `src/config/env` 폴더에 `.development.env` 파일을 만들어 development environment에서의 환경 변수를 등록하였습니다. 
- `ormConfig.ts` 작성
    - TypeOrmModule configuration을 위해 TypeOrmModuleOption을 반환하는 함수를 가진 클래스를 정의하고, 이를 `App.module.ts` 에서 import 하여 설정 값으로 사용하였습니다. 
    - .development.env 의 내용은 다음과 같습니다. 
        ```
        DATABASE_TYPE=mysql
        DATABASE_PORT=3308
        DATABASE_HOST=localhost
        DATABASE_USERNAME=root
        DATABASE_PASSWORD=test
        DATABASE_SYNCHRONIZE=true
        DATABASE_NAME=wanted_pre_onboarding
        ```
        

### TypeORM Entity 정의
company, job-posting, user, job-application에 대한 TyneORM Entity를 정의하였습니다. 
각 entity와 entities의 relations는 `1. 요구사항 분석`에서 기술한 내용을 기반으로 정의되었습니다. 

- Company Entity: `src/company/entities/company.entity.ts`
- JobPosting Entity: `src/job-posting/entities/job-posting.entity.ts`
- User Eneity: `src/user/entities/user.entity.ts`
- JobApplication Entity: `src/job-application/entities/job-application.entity.ts`


### 요구사항 1-6을 만족하기 위해 필요한 부가적인 API 생성 
요구사항 1-6 을 만족하기 위해서는 Company, User 데이터가 필요합니다. 왜냐하면 JobPosting은 CompanyId를 Foreign Key로 하고 JobApplication은 userId와 jobPostingId를 Foreign Key로 하기 때문입니다. 

따라서 Company, User 에 대한 CRUD 작업을 제공하는 API를 구현하였습니다. 

각 모델에 대한 생성 API(POST) 에서는, 데이터에 대한 Validation 및 Serialization을 위하여  DTO(Data Transfer Object)와 `class-transformer`와 `class-validator`를 활용하였습니다. 

- User (src/user/user.contorller.ts)
    - POST /user (사용자 생성)
        - `create-user.dto.ts`: data validation & serialization
            - name: st ring
            - email: string
            
            
    - GET /user (사용자 리스트 조회)
    - GET /user/:id (사용자 조회)
    - DELETE /user/:id (사용지 삭제)



- Company (src/company/company.controller.ts)
    - POST /company (회사 생성)
        - `create-company.dto.ts`: data validation & serialization
            - name: string
            - country: string
            - region: string
            
    - GET /company (회사 리스트 조회)
    - GET /company/:id (회사 조회)
    - DELETE /company/:id (회사 삭제)


### 요구사항 구현 
#### JobPosting (src/job-posting/job-posting.controller.ts)
- POST /job-posting (요구사항 1. 채용공고 등록)
    - `create-job-posting.dto.ts`: data validation & serialization
        - companyId: number
        - position: string
        - compensation: number
        - content: string
        - technique: string

    Response example
    ```
    POST /job-posting
    Content-Type: application/json
    
    {
        "companyId": 1,
        "position": "Flask 백엔드 개발자",
        "compensation": 2000000,
        "content": "원티드랩에서 Flask 백엔드 개발자를 채용합니다...",
        "technique": "Flask"
    }
    ```
    ```
    {
        "position": "Flask 백엔드 개발자",
        "compensation": 2000000,
        "technique": "Flask",
        "content": "원티드랩에서 Flask 백엔드 개발자를 채용합니다...",
        "company": {
            "id": 1,
            "name": "원티드랩",
            "country": "한국",
            "region": "서울"
        },
        "id": 5
    }
    ```


- GET /job-posting (요구사항 4-1, 4-2. 채용공고 목로 가져오기[search 기능 구현])
    - `job-position-query-parameter.dto.ts`: Query parameter validation & Serialization
        - search?: string
    
    Response example
    ```
    GET /job-posting?search=Django
    ```
    ```
    [
        {
            "id": 3,
            "companyName": "네이버",
            "country": "한국",
            "region": "판교",
            "position": "Django 백엔드 개발자",
            "compensation": 1000000,
            "technique": "Django"
        },
        {
            "id": 4,
            "companyName": "원티드랩",
            "country": "한국",
            "region": "서울",
            "position": "Django 백엔드 개발자",
            "compensation": 1500000,
            "technique": "Django"
        }
    ]
    ```

- GET /job-posting/:id (요구사항 5. 채용 상세 페이지 가져오기[해당 회사가 올린 다른 채용공고 포함])

    *otherJobPosotingOfThisCompany : 해당회사가 올린 다른 채용공고 id list
    
    Response example
    ```
   {
        "id": 1,
        "companyName": "원티드랩",
        "country": "한국",
        "region": "서울",
        "position": "백엔드 주니어 개발자",
        "compensation": 1000000,
        "technique": "Python",
        "content": "원티드 랩에서 백엔드 주니어 개발자를 채용합니다.",
        "otherJobPostingOfThisCompany": [
            4
        ]
    }
    ```
- PATCH /job-posting/:id (요구사항 2. 채용공고 수정)
    - `update-job-posting.dto.ts`: data validation & serialization
        - position: string
        - compensation: number
        - content: string
        - technique: string
    
    Response example
    ```
    {
        "id": 1,
        "position": "Django 백엔드 개발자",
        "compensation": 2000000, // 수정됨 
        "technique": "Django",
        "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
    }
    ```

- DELETE /job-posting/:id (요구사항 3. 채용공고 삭제)

    Response example
    ```
    DELETE /job-posting/5
    ```
    ```
    {
        "message": "Job Posting (id: 5) was deleted."
    }
    ```

- JobApplication (src/job-application/job-application.ts)
    - POST /job-application (요구사항 6. 사용자가 채용공고에 지원)
        - `create-job-application.dto.ts`: data validation & serialization
            - userId: number
            - jobPostingId: number 
        
        Response example
        ```
        POST /jop-application
        Content-Type: application-json
        
        {
            "userId": 3,
            "jobPostingId": 3
        }
        ```
        ```
        {
            "message": "Job Application done.",
            "jobApplicationId": 6
        }
        ```
    - GET /job-application
        - Get job applications list 
        
        Response example
        ```
        [
            {
                "id": 4,
                "jobPosting": {
                    "id": 1,
                    "position": "Django 백엔드 개발자",
                    "compensation": 2000000,
                    "technique": "Django",
                    "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
                },
                "user": {
                    "id": 2,
                    "name": "우영우",
                    "email": "wyw@gmail.com"
                }
            },
            {
                "id": 5,
                "jobPosting": {
                    "id": 1,
                    "position": "Django 백엔드 개발자",
                    "compensation": 2000000,
                    "technique": "Django",
                    "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
                },
                "user": {
                    "id": 1,
                    "name": "김성진",
                    "email": "sys.ryan0902@gmail.com"
                }
            }
        ]
        ```
        
    - GET /job-application/user/:userId
        - Get a job application by user id
        
        Response example
        ```
        GET /job-application/user/1
        ```
        ```
        {
            "id": 5,
            "user": {
                "id": 1,
                "name": "김성진",
                "email": "sys.ryan0902@gmail.com"
            },
            "jobPosting": {
                "id": 1,
                "position": "Django 백엔드 개발자",
                "compensation": 2000000,
                "technique": "Django",
                "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
            }
        }
        ```
    - GET /job-application/job-posting/:jobPostingId
        - Get a job application by job posting id 
        
        Response example
        ```
        GET /job-application/job-posting/1
        ```
        ```
        [
            {
                "id": 4,
                "user": {
                    "id": 2,
                    "name": "우영우",
                    "email": "wyw@gmail.com"
                },
                "jobPosting": {
                    "id": 1,
                    "position": "Django 백엔드 개발자",
                    "compensation": 2000000,
                    "technique": "Django",
                    "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
                }
            },
            {
                "id": 5,
                "user": {
                    "id": 1,
                    "name": "김성진",
                    "email": "sys.ryan0902@gmail.com"
                },
                "jobPosting": {
                    "id": 1,
                    "position": "Django 백엔드 개발자",
                    "compensation": 2000000,
                    "technique": "Django",
                    "content": "원티드랩에서 장고 백엔드 개발자를 채용합니다..."
                }
            }
        ]
        ```
    - DELETE /job-application/:id
        - delete job application
        
        Response example
        ```
        {
            "message": "Job Application (id: 6) was deleted."
        }
        ```


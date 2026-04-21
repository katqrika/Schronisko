```mermaid
erDiagram
    USER ||--o{ VISIT : "with"
    USER ||--o{INCIDENT: "what happend?"
    USER ||--o{ANNOUNCEMENT: "only admin"
    ANIMAL ||--o{ VISIT : "with"
    USER ||--o{ FAVORITE : "follow"
    ANIMAL ||--o{ FAVORITE : "followed"
    ANIMAL ||--o{ INCIDENT: "what happend?"
    INCIDENT ||--|| VISIT: "when?"
    

    USER {
        int id PK
        string password
        string phone
        string name
        string last_name
        string role
    }

    ANIMAL {
        int id PK
        string name
        string species
        string breed
        string gender
        int age
        datetime stay_from
        datetime adoption
        boolean sick
        string status
        string other 
        string  box_number
    }

    VISIT {
        int id PK
        datetime start
        datetime end
        int animal_id FK
        int user_id FK
    }

    FAVORITE {
        int user_id FK
        int animal_id FK
    }

    ANNOUNCEMENT {
        int id PK
        string title
        text content
        datetime created_at
        int author_id FK
    }

    INCIDENT {
        int id PK
        int id_animal FK
        int visit_id FK
        string title
        text content
        datetime created_at
        string priority "low/high"
    }


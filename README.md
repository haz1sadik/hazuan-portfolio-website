# hazuan-portfolio-website

```mermaid
    erDiagram
    User ||--o{ Blog : "writes"
    User ||--o{ Guide : "writes"
    User ||--o{ CtfWriteup : "writes"
    CtfEvent ||--o{ CtfWriteup : "contains"

    User {
        uuid id PK
        string email UK
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    CtfEvent {
        uuid id PK
        string name UK
        string slug UK
        string description
        timestamp date
        timestamp created_at
        timestamp updated_at
    }

    Blog {
        uuid id PK
        uuid user_id FK
        string title
        string slug UK
        text content
        timestamp created_at
        timestamp updated_at
    }

    Guide {
        uuid id PK
        uuid user_id FK
        string title
        string slug UK
        text content
        timestamp created_at
        timestamp updated_at
    }

    CtfWriteup {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        string title
        string slug UK
        string category
        string difficulty
        text content
        timestamp created_at
        timestamp updated_at
    }

    Image {
        uuid id PK
        string r2_key UK
        string public_url
        string alt_text
        timestamp created_at
        timestamp updated_at
    }
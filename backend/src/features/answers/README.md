# Answers API

API для работы с ответами на формы.

## Endpoints

### Submit Answers
- **POST** `/forms/:form_id/answers`
- Отправка ответов на форму
- Требует аутентификации

### Get Answers by Form
- **GET** `/forms/:form_id/answers`
- Получение списка всех групп ответов для формы
- Только владелец формы

### Get Answers Summary
- **GET** `/forms/:form_id/answers/summary`
- Получение сводки по всем ответам формы
- Только владелец формы

**Response:**
```json
{
  "total_responses": 15,
  "questions_summary": [
    {
      "id": "uuid",
      "text": "What is your name?",
      "type": "text",
      "response_count": 15
    }
  ],
  "recent_responses": [
    {
      "id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": "uuid"
    }
  ]
}
```

### Get Question Summary
- **GET** `/forms/:form_id/answers/summary/:question_id`
- Получение детальной сводки по конкретному вопросу
- Только владелец формы

**Response:**
```json
{
  "question": {
    "id": "uuid",
    "text": "What is your name?",
    "type": "text"
  },
  "total_answers": 15,
  "unique_answers": 12,
  "average_length": 8,
  "most_common_answers": [
    {
      "value": "John",
      "count": 3
    }
  ],
  "recent_answers": [
    {
      "value": "Alice",
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": "uuid"
    }
  ]
}
```

### Get Answers Group by ID
- **GET** `/forms/:form_id/answers/:answers_group_id`
- Получение конкретной группы ответов
- Владелец формы или автор ответов

### Delete Answers Group
- **DELETE** `/forms/:form_id/answers/:answers_group_id`
- Удаление группы ответов
- Владелец формы или автор ответов

## Usage Examples

### Frontend Integration

```typescript
// Get form summary
const summary = await fetch(`/forms/${formId}/answers/summary`)

// Get question details
const questionSummary = await fetch(`/forms/${formId}/answers/summary/${questionId}`)

// Switch between individual responses and summary
const responses = await fetch(`/forms/${formId}/answers`)
```

### UI Tab Structure

```typescript
const tabs = [
  {
    id: 'summary',
    label: 'Summary',
    endpoint: `/forms/${formId}/answers/summary`
  },
  {
    id: 'responses',
    label: 'Individual Responses',
    endpoint: `/forms/${formId}/answers`
  }
]
``` 
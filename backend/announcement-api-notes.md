# Announcement API Notes

## `Admin_addEventController.js`

### Purpose
Creates a new event in the `upcoming_events` table.

### Request Requirements
- Body fields:
  - `title`
  - `short_description`
  - `description`
  - `start_date`
  - `end_date`
  - `faculty_contact`
  - `student_contact`
  - `event_type`
  - `event_link`
  - `registration_start_date`
  - `registration_end_date`
- File upload:
  - brochure/image file through `req.file`

### What It Does
- Receives event details from the request body
- Reads the uploaded file URL from middleware
- Inserts a new row into `upcoming_events`
- Stores the registration start and end dates also

### Response
Returns a success message and the inserted event row.

Example:

```json
{
  "message": "Event added successfully",
  "data": {
    "event_id": 8,
    "event_title": "Verification Event",
    "event_short_description": "Short description",
    "event_description": "Full description",
    "brochure_url": "cloudinary-url",
    "start_date": "2026-04-10",
    "end_date": "2026-04-12",
    "faculty_contact": "Dr. Kumar",
    "student_contact": "Anita",
    "event_type": "Workshop",
    "event_link": "https://example.com",
    "registration_start_date": "2026-04-01",
    "registration_end_date": "2026-04-09"
  }
}
```

## `Admin_AnnouncementPageFetchController.js`

### Purpose
Fetches a combined announcement list from both `upcoming_events` and `upcoming_celebrations`.

### Request Requirements
- No body required
- Usually called through a `GET` request

### What It Does
- Fetches summary data from `upcoming_events`
- Fetches summary data from `upcoming_celebrations`
- Combines both using `UNION ALL`
- Returns one merged announcement list

### Response
Returns:
- `success`
- `data` array

Fields returned:
- `title`
- `short_description`
- `brochure_url`
- `type`

Note:
- It does not return `registration_start_date`
- It does not return `registration_end_date`

Example:

```json
{
  "success": true,
  "data": [
    {
      "title": "Workshop 1",
      "short_description": "Intro session",
      "brochure_url": "url",
      "type": "event"
    },
    {
      "title": "Pongal Celebration",
      "short_description": "Festival event",
      "brochure_url": "url",
      "type": "celebration"
    }
  ]
}
```

## `Admin_DeleteSpecificEventController.js`

### Purpose
Deletes one specific event or celebration.

### Request Requirements
- URL params:
  - `id`
  - `type`
- `type` must be:
  - `event`
  - `celebration`

### What It Does
- If `type` is `event`, deletes from `upcoming_events`
- If `type` is `celebration`, deletes from `upcoming_celebrations`

### Response
Returns a success message if deleted.

Example:

```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

## `Admin_EditEventOrCelebrationController.js`

### Purpose
Updates one specific event or celebration.

### Request Requirements
- URL params:
  - `id`
  - `type`
- Body for `event`:
  - `title`
  - `short_description`
  - `description`
  - `brochure_url`
  - `start_date`
  - `end_date`
  - `faculty_contact`
  - `student_contact`
  - `event_link`
  - `registration_start_date`
  - `registration_end_date`
- Body for `celebration`:
  - `title`
  - `short_description`
  - `description`
  - `brochure_url`
  - `start_date`
  - `end_date`
  - `faculty_contact`
  - `student_contact`

### What It Does
- Checks whether it is updating an event or a celebration
- Runs the corresponding `UPDATE` query
- For events, it also updates:
  - `registration_start_date`
  - `registration_end_date`

### Response
Returns a success message.

Example:

```json
{
  "success": true,
  "message": "Updated successfully"
}
```

## `Admin_FetchSpecificEventOrCelebrationController.js`

### Purpose
Fetches one full row of a specific event or celebration.

### Request Requirements
- URL params:
  - `id`
  - `type`

### What It Does
- If `type` is `event`, fetches from `upcoming_events`
- If `type` is `celebration`, fetches from `upcoming_celebrations`
- Returns one formatted object

### Response
Returns:
- `success`
- `data`

For `event`, returned fields:
- `id`
- `title`
- `short_description`
- `description`
- `brochure_url`
- `start_date`
- `end_date`
- `registration_start_date`
- `registration_end_date`
- `faculty_contact`
- `student_contact`
- `event_link`

For `celebration`, returned fields:
- `id`
- `title`
- `short_description`
- `description`
- `brochure_url`
- `start_date`
- `end_date`
- `faculty_contact`
- `student_contact`

Example:

```json
{
  "success": true,
  "data": {
    "id": 8,
    "title": "Verification Event Updated Again",
    "short_description": "Updated again after server restart",
    "description": "Full event description",
    "brochure_url": "cloudinary-url",
    "start_date": "2026-04-15",
    "end_date": "2026-04-17",
    "registration_start_date": "2026-04-05",
    "registration_end_date": "2026-04-14",
    "faculty_contact": "Dr. Kumar Final",
    "student_contact": "Anita Final",
    "event_link": "https://example.com/event-final"
  }
}
```

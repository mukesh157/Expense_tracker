## Design Decisions
- Used SQLite for simplicity and persistence
- Stored money as integer (paise) to avoid float precision issues
- Implemented Idempotency-Key to handle retries safely

## Trade-offs
- No authentication
- No pagination
- Simple UI

## Future Improvements
- Category analytics
- Charts
- Authentication
- Better error handling
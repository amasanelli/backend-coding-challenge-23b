# backend-coding-challenge-23b

## build

`cd alarms`

`npm install`

## run

`docker-compose up -d`

`npm start`

access localhost:3000/docs

now you can create an user, login and then create alarms

to create a one-shot alarm send this payload
```
{
    "message": "test",
    "subject": "test",
    "fire": "2023-03-28T02:20:24Z"
}
```

to create a daily alarm send this payload
```
{
    "message": "test",
    "subject": "test",
    "fire": "2023-03-28T02:20:24Z",
    "daily": true
}
```

to create a monthly alarm send this payload
```
{
    "message": "test",
    "subject": "test",
    "fire": "2023-03-28T02:20:24Z",
    "monthly": true
}
```

to create a multiple-days alarm send this payload
```
{
    "message": "test",
    "subject": "test",
    "fire": "2023-03-28T02:20:24Z",
    "multipleDays": {
        "monday": true,
        "friday": true
    }
}
```
## test


# gdnsdctl-rest

## Install and run
To install this software, install nodejs and npm first and then run:
```bash
git clone https://github.com/dlemper/gdnsdctl-rest.git
cd gdnsdctl-rest
npm install
node .
```
This service will start gdnsd for you and exit with the same status code as gdnsd, if gdnsd exits.

## API
This service provides a REST API for gdnsdctl (gdnsd/3.x) with the following endpoints:

| HTTP Method | URL                | Request data                                                   | curl example                                                                                                                                           |
| ----------- | ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET         | /status            |                                                                | curl http://localhost:3000/status                                                                                                                      |
| GET         | /stats             |                                                                | curl http://localhost:3000/stats                                                                                                                       |
| GET         | /states            |                                                                | curl http://localhost:3000/states                                                                                                                      |
| POST        | /acme-dns-01       | ["example.org", "0123456789012345678901234567890123456789012"] | curl -X POST -H 'Content-Type: application/json' -d '["example.org", "0123456789012345678901234567890123456789012"]' http://localhost:3000/acme-dns-01 |
| DELETE      | /acme-dns-01-flush |                                                                | curl -X DELETE http://localhost:3000/acme-dns-01-flush                                                                                                 |
| PUT         | /replace           |                                                                | curl -X PUT http://localhost:3000/replace                                                                                                              |
| PUT         | /reload-zones      |                                                                | curl -X PUT http://localhost:3000/reload-zones                                                                                                         |
| PUT         | /stop              |                                                                | curl -X PUT http://localhost:3000/stop                                                                                                                 |

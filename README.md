# hungryScientist

## Before you start:

Make sure you have installed
- Node.js ≥ 20.19 or ≥ 22.12 (required by Vite)
- npm ≥ 10

## Install front and backend:

cd frontend
npm install

cd backend
npm install

## Run:

cd backend
node server.js

This will start the backend server at http://localhost:4000
On first run, the backend will create: backend/db.sqlite


In another terminal
cd frontend/hungry_scientist
npm run dev
This will start the fronend on http://localhost:5173


If you want to wipe all entries just delete the sqlite file and restart backend.


## Thought process:

I started out with the pen and paper just drawing out a simple frontend for the task. Then I set up my machine, which ofcourse gave me some dependancy issues with versions of Vite and Node, but that was solved quickly.

After initial setup I checked the recommended prefab components and which one I would need for my initial paper design of the solution. I tried to get as little components as possible, while still keeping UX/UI in mind. I realized this made me think about the Reddit system of upvoting and downvoting, so I kept that in mind. 

After the front-end was set I installed all backend dependancies. Most importantly:
- sqlite (for obvious reasons)
- express (for the API routes)
- cors (for cookies and communication between front and backend)
- swagger (something I wanted to add from the start so I could test backend things easily), to check it out just go to http://[localhost:4000/api-docs](http://localhost:4000/api-docs/)

After hooking both together through a simple api script on the front-end (api.ts) and the backend script (server.js), the first version was working well. I could vote, it was updating fine and sorted as well. Making a new eatery was also behaving normally with the proper checks. 

I ran into an issue, and that was when I would switch between up and downvote. It would remove the previous action but not do the opposite action (e.g. after upvote the delta should be -2). Then I added express-session so I could create a cookie and save the same session. This also allowed me to block double votes and finish the rest of the assignment. 

## The first things I would do if this was a real project:

- Write unit-tests (not my strongest skill, would love to learn that)
- Add pagination
- Remove upvote/downvote, like they do in Reddit. Now it was not listed as task.
- Add a map so people can add eateries at locations (like a proper Google Maps replacement)

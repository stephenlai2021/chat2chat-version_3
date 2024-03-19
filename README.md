# Chat2Chat V3

## Tech Stack

- Nextjs 14 as Framework
- Supabase Auth as Authentication
- Firebase as backend service
  - Firestore as database
  - Storage as File Storage
- Styling with Tailwindcss && DaisyUI

## Feacures

- theme is persist on server side so when page gets refreshed we won't see a flicker/flash or a blank screen, next-themes package is applied to achieve server side render

- Supabase auth is implemented on middleware and dashboard page, when user try to reach certain route such as '/', '/login' or '/register', supabase checks if the user is loggedin in middleware and redirect user to corresponding page. Supabase auth also implemented in dashboard page, because we need user credentail to get user data in order to get chatroom list.

## Why Choose Supabase Auth instead of Firebase Auth ?

Because Supabase auth is easy to implement, we can get the auth done by following the instructions in supabase docs.🥰 On the contrary, we can't find info about implementing Firebase server side auth in Nextjs app in firebase docs. 😅
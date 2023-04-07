---
title: Deploy to a subdomain based router
author: Xie Yuheng
date: 2023-04-04
---

# Serve and connect to reverse-proxy

Currently we can serve website and database,
and connecting to a reverse-proxy server,
where the reverse-proxy do subdomain based routing.

The Aim is to serve website and database locally
on the developer's machine (maybe laptop behind a internet router).

But the experience is that local machine's upload speed is slow.

# Deploy to a subdomain based router

Review our current use case, we should just
deploy website to a subdomain based router,
just like netlify.com and vercel.com.

With a one-machine solution, and without reverse-proxy,
the number of users that this router can serve
is limited by the machine that runs this router,
but this is ok for our current use case.

# The new plan

We should have a command `fidb router`
that serves a subdomain-based router.

Both for website and database.

Maybe we can merge `fidb reverse-proxy` into this router,
so that we can _deploy_ to the router or _connect_ to the router.

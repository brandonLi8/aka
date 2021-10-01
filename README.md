<!-- Copyright © 2019-2021 Brandon Li. All rights reserved. -->

<!--
 * README.md
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
!*-->

# AKA
[![npm](https://img.shields.io/npm/v/@brandonli8/aka)](https://www.npmjs.com/package/@brandonli8/aka)
[![Github](https://img.shields.io/github/license/brandonli8/aka)](https://github.com/brandonLi8/aka/blob/master/LICENSE)

AKA is a simple, **private** URL shortener/bookkeeper for **personal use** that is hosted locally.

For example, the URL `https://long-domain.com/foo/`, can be shortened to `aka/foo`.

AKA also allows for sub-routes of shortened URLS. So typing in `aka/foo/bar` in your browser will redirect you to `https://long-domain.com/foo/bar`.

## Why AKA?
AKA provides the same bookmarking that, for example, your bookmarks bar on your browser already provides. However, interacting with your keyboard is **faster** than interacting with your mouse and GUI. 

AKA provides short keyboard access to bookmark your most visited websites. 

AKA also gives instant access to sub-routes of websites. I've found that when I click on a website on my bookmarks bar, say `https://github.com/`, I usually have to navigate to some other page that I don't commonly go to, like `https://github.com/settings/`.

Instead of interacting with the GUI on the website to find the settings page, I can have `aka/gh` point to `https://github.com/`, and visit `aka/gh/settings`!

## Try It!

#### Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using this button:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

#### Installation
To install and set up AKA, run:
```bash
npm i -g @brandonli8/aka
```

#### Modify host file
Use your favorite editor to add 
```
127.0.0.1 aka
```
to the end of your host file, which is located in `/etc/hosts`.

#### Start the server
Start the server locally with:
```bash
aka start
```
This will run in a background process so you _don't_ have to keep the tab open. 

#### Add Your First Bookmark
Type in `aka/admin` in your browser. 

<img src='https://raw.githubusercontent.com/brandonLi8/aka/master/screenshot.png' alt='Screenshot' style='width: 400px;'/>

This will allow you to add, update, or delete routes and URLS.

## How It Works.
AKA is a simple, lightweight [express](https://expressjs.com/) application that works by keeping track of a table of routes and URLS. This table is simply stored on disk in `urls.local.json`, and cached in-memory for high lookup performance. 

AKA uses [foreverjs](https://www.npmjs.com/package/forever) to run continuously in the background. 

## Get Involved
Help improve **AKA** by creating a <a href='https://github.com/brandonLi8/aka/issues' target='_blank'>New Issue</a>.

<sub>Copyright © Brandon Li. All Rights Reserved.&nbsp;&nbsp;<b>|</b>&nbsp;&nbsp;See the <a href='https://github.com/brandonLi8/aka/blob/master/LICENSE' target='_blank'>LICENSE</a> (MIT).</sub>

<!-- Copyright © 2021-2023 Brandon Li. All rights reserved. -->

<!--
 * README.md
 *
 * @author Brandon Li <brandon.li@berkeley.edou>
!*-->

<br>
<br>
<br>
<p align="center">
    <picture>
      <source srcset="https://raw.githubusercontent.com/brandonLi8/aka/master/lib/views/admin/assets/aka-logo.svg" width="30%" media="(prefers-color-scheme: light)" />
      <source srcset="https://raw.githubusercontent.com/brandonLi8/aka/master/lib/views/admin/assets/aka-logo-dark.svg" width="30%" media="(prefers-color-scheme: dark), (prefers-color-scheme: no-preference)" />
      <img src="https://raw.githubusercontent.com/brandonLi8/aka/master/lib/views/admin/assets/aka-logo-dark.svg" width="30%"/>
    </picture>
</p>
<br>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/@brandonli8/aka" target="_blank">
    <img src="https://img.shields.io/npm/v/@brandonli8/aka?style=flat-square&logoColor=eceff4&colorA=4c566a&colorB=8FBCBB"/>
  </a>
  <a href="https://github.com/brandonLi8/aka/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/brandonli8/aka?style=flat-square&logoColor=eceff4&colorA=4c566a&colorB=8FBCBB"/>
  </a>
</p>

_________________

AKA is a simple, **private** URL shortener/bookkeeper for **personal use** that is hosted locally.

For example, the URL `https://long-domain.com/foo/`, can be shortened to `aka/foo`.

AKA also allows for sub-routes of shortened URLS. So typing in `aka/foo/bar` in your browser will redirect you to `https://long-domain.com/foo/bar`.

## Why AKA?
AKA provides the same bookmarking that, for example, your bookmarks bar on your browser already provides. However, interacting with your keyboard is **faster** than interacting with your mouse and GUI.

AKA provides short keyboard access to bookmark your most visited websites.

AKA also gives instant access to sub-routes of websites. I've found that when I click on a website on my bookmarks bar, say `https://github.com/`, I usually have to navigate to some other page that I don't commonly go to, like `https://github.com/settings/`.

Instead of interacting with the GUI on the website to find the settings page, I can have `aka/gh` point to `https://github.com/`, and visit `aka/gh/settings`!

## Try It!

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

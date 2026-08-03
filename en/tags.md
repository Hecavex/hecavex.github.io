---
layout: page
lang: en
translation_key: tags
title: Tags
description: Detailed keywords used across HECAVEX research.
permalink: /en/tags/
---
{% assign posts = site.posts | where: 'lang', 'en' %}{% assign tags = posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}<div class="post-tags hx-tag-index">{% for tag in tags %}<a class="post-tag" href="/en/tags/{{ tag | slugify: 'latin' }}/">{{ tag }}</a>{% else %}<p>No tags have been published yet.</p>{% endfor %}</div>

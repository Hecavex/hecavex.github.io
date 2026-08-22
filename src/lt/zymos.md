---
layout: page
lang: lt
translation_key: tags
title: Žymos
description: Išsamios HECAVEX tyrimų temos ir raktažodžiai.
permalink: /lt/zymos/
---
{% assign posts = site.posts | where: 'lang', 'lt' %}{% assign tags = posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}<div class="post-tags hx-tag-index">{% for tag in tags %}<a class="post-tag" href="/lt/zymos/{{ tag | slugify: 'latin' }}/">{{ tag }}</a>{% else %}<p>Žymų dar nepaskelbta.</p>{% endfor %}</div>

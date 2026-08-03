---
title: "Unleashing the Power of OSINT. Google Dorking: Unveiling Hidden Treasures of the Web."
date: 2023-10-12 14:00:00 +0300
last_modified_at: 2026-08-01 12:00:00 +0300
lang: en
translation_key: google-dorking-001
categories: [osint, tradecraft]
image:
  path: /assets/img/posts/2023-10-11-google-dorking/main/1_img.png
  alt: "Google search interface illustrating advanced OSINT queries"
description: Learn how advanced Google search operators support OSINT investigations, cybersecurity research and the discovery of hard-to-find public information.
tags: [osint]
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
featured: false
draft: false
comments: false
toc: true
---

## Intro

Have you ever heard from someone that it is hard to find information about a particular topic or person or that they were unable to find something on the World Wide Web?

Accessing information is as easy as a few clicks. As search engines like Google, Bing, Yahoo!, Yandex, and much more act as gateways to the vast expanse of the internet, it’s natural that everyone (mostly) is seeking new methods to enhance their searching capabilities. `“Google Dorking”` is one of those methods that you can use in your daily life.

## Understanding Google Dorking.

So… Google Dorking refers to using advanced operators in Google’s search engine to locate specific information that may not be easily discoverable through conventional search methods. Google searches are basically search queries that can unfold specific information.

### Main purpose of Google Dorking

Google Dorking could be used for various purposes, including penetration testing, information gathering, security research, finding information about a particular person (which could be used in social engineering attacks), and so on.

### Advantages of Google Dorking

**Information discovery.**
Google Dorking lets us discover information that is not easily accessible through regular searches.

Example: *Let’s say you work in the cybersecurity field and want to find publicly accessible documents containing information about “Hive RaaS.”* 
For this, you could use a query like:

```
“intext:Hive RaaS” — this query instructs Google to search for web pages that contain the exact phrase “Hive RaaS” in their content.
```
You can also refine your search by adding additional dorks like:
```
“filetype:pdf intext:Hive RaaS” — this query narrows down results to PDF files that mention “Hive RaaS”.
```

### Research and analysis. Competitive intelligence.

Researchers and analysts can leverage Google Dorking to discover specific data related to a particular topic of interest.

Example: *Your company is trying to conduct market research to get insights into industry trends, customer preferences, or what competitors are doing and their strategies. Using specific industry-related terms and products, you can uncover relevant articles, reviews, or social media mentions.*
For this, you could use query like:
```
site.com “industry trends” OR “customer preferences” or “product reviews” — this query instructs Google to search for web pages within.com domains that contain any of the specific phrases, such as “industry trends”, “customer preferences,” or “product reviews”.
```
You can also further customize query by adding specific industry-related terms or product names relevant to your market research.

These are only a few examples of Google Dorking and how you could use it ethical way if you respect privacy, legal boundaries.

## Real life example of Google Dorking

Soo…. I wanted to find more information about, let’s say, Rhysida RaaS. A basic Google search would look like this:

![Google results before narrowing the query](/assets/img/posts/2023-10-11-google-dorking/blog_images/2_img.png)

My search found what I wanted, but we are searching for more recent posts. Here is where Google Dorking comes in.

![Google results with advanced search operators](/assets/img/posts/2023-10-11-google-dorking/blog_images/3_img.png)

This query helps a bit, but we can add a few more things, like adding `site:webpage`, to our query.

![Google results narrowed to two matches](/assets/img/posts/2023-10-11-google-dorking/blog_images/4_img.png)

As you see, we narrowed down from 8150 results to 2 results.

## My most used Google Dorking queries

Shows only those pages that contains exact word or statement.
```
“Context”
```

Only retrieves information from website that you mentioned with exact context.
```
site:website “Context”
```

Only searches for PDF file with exact title content that you provide.
```
filetype:pdf intitle:”Context
```

Only searches for PDF, DOCX, PPT files that have exact context that you provide.
```
filetype:pdf OR filetype:docx OR filetype:ppt “Context”
```

Only searches in given Social Media platforms exact context that you provide.
```
site:SocialNetwork | site:SocialNetowrk2 | site:SocialNetwork3… “Context”
```

Only searches for given context after and before given date.
```
“Context” after:YYYY-MM-DD AND before:YYYY-MM-DD
```

Searches given websites for given context after and before given date.
```
site:Blog | site:Blog2 | site:Blog3 after:YYYY-MM-DD AND before:YYYY-MM-DD “Context”
```

Shows the website homepage even if website is down.
```
cache:website
```

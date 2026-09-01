---
title: "Information Factories on Lithuania's Border: How Russian and Belarusian Information Operations Target Lithuania, NATO, and Europe"
card_title: "Information Factories on Lithuania’s Border"
description: "How Russian and Belarusian information operations manufacture, localise, and distribute narratives targeting Lithuania, NATO, and Europe."
seo_title: "Russian Disinformation Targeting Lithuania"
seo_keywords:
  - "Russian disinformation targeting Lithuania"
  - "Belarusian information operations"
  - "foreign information manipulation and interference"
  - "NATO disinformation"
  - "pro-Kremlin propaganda"
date: 2026-06-21T14:02:43.549Z
lang: en
translation_key: substack-informacijos-gamyklos-prie-lietuvos
permalink: /en/research/information-factories-on-lithuanias-border/
author: deividas-lis
content_type: investigation
confidence: moderate
tlp: clear
categories: ["information-operations", "threat-intelligence"]
tags: ["disinformation", "Russia", "Belarus", "NATO", "OSINT"]
featured: true
scope: "Open-source analysis of information-operation infrastructure, narratives, and amplification methods."
limitations: "The assessment relies on public sources. Not every activity discussed can be attributed to a single coordinator."
key_findings:
  - "Narratives are localised to appear as if they originated within the target society."
  - "Clones, redirects, and amplification networks obscure the information's original source."
  - "Operations increasingly target search and AI information environments as well as people."
image:
  path: /assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/01.webp
  alt: "Information Factories on Lithuania's Border: How Russian and Belarusian Information Operations Target Lithuania, NATO, and Europe"
  thumbnail: /assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/informacijos-gamyklos-prie-lietuvos
---
![An analyst monitors a coordinated information network and a map of Russia.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/01.webp)

*This blog is not an attempt to prove once again that Russia and Belarus are conducting information operations against Lithuania, NATO or Europe. This has long been done by intelligence services, platform researchers, fact-checkers, academics and anyone who has ever opened a Facebook comment section under an article about NATO, Ukraine or electricity prices.*

*The purpose of this blog is slightly different.. to look at these operations as a working system.*

*Not as a single false article. Not like one Telegram channel. Not like one bot with a profile picture stolen from a 2013 dentist page. What about the content supply chain?*

*The modern information operation of Russia and Belarus usually consists of several layers:*

- *Real event selection*
- *Narrative engineering*
- *Content production*
- *Infrastructure preparation*
- *Distribution via Telegram and social networks*
- *Amplification through fake accounts or paid mechanisms*
- *..ultimately impact measurement. There is no longer nostalgia for the old days of "troll farms".*

*Here it is more like a cheap but functional content operations platform, where one operator with several AI tools can do what used to take half a newsroom and several Vasilii with Excel.*

*I review several publicly documented models on the blog:*

- *Doppelgänger*
- *Pravda / Portal Kombat*
- *Matryoshka / Operation Overload*
- *Storm-1516*
- *...as well as the ecosystem of Belarusian narratives and their significance for the Lithuanian information space.*

*Some of these operations are people-oriented. Part.. to social network algorithms. A more recent direction is moving into search engines, crawlers and LLM retrieval. In other words, not only to what a person reads today, but also to what an AI system can repeat tomorrow.*

*The main conclusion of what I would say is bad is that **the narrative is not the final product. The narrative is the payload. Its purpose is not to be beautiful, intelligent, or even logical. Its purpose is to provoke a reaction, provoke doubt, create controversy, reduce trust in institutions, NATO, Ukraine, the EU or the very idea of ​​a reality check.***

*In phishing, a person clicks on a link because they receive an "invoice". In an information operation, a person presses share because he receives "the government hides the truth". The only difference is that the password is leaked in the first case, and common sense in the second.*

The [Facebook cloaking investigation](/en/research/when-fake-news-scams-and-cloaking-meet/) follows the financial-fraud side of cloned media, targeted distribution and different content for different visitors. It is useful comparative context, not evidence that the influence operations described here share the same operators.

---

## Why Lithuania is a convenient target

Lithuania is convenient for the information operations of Russia and Belarus not because we are some kind of unique umbilical cord of the world. Convenience is due to geography, political context and the size of the information market.

Lithuania is a NATO country, a member of the EU, an active supporter of Ukraine, borders Belarus and is near Kaliningrad. This means that almost any narrative can be tied to one of several sensitive topics: NATO, Ukraine, migration, energy, Russian speakers, Kaliningrad, Belarus or "the government is hiding something".

VSD notes in its threat assessment that Russia uses social networks as one of the main channels for spreading propaganda in Lithuania. The aim is to circumvent the restrictions placed on traditional propaganda channels.. to incite distrust of institutions *(classic here)*, reduce confidence in NATO and discredit support for Ukraine. VSD also emphasizes that pro-Russian messages are increasingly disguised so that they appear to originate from Lithuanian society itself *(bot farms, AI generated comments.. let's not forget Remyga with bot farms)*. *([Source 1](#source-1))*

If a message comes from RT or Sputnik, most people understand—at least in theory—that scepticism should switch on. *(I am being generous with "most people", but let me have some hope.)* If the same message comes from an "ordinary person" in Facebook comments, a regional group or a newly appeared "independent" page, it feels more natural. That is where today's dirty, cheap and efficient beauty begins.

![A map shows information links spreading from Russia and Belarus into Europe.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/02.webp)

---

## Narrative as payload

A lot of texts on disinformation make one mistake…they analyze narrative as content, and I'm going to step in and say that's too narrow.

Narrative in these operations is a function that has to do some work.

If in a malware campaign the payload must steal a password, encrypt files or open a backdoor, in an information operation the narrative must cause a certain change in behavior or attitude.

**Examples:**

| Narrative | Operating value |
| --- | --- |
| NATO will not defend Lithuania | Reduces reliance on collective defense and deterrence. |
| Ukraine has money, Lithuanians don't | Creates fatigue and social envy of support for Ukraine. |
| The Baltic countries are economically failing | Discredits the EU, sanctions and the political direction of the region. |
| Lithuania persecutes Russian speakers | Creates a pretext for "defense" rhetoric and pressure in international formats. |
| Migration is a government-induced crisis | It activates fear, ethnic tension and mistrust of state control. |
| Energy independence has created a crisis | Attacks the legitimacy of energy reforms and promotes nostalgia for old dependence. |

It is important to understand here that the narrative does not have to be new. Often the best narratives are old.

**A real event:** *NATO exercises in Lithuania.*

**Possible options for the narrative:**

| Interpretation | Audience |
| --- | --- |
| It's a deterrent | State and NATO communication |
| This is preparation for war with Russia | Audience of fear |
| Lithuania will be turned into a war zone | Anti-NATO audience |
| The authorities are hiding the true scale of the exercise | Anti-establishment audience |
| Ordinary people will pay for everything | An audience of economic discontent |

Same fact only.. Five different products.  
One event… only five payloads.  
Like a McDonald's menu *(although I actually prefer 5Guys)*, only geopolitical narrative instead of fries.

**The narrative engineering process can be described as follows:**

```
A real event
  ↓
Choosing an emotional angle
  ↓
Attribution of the culprit
  ↓
Lokalizacija
  ↓
Formatting by platform
  ↓
Distribucija
  ↓
Amplifikacija
  ↓
Impact measurement
```

**For example, the topic of energy in Lithuania can be transformed into several different operational messages:**

- "Brussels destroyed the electricity market"
- "disconnecting from BRELL was a mistake"
- "the government sacrificed people for NATO"
- "it used to be cheaper near Russia".

The purpose of these messages is not necessarily to force a person to become pro-Russian. And... you've probably seen a lot of ink on social networks.

![Information-operation chain from narrative creation to distribution and impact measurement.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/03.webp)

---

## From troll farms to the content supply chain

The classic "troll farm" model still seems to many to be the main image of Russian information operations. Operators sit, have dozens of accounts, write comments, share links, argue with real people and occasionally with other bots *(because even in the world of bots, apparently, socialization is needed.. here, as I recently saw, a person created a WoW server with AI bots and chatbots to show the "Dead Internet" phenomenon..).*

This model still exists. But it is no longer sufficient to describe what we see now.

**After 2022 the more industrialized in particular emerged** ***(probably a suitable title)*** **model:**

- Media clones
- Proxy pages
- Telegram seed channels
- Automated amplification
- AI generated content
- Promotional accounts
- Redirect layers
- Bot comments and pseudo-journalistic videos.

**A modern operation is more like a supply chain:**

| Stage | Function |
| --- | --- |
| Collection | Real events are monitored: NATO, Ukraine, migration, elections, economy, energy. |
| Narrative Engineering | A real event is made into a manipulative product. |
| Content Production | An article, a video, a fake report, a package of comments, a collection of pseudo-facts are created. |
| Infrastructure | Domains, fake media pages, redirects, social accounts are being prepared. |
| Distribution | Content is launched via Telegram, X, Facebook, Reddit, fake media and other channels. |
| Amplification | Fake accounts, comments, paid ads, repost networks, influencers or fringe media. |
| Measurement | What sticks is evaluated: reach, engagement, reposts, media pickup, political reaction. |

This means that the narrative is not just a text, here it already becomes a supply-chain output.  
As a ransomware affiliate receives a build, so an information operator receives a narrative package: *text, visual, direction of comments, audience and platform.*

This is where AI has changed the economics. *(Say what you want: I hate AI. It is useful in some places, but from a cybersecurity perspective... well, you know.)*

OpenAI 2024 described several covert influence operations in which AI was used to generate comments, articles, social account bios and other content. OpenAI also noted that these operations have not necessarily achieved high real-world engagement, but the AI ​​deployment model itself is important: it lowers production costs, accelerates localization, and allows operators to test different versions of the narrative more quickly. *([Source 2](#source-2))*

In other words, AI has not made propaganda magically successful *(thank god)*, and made it significantly cheaper….And when something becomes cheaper, more of it appears online. This is how everything works in real life…from phishing emails to bad LinkedIn tips *(or how an ethnic hacker answers questions or writes LinkedIn posts from ChatGPT without understanding what he is even saying there...)*.

![A content factory where people and automated systems operate many accounts.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/04.webp)

---

## Doppelgänger. When media impersonation becomes an influence infrastructure

Doppelganger is one of the best-documented post-2022 Russian intelligence operations. It has been publicly identified by EU DisinfoLab, VIGINUM, Meta, Graphika and other researchers. EU DisinfoLab describes it as one of the most prominent Russian information operations since the Cold War, mainly targeting Western countries and their information ecosystem. *([Source 3](#source-3))*

**The basic logic of Doppelganger is quite simple:** create websites that imitate well-known media or institutional pages and spread pro-Russian or anti-Ukrainian narratives through them.

From a technical point of view, Doppelganger is worth analyzing not only as disinformation, but *(here personally to me, and the researchers agree)* very similar to phishing infrastructure.

In phishing, the operator clones the bank's page because the person trusts the visual authority.  
Doppelganger clones a media page because one trusts the media brand. The difference is only in the payload. Once the password is stolen. Elsewhere, trust is stolen.

EU DisinfoLab states that Doppelganger used media clones, government clones, typosquatting, alternate domains, fake video, redirect infrastructure, geofencing and bypassing platform moderation. The targets of the operation were brands such as Le Monde, The Guardian, ANSA, Der Spiegel, Fox News, as well as institutions including imitations of NATO or the French Ministry of Foreign Affairs. *([Source 3](#source-3))*

**A typical scheme looks like this:**

```
Naratyvas
  ↓
Fake article
  ↓
A media or institution clone
  ↓
Redirect / tracking infrastructure
  ↓
Telegram / X / Facebook amplifikacija
  ↓
Comments and organic sharing
  ↓
Entering the narrative into a larger discussion
```

Doppelganger is not a strong company because of the quality of the content. Often the texts are mediocre, the language is poor *(aka google translate)*, the logic is poor *(worse than my blogs.. you understand)*. But there is one but..for a company to look good enough on the phone, quickly evoke an emotion and make a person share.

"Good enough" propaganda is already appearing here.

In the cyber world, we have "good enough phishing". Here is already the same principle aka.. you don't need to deceive everyone. It's enough to trick the percentage of the audience that will share, comment or start arguing with someone, and then the algorithm will do its job.

### Doppelganger attribution

EU DisinfoLab indicates that the operation was linked to the Russian companies Struktura and Social Design Agency, also known as SDA/ASP. It also mentions that ISD has identified Argon Labs as a possible related entity. *([Source 3](#source-3))*

It is important here that not every media clone in Lithuania is automatically a Doppelganger. In Lithuania, we definitely see media impersonation and brand impersonation methods both in the context of scams, political narratives, and influence operations, but without domains, servers, social accounts, advertising libraries, redirect chains or other technical coincidences, it is not possible to directly stick every "fake Delfi" or "fake LRT" to a Doppelganger.

**The correct wording would be:**

*The publicly documented Doppelganger pattern shows that Russian information operations systematically used clones of prominent media and institutions. Similar media impersonation methods are also found in the Lithuanian information space, but specific attribution requires technical artifacts: domain history, DNS, SSL certificates, redirect chains, social amplification and analysis of account networks.*

There is nothing sexy like "Doppelganger did everything" here. But it already becomes correct in the correct formulation.

**And from the point of view of the supply chain itself, something like this:**

| Layer | Function |
| --- | --- |
| Narrative | A topic that supports the pro-Russian or anti-Ukrainian line is chosen. |
| Fake article | Manipulative text is created, often stylized as regular news content. |
| A media or institution clone | A website is created that visually resembles a trusted media or institution page. |
| Redirect or tracking infrastructure | Redirects, tracking parameters, geofencing or bypassing platform moderation are used. |
| Telegram, X or Facebook amplification | Content is distributed through social channels and coordinated accounts. |
| Comments and organic sharing | It creates the impression of social proof that the narrative originates from a real audience. |
| Entering the narrative into a larger discussion | The content can be taken over by fringe media, an influencer, a political figure or a mainstream debate. |

![Network-analysis dashboard showing interconnected account clusters.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/05.webp)

---

## Matryoshka / Operation Overload. Informational DDoS against fact checkers

The Matryoshka / Operation Overload model is different from the Doppelganger.

The most important element here is not just the media clone. The most important element is volume and load.

Wired, citing researchers at Reset Tech and Check First, wrote that Operation Overload/Matryoshka grew from a previous period of 230 unique pieces of content to 587 pieces of content in eight months, most of which were created using AI tools. The content included images, videos, QR codes, fake websites and other formats. *([Source 4](#source-4))*

Operation Overload tactics often target journalists, fact-checkers, and organizations that verify information. Operators send them fake stories, tag them on social networks, try to force them to react, check, explain, deny. This is where informational DDoS comes into play *(I would rather say cerebral DDoS)*.

In the cyber world, the goal of DDoS is not to "hack" a server, the goal is to overload it.  
The purpose of Operation Overload is not to convince every journalist, but to clog the information verification chain.

**The tactical value here is:**

| Action | Operating value |
| --- | --- |
| Lots of fake stories | Fact checkers have to spend time and resources. |
| AI generated content | Lower costs and faster production. |
| Tagging or sending to reporters | Pressure is created to respond. |
| Multi-platform distribution | It gives the impression that the story "lives" in several places. |
| Even a denial | Sometimes gives additional visibility to the fake story itself. |

Here, one unpleasant reality is especially beautifully revealed, that not every debunk is a pure victory.. here already the denial helps the operation to reach more people *(even if you deny it, people don't always believe debunk, because everyone is bought, right?)*.

![An operator faces a wall of news items and social-media posts.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/06.webp)

---

## Storm-1516. Story factory with fake witnesses

Storm-1516 is another model. The most important thing here is not the UI of the media clone and not just the volume of the text itself, but the production of a complete fake incident.

Reuters 2024 described a Microsoft investigation that linked Storm-1516 to a false story about Kamala Harris' alleged 2011 hit-and-run incident. The operation used an actor posing as the alleged victim and a fake KBSF-TV-like website to give the story media legitimacy. *([Source 5](#source-5))*

**This pattern becomes important because it represents the next stage of evolution:** it is no longer just to distort the fact, but the entire ecosystem of the event is being produced.

**Storm-1516-type operations may have the following components:**

| Component | Function |
| --- | --- |
| Fake incident | A core story that is meant to evoke an emotional response. |
| Fake witness | A human face that gives the impression of "authenticity". |
| Fake media outlet | Infrastructural layer of legitimacy. |
| Video or audio | "Proof" that is easier to share on social networks. |
| Social amplification | X, Telegram, TikTok, Facebook or other channels. |
| Secondary emitters | Influencers, fringe media, political figures or bot networks. |

This is no longer a falsification of an article, but of an event *(which doesn't really exist)* creation from nothing.

If Doppelganger is a phishing page, Storm-1516 is already a social engineering campaign with actors, fake documents and the whole environment.

Here it is also important not to overestimate the success of the operation. Some of these stories die quickly. Some reach a niche audience. But some… if they are taken by big accounts, influencers or political figures *(here Remyga with the bot farm is worth mentioning)* shoots out

![Information-operation control room mapping accounts, content, and distribution links.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/07.webp)

---

## Pravda / Portal Kombat. When the target audience is not a person, but a crawler

Pravda / Portal Kombat is one of the most interesting branches of this blog *(well, the most interesting for me)*, because there is a question "what is the content for?"

Classic propaganda targets a person. The Pravda-type network partially targets the information infrastructure, i.e. search engines, crawlers, LLM retrieval layer and automatically collected content.

VIGINUM identified the Portal Kombat/Pravda ecosystem as a network of pro-Russian sites in different languages. It is publicly indicated that in 2024 the network included at least several hundred sites, and later research linked this trend to so-called LLM grooming *(the grooming sounds interesting here..)* i.e. i.e. an attempt to contaminate the information layer on which AI systems can rely. *([Source 6](#source-6))*

The Washington Post described that such networks produce large volumes of misleading articles that look more like content to crawlers than to actual readers. The American Sunlight Project calls this process LLM grooming, the goal of which is that pro-Russian narratives enter the information environment of AI systems and can later be repeated in chatbot responses. *([Source 7](#source-7))*

**Old model:**

```
Fake article
  ↓
A person reads
  ↓
A person shares
```

**Pravda / LLM grooming model:**

```
Low-quality article
  ↓
Many localized portals
  ↓
Search engines / crawlers
  ↓
AI retrieval or training environment
  ↓
Chatbot/AI response
  ↓
The person receives a "neutral" sounding answer
```

It's not just Facebook aunts from Pakruoj anymore *(I don't know why I chose Pakruoi)* problem. This is a problem for the system, which later responds to Facebook's aunt, who has learned to ask Chat bots whether it is true or false.

Pravda-type content does not need to have a large real traffic of readers. If the content is indexed, republished, localized and looks "newsy" enough, it becomes... Here's SEO's cousin who discovered geopolitics and is now trying to explain to chatbots that everything is NATO's fault.

**From a technical point of view, this model has several characteristics:**

| Sign | Meaning |
| --- | --- |
| Many localized domains | Allows you to apply to different languages ​​and regions. |
| Low content quality | Content is often about quantity, not human reading experience. |
| Republishing pro-Russian sources | Allows to "wash" the original resource through other domains. |
| SEO and indexing orientation | It is not the comments that matter, but the visibility in the search and crawler environment. |
| LLM grooming risk | AI systems can replicate a contaminated information layer. |

This topic should be of particular interest to cyber security specialists, as this is where information operations begin to resemble supply-chain poisoning. Only the local dependency package pollutes the information environment.

And yes, it is as absurd as it sounds: *we live in a time where someone can print thousands of pieces of crap not for people to read, but for robots to eat and then politely send back to a human.*

![Human and artificial-intelligence profiles connected on an information-flow analysis display.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/08.webp)

---

## The role of Belarus. Not only "smaller Russia"

It is wrong to see Belarusian information activities only as a cheaper version of Russia. Belarus has its own regional function, i.e. it is well suited to the themes of Lithuania, Poland and the Baltic States, especially the narratives of migration, borders, energy and the collapse of the Baltic States.

**Belarusian information operations often rely on several overlapping directions:**

| Theme | Purpose |
| --- | --- |
| The Baltic countries are economically failing | To discredit the direction of the EU and the policy of sanctions. |
| Lithuania provokes Belarus | To create a victim position for the Minsk regime. |
| Migration as Lithuania's fault | Shift responsibility from the regime's organized means of pressure. |
| Energy or BRELL | Raise fears of disconnection from Russia's energy influence. |
| Polish or Russian-speaking topics | Divide regional and ethnic audiences. |

Belarus often acts as a regional amplifier. If the Russian narrative is strategic, the Belarusian media can localize it as.. "here specifically Lithuania", "here specifically the border", "here specifically Vilnius", "here specifically electricity prices" *(well, these are really often heard in the media, aren't they?)*.

The abstract statement "Europe is collapsing" is too broad, but saying "electricity will be more expensive in Lithuania after disconnection from BRELL, the government lied" is much more convenient for social anger and inciting anger *(well, I think this one has been seen a lot on social networks.. especially what you like to read under the articles.. it's just harder to choose which is a bot farm and which is a real person).*

![Coordinated information links approach a map of Lithuania from the east.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/09.webp)

---

## Lithuanian information space. Comment sections are like a cheap lab

The Lithuanian information market is small, but active.. which is both good and bad on the one hand..

**An advantage.** In a small market, it's easier to spot recurring narratives, language patterns, account behaviors, and coordination.

**Disadvantage.** In a small market, a small amount of amplification can appear larger than it is. If 40 similar comments appear under one article, the average reader may get the impression that "everyone thinks this way". In reality, sometimes "everyone" is three people, five bots, and one account that clearly likes the word "junta" too much.

**In the context of Lithuania, I usually see several recurring clusters of narratives** ***(at least what I scratched with my dummy accounts)*****:**

| Cluster | Sample message | Operating value |
| --- | --- | --- |
| NATO / War | Lithuania will be included in the war. NATO is only provoking here | Fear and discrediting deterrence |
| Ukraine / support | Everything for Ukraine, nothing for Lithuanians | Support fatigue for Ukraine |
| Migration | The authorities are deliberately creating chaos at the border | Mistrust of the state and ethnic tension |
| Energetics | BRELL, the EU or Brussels caused the price crisis | Discrediting energy independence |
| Russian speakers | Lithuania persecutes Russian speakers | The basis of international pressure and "defense" rhetoric |
| Corruption / Government | Everyone steals, everything is sold | General institutional cynicism |

These narratives often do not operate in isolation and are interconnected.

**For example:** "The government steals, that's why it supports Ukraine, that's why people are poor, that's why NATO provokes war, that's why Belarus only defends itself." *(here is this classic from the Mantas Mantas Facebook account, where the account is connected to 5-10 different groups on Facebook and comments the same under Delfi/LRT articles).*

There is no logic, but logic is not necessary for informational operations. They need an emotional sequence. If a person is already angry about the prices, it is easier for him to sell "we give too much to Ukraine", if he no longer trusts the government, it is easier for him to sell "NATO is hiding a real plan", if he is already afraid of war, it is easier for him to sell "it is better not to interfere".. and Janina from Pabradė will like and comment the same thing after reading, even though she does not know that she is talking to a bot.. she will go and tell her neighbor Maryte "Look how Mantas Mantas said it right".

![Several near-identical social posts illustrate coordinated content distribution.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/10.webp)

---

## Features of the platforms. Telegram is not Facebook, Facebook is not X

One common flaw in the analysis is that all platforms are lumped into one. But they perform different functions in the information operation.

| Platform | Function in operation |
| --- | --- |
| Telegram | Seed, coordination, narrative testing, initial distribution. |
| Facebook | Localized mass audience, especially through groups and comment sections. |
| X | Rapid amplification, reaching journalists, politicians and international audiences. |
| Reddit | Discussion infiltration, especially in English-language and niche communities. |
| Fake media sites | "Evidence object" is a link to which you can point. |
| TikTok | Short emotional format, memes, audio, reaching a young audience. |
| LLM / search | A new layer: getting narratives into response and retrieval systems. |

Telegram often acts as a dispatcher:

- The narrative emerges early
- The narrative is being tested
- The narrative is dissected
- The narrative is being rewritten
- …and then moves to other platforms.

Academic research on Telegram propaganda networks shows that coordinated networks and repetitive patterns of amplification can be detected on such platforms, including the interaction of pro-Russian and pro-Ukrainian networks. *([Source 8](#source-8))*

Facebook performs another function in Lithuania. Here, not only the pages are important, but also the comment sections. Comments become a cheap social proof mechanism. If you see 30 comments under the article, all repeating the same idea in different words, some readers are no longer reading the article. They read "public reaction", even though that public reaction is one Igor from Moscow *(or in other words, five sockpuppets with different last names, but one Igor behind them).*

![Different platforms and accounts connect into one amplification infrastructure.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/11.webp)

---

## Information laundering. How the Russian narrative becomes "local opinion"

The main magic of these operations is not the lie itself, but the path it takes from an apparently pro-Russian source to a supposedly local context.

**Model:**

```
Russian/Belarusian state or proxy source
  ↓
Telegram kanalas
  ↓
Proxy media or fake local site
  ↓
Social network accounts
  ↓
Amplification of comments/groups
  ↓
Fringe influencer or pseudo-expert
  ↓
Mainstream diskusija
```

There is already information laundering here. The idea is the same as in money laundering *(my friend MLRO told me so..)*: The original looks bad, so you need to go through multiple layers to make the final product look cleaner.

In the Lithuanian context, VSD refers to this very aspect that pro-Russian messages are increasingly distributed in a disguised way, so that they appear to originate from Lithuanian society. *([Source 1](#source-1))*

This is where pseudo-experts, regional pages, and "alternative media" appear. *(here's the one with J.'s last name, where I see my father liked it, but thank God I've already washed my brain)* projects, and comment farms. The more layers there are, the harder it is for the average person to understand where the narrative came from.

When a person sees an RT, they can dismiss it, but when a person sees a local Facebook profile with a tricolor cover photo and a comment "I'm just asking".. it seems more convincing.

![Narrative path from its source and fake profiles to groups, comments, and an audience.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/12.webp)

---

## Cyber ​​and physical layer. Why information operations often travel next to other operations

Information operations often do not take place in a vacuum. They can accompany cyber attacks, data leaks *(here I smell RC and other recent leaks)*, sabotage incidents *(fires??)*, GPS spoofing *(I'm telling you why the GPS makes a fool of me when I'm driving outside of Vilnius... I live in a village)* or other hybrid actions.

This does not mean that every fake post is coordinated with the GRU operation. Such a conclusion would be too broad. But public sources show that Russia's pressure in Europe extends beyond the information space. NATO 2024 has publicly expressed concern about activities attributed to Russia, including disinformation, sabotage, violence and cyber interference in Alliance territory. *([Source 9](#source-9))*

In the context of Lithuania, the layer of electronic warfare and GPS spoofing is also important. Reuters 2026 wrote that Lithuania reported the development of Russian GPS spoofing capabilities in Kaliningrad, capable of falsifying signals up to a radius of approximately 450 km. Lithuanian officials said that the number of spoofing antennas in Kaliningrad increased from three in 2025. at the beginning to 36. *([Source 10](#source-10))*

Why is this important for information operations? Elementary.. Because technical trouble often becomes the raw material of the narrative.

**For example:**

| A technical or physical event | A possible narrative |
| --- | --- |
| GPS disturbances | NATO fails to protect airspace. The West is provoking Russia |
| DDoS against institutions | The state is weak. Everything is not safe. The government hides the true extent |
| Data leakage | Institutions are incompetent. NATO documents are not secure |
| Power failure | Disconnecting from Russia was a mistake |
| Sabotage incident | Europe is destroying itself because of Ukraine |

![Information-operation infrastructure graph linking domains, accounts, and campaigns.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/13.webp)

---

## What is done in Europe without disinformation

As for the activities of Russia and Belarus in Europe, it is dangerous to limit yourself to fake news.

**Actions publicly documented or mentioned by institutions cover a wider spectrum:**

| Type of activity | Meaning |
| --- | --- |
| Cyber ​​operations | Government, defense, energy, media and civil society targets. |
| Leak-and-amplify | Stolen or leaked data is used for informational purposes. |
| Sabotage/Intelligence | NATO countries have publicly expressed concern about such activities in Europe. |
| GPS jamming / spoofing | Disrupts navigation, aviation, transportation, and creates narrative raw material. |
| Proxy media | Local or international channels that appear to be independent but spread a pro-Russian line. |
| Exploitation of influencers/fringe media | The message is transferred to an "independent" voice. |
| LLM grooming | Attempting to pollute the AI ​​answer and search layers. |

The important thing here is not to say that everything is one central plan. Often such ecosystems act as a semi-centralized network:

- part of the actors to coordinate
- part opportunistic
- some simply copy pro-Russian narratives because it gives them an audience, money or political advantage *(doesn't that sound like our one favorite batch of sausage? doesn't it?)*

In other words, sometimes a direct order from Moscow is not needed. It's enough for many people to understand which way the money, attention and ideological comfort is blowing.

![Blue and red information networks compete for audience attention.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/14.webp)

---

## And finally

**First.** Russian and Belarusian information operations against Lithuania and NATO have much more structure than it seems at first glance. These are not just individual fake posts. It is a combination of narratives, infrastructure, platforms and audiences.

**Second.** Narrative engineering is central to these operations. Operators usually do not create emotions out of nothing. They take real tensions like prices, migration, fear of war, distrust of institutions and tie them to a geopolitical explanation.

**Third.** Doppelganger showed the value of media impersonation: if a person trusts a media brand, one can try to steal that trust through visual copy and domain manipulation.

**Fourth.** Matryoshka/Operation Overload showed that information operations can act as a DDoS against fact-checkers and journalists. Even if most of the content is of poor quality, its volume becomes a tactic in itself.

**Fifth.** Storm-1516 shows the industrialization of fake incidents.. actors, fake witnesses, fake media, video and social amplification.

**Sixth.** Pravda / Portal Kombat shows a new risk.. information operations can apply not only to people, but also to the information infrastructure from which AI systems respond.

Well.. and ..

**The seventh.** In the Lithuanian information space, the most sensitive topics remain NATO, Ukraine, migration, energy, Russian speakers and trust in the government. These themes will continue to be used because they work. Originality is not needed here. If the old narrative still causes anger, no one throws it away. Russia's information war.. very fun and good at subverting and recycling narratives to make them go further.

![A researcher illuminates a complex wall of digital traces and information links.](/assets/img/posts/substack/informacijos-gamyklos-prie-lietuvos/15.webp)

---

## **Sources**

1. <span id="source-1"></span><span class="hx-source-entry"><a href="https://www.vsd.lt/en/reports/influence-activities-against-lithuania/russia-is-stepping-up-its-information-campaigns-on-social-networks-using-constant-propaganda-narratives-to-support-them">VSD — Russia Is Stepping Up Its Information Campaigns On Social Networks Using Constant Propaganda Narratives To Support Them</a> <span class="hx-source-type">Primary source</span></span>
2. <span id="source-2"></span><span class="hx-source-entry"><a href="https://www.reuters.com/technology/cybersecurity/openai-has-stopped-five-attempts-misuse-its-ai-deceptive-activity-2024-05-30">Reuters — Openai Has Stopped Five Attempts Misuse Its Ai Deceptive Activity</a> <span class="hx-source-type">Reporting</span></span>
3. <span id="source-3"></span><span class="hx-source-entry"><a href="https://www.disinfo.eu/doppelganger-hub">EU DisinfoLab — Doppelganger Hub</a> <span class="hx-source-type">External source</span></span>
4. <span id="source-4"></span><span class="hx-source-entry"><a href="https://www.wired.com/story/pro-russia-disinformation-campaign-free-ai-tools">WIRED — Pro Russia Disinformation Campaign Free Ai Tools</a> <span class="hx-source-type">Reporting</span></span>
5. <span id="source-5"></span><span class="hx-source-entry"><a href="https://www.reuters.com/world/us/fake-kamala-hit-and-run-story-is-work-russian-propaganda-group-microsoft-says-2024-09-17">Reuters — Fake Kamala Hit And Run Story Is Work Russian Propaganda Group Microsoft Says</a> <span class="hx-source-type">Reporting</span></span>
6. <span id="source-6"></span><span class="hx-source-entry"><a href="https://en.wikipedia.org/wiki/Pravda_network">Wikipedia — Pravda Network</a> <span class="hx-source-type">Context</span></span>
7. <span id="source-7"></span><span class="hx-source-entry"><a href="https://www.washingtonpost.com/technology/2025/04/17/llm-poisoning-grooming-chatbots-russia">The Washington Post — Llm Poisoning Grooming Chatbots Russia</a> <span class="hx-source-type">Reporting</span></span>
8. <span id="source-8"></span><span class="hx-source-entry"><a href="https://arxiv.org/abs/2406.08084">arXiv — 2406.08084</a> <span class="hx-source-type">Academic research</span></span>
9. <span id="source-9"></span><span class="hx-source-entry"><a href="https://apnews.com/article/nato-russia-ukraine-war-73a3a226a6d036f8eafade7afca0ca5c">AP News — Nato Russia Ukraine War 73A3A226A6D036F8Eafade7Afca0Ca5C</a> <span class="hx-source-type">Reporting</span></span>
10. <span id="source-10"></span><span class="hx-source-entry"><a href="https://www.reuters.com/business/aerospace-defense/russia-can-falsify-gps-signals-deep-into-europe-lithuania-says-2026-05-26">Reuters — Russia Can Falsify Gps Signals Deep Into Europe Lithuania Says</a> <span class="hx-source-type">Reporting</span></span>

**Additional worth reading:**

1. <span class="hx-source-entry"><a href="https://www.reuters.com/world/europe/european-election-how-eu-says-russia-is-spreading-disinformation-2024-06-03">Reuters — European Election How Eu Says Russia Is Spreading Disinformation</a> <span class="hx-source-type">Reporting</span></span>
2. <span class="hx-source-entry"><a href="https://arxiv.org/abs/2410.22716">arXiv — 2410.22716</a> <span class="hx-source-type">Academic research</span></span>

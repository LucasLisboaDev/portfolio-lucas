# Phase 5 Debrief: About, Kind Words, Credentials, Contact and Footer

**Branch:** `redesign/animated-portfolio`
**Commit:** `43f5527`
**Date:** October 12, 2026

## What shipped

With this phase every section of the homepage is in the new design, and none of the old components remain.

**About** pairs your armchair photo (grayscale, color on hover) with the headline "Engineer by trade. Black belt by discipline.", two short paragraphs of your story, a three-stat strip (Black Belt, 3.9 GPA, 3 Languages), your Brazilian Jiu-Jitsu achievements as divider rows, and education rows for the B.S. (2027) and the A.S. (2026), with the years taken from the resume. On a computer the photo stays in place while the text scrolls past it.

**Kind Words** shows one testimonial at a time in large editorial type, on the warm surface background, with the author's initial, name and title, and previous and next buttons. The quotes are word for word from `data/testimonials.ts`.

**Credentials** lists your four certificates as rows: issuer in the accent color, certificate name, and a check mark.

**Contact** opens with "Have a project in mind?" (the second line outlined), followed by a minimal form with underline fields for first name, last name, email and message, a send button, and pills for LinkedIn, GitHub and your email.

**Footer** sets "Lucas Lisboa" as a huge outlined wordmark across the full width, with copyright, links and back to top underneath.

## Changes to the form worth knowing about

The old form had a **phone number** field and an **"I accept the terms"** checkbox. The approved canvas had dropped the phone field, so it is gone here too (the API still accepts it if you ever bring it back). The checkbox asked people to accept terms that the site never shows, which adds friction and promises something that does not exist. It is replaced by a plain line: "Your details are only used to reply to your message." If you prefer the checkbox, it is easy to restore.

## Engineering decisions

**Form validation that helps instead of blocking.** The form validates in the browser before sending. Each problem appears directly under its field, linked to the input with `aria-describedby` so screen readers read the error with the field, the field is marked `aria-invalid`, and focus jumps to the first one. Errors clear as soon as you start typing in that field. The outcome (sent, or failed with the reason) is announced through a status or alert region.

**A honeypot for spam.** The form includes a hidden "website" field that people never see and screen readers skip. Simple bots fill in every field; when that one has a value, the API replies with a normal success and sends nothing, so the bot learns nothing.

> **Beginner flag:** a honeypot is a trap field invisible to real visitors. Since only automated scripts fill it in, it filters a lot of spam without making people solve a CAPTCHA.

**One testimonial at a time, with no autoplay.** Rotating carousels move content while people are reading it and are hard to use with a keyboard or screen reader. Here nothing changes unless the visitor presses a button, and the quote area is a polite live region, so screen readers read the new quote after the press without interrupting.

**A wordmark that always fits exactly.** The footer name is measured in the headline font at 8.4 em wide, so its font size is the available width divided by 8.5, capped at 141px. The tests confirm it fills the content width exactly at 1440, 1024, 768 and 390 pixels with no sideways scroll.

**Keeping About mostly on the server.** About and Credentials are server components; only the small reveal wrappers run in the browser.

## Security fix in the contact API

While wiring the new form to the existing `/api/contact` route, I found that it built the email's HTML by inserting whatever the visitor typed directly into the markup. Anyone could have put links, images or fake formatting into the emails you receive, a common way to make a phishing message look like it came from your own site. The route now escapes every field before it goes into the HTML, limits field lengths, checks the email format, strips line breaks from the subject, and handles the honeypot. The response format is unchanged, so nothing else needed to change.

> **Beginner flag:** escaping turns characters like `<` and `>` into harmless text (`&lt;`, `&gt;`), so a message containing `<a href=...>` shows up as literal text instead of becoming a real link in your inbox.

## Accessibility: what Lighthouse missed

Lighthouse reported one contrast failure on the homepage. A deeper check found more. Lighthouse only tests what is visible when the page loads, and every section below the fold starts at opacity 0 until you scroll to it, so most of the page was never checked. I added a full scan with axe-core (the engine behind Lighthouse's accessibility audit) that scrolls the entire page, opens every accordion, and then tests everything, on the homepage and three case studies, at desktop and phone widths.

It found eight elements below the 4.5:1 contrast minimum, all variations of one issue: the muted gray (#707070) and the accent brown (#9C6455) pass on the off white canvas but fall to about 4.3:1 on the warmer surface color, and the counters inside the filter chips and Capabilities rows used 55% opacity, which washed them out. Muted text on the surface now uses the darker "ink soft", the Talk to Maya label uses the deep accent, and the counters use 70% opacity. The rule is recorded in `design-tokens.md`. After the fixes, the full scan reports zero violations on every page at both sizes.

## Testing

| Check | Result |
|---|---|
| Contact API: missing field / bad email / honeypot | 400 / 400 / silent 200 |
| Empty form | four inline errors, focus on first name, `aria-invalid` set |
| Invalid email | "That email doesn't look quite right." |
| Successful send (API mocked) | correct fields sent, success message, form cleared |
| Failed send (API mocked) | error announced as an alert |
| Testimonials | next and previous cycle correctly with mouse and Enter key; counter updates |
| Footer wordmark | exactly fills the content width at four sizes |
| Nav and Let's Talk | About and Contact land 80px from the top |
| Every revealed element | visible after scrolling (none left at opacity 0) |
| Phones | no sideways scroll anywhere |
| axe-core full scan | 0 violations, homepage and 3 case studies, desktop and phone |
| Phase 1 to 4 suites | all rerun and passing |

## Metrics

Lighthouse 12, mobile profile, Phase 4 rebuilt and measured side by side with Phase 5, alternating, six runs each.

| Metric (median) | Phase 4 | Phase 5 |
|---|---|---|
| Performance | 87 | 89 |
| Accessibility | 100 | 100 (after the contrast fixes) |
| Best practices | 96 | 96 |
| SEO | 100 | 100 |
| Largest Contentful Paint | 3.54 s | 3.30 s |
| Total Blocking Time | 84 ms | 117 ms |
| Cumulative Layout Shift | 0 | 0 |
| JavaScript transferred | 180 KB | 182 KB |
| Total page weight | 420 KB | 417 KB |

The new sections replaced older, heavier ones, so the page got slightly lighter overall while gaining the form validation and testimonial controls. The favicon is still the only best practices deduction.

## Lessons

An automated score is only as good as what it can see. A perfect Lighthouse accessibility score sat on top of eight real contrast failures, because scroll reveals hid them from the audit. Any site that animates content in needs its accessibility checks run after everything has been revealed.

Reading the code you are wiring into pays off. The form redesign was meant to be purely visual, but connecting it to the existing API exposed an injection problem that had been there all along.

A design token is not a guarantee. Muted gray passed on one background and failed on another a few shades darker. Contrast belongs to a pair of colors, not to a single one, and the token document now says which pairs are allowed.

## Next: Phase 6

Phase 6 is polish and launch: a favicon and social preview image, real device testing on iOS Safari and Android Chrome, performance tuning toward the 2.5 second LCP budget, a last full accessibility pass, final screenshots, and then the pull request into `main`.

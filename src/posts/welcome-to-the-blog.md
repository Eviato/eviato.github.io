---
title: Welcome to the blog
date: 2026-09-11
excerpt: What this space is for, and what's coming next.
tags: [Meta]
---

I've kept notes on this kind of work for years, mostly for myself — the convention I settled on for a Terraform module, why a given tool made sense over the alternative, what actually broke the first time I wired two systems together. This is those notes, cleaned up enough to be useful to someone other than me.

## What to expect

Three areas, roughly:

- **Terraform and the HashiCorp ecosystem** — module and project structure, state, naming conventions, the parts of Terraform Cloud/Enterprise that matter once more than one person touches the same infrastructure, and how that picture is shifting now that OpenTofu exists alongside it.
- **Kubernetes, OpenShift, and the web/application server layer** — the platforms themselves, and the JBoss EAP / Apache / Nginx layer that actually runs on top of them, which gets a lot less blog coverage than the orchestration layer does.
- **Tying it together** — secrets management, CI/CD pipelines, identity — the connective tissue between "infrastructure as code" and "infrastructure someone can actually operate."

## Format

Short and practical over long and exhaustive. Some posts will be a full walkthrough with working code; others will be a page of notes on a pattern or a tool that saved me from a mistake I'd already made once. I'd rather publish something useful at the length it deserves than pad it out to look more substantial than it is.

First proper post lands soon. If there's something specific from that list you'd want covered first, [get in touch](/#contact) — I'm reading.

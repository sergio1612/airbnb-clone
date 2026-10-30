# Visual QA subagent (manual invocation)

Use Cursor **Task** with model **composer-2.5** when comparing local build to the reference.

## Prompt template

```
Full Repository Path: c:\Manav\play_power
Compare at 1920×1080 in Chrome:
- Reference: https://airbnb-clone-umber-two.vercel.app
- Local: http://localhost:5173

Checklist: header/search pill, hero mosaic, sticky nav, booking card, photo tour grid, lightbox arrows/transitions, calendar block, amenities modal, nearby carousel, footer.

Report only measurable deltas (spacing, font size, missing sections, broken keyboard).
Do not copy reference source code.
```

## Scope

Desktop only. Ignore mobile layouts.

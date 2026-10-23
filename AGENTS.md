<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The Hold & Fit prototype lives in src/proto (store = React context, screens, sheets, ui); no backend — all state is mock and in-memory so the demo resets cleanly.

- Version 2 mock orders track current/sent dresses, checkout payment and time-limited keep/undo in context; shared pure rules power both UI and tests so amounts and eligibility stay consistent.

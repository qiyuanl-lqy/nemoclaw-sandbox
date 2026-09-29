# NemoClaw (sandbox replica)

Small, self-contained replica of the NemoClaw CLI used by the NemoClaw Agentic QA
local sandbox. The PR-analysis pipeline reads pull requests and release tags from this
repository instead of `NVIDIA/NemoClaw`. Pull requests and tags are created by
`sandbox/scenarios/nemoclaw/scripts/release.py`; do not push to it by hand.

```
nemoclaw onboard                  # create a sandbox (interactive wizard)
nemoclaw list                     # list sandboxes
nemoclaw <name> connect           # open a shell in the sandbox
nemoclaw <name> status            # show sandbox state
nemoclaw <name> destroy           # delete the sandbox
nemoclaw --help | --version
```

Extra commands live in `bin/commands/*.js` and are discovered at start-up.

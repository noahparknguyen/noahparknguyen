# docs

## `preview.png`

The GitHub social preview, 1280×640. It is what shows when a link to **this
repo** is pasted into Slack, a tweet, or Discord.

It is not the card for the profile page itself. GitHub builds that from the
avatar, and nothing in here changes it.

### Uploading it

GitHub stores the social preview **outside the repo**, so committing the file
does not publish it. It has to go up by hand, once:

**Settings → General → Social preview → Edit → Upload an image**

Re-upload whenever `preview.png` changes. PNG, JPG or GIF only, under 1 MB.
WebP is rejected, which is why this one file is a PNG when the rest of the
artwork is WebP.

### Regenerating it

```bash
npm run shoot
```

It renders at exactly 1280×640, the size GitHub asks for, rather than the 1.5x
the README artwork uses. The build asserts the wordmark is centred to within
2px and fails if it is not, because a social image that is slightly off centre
looks fine on its own and wrong beside anything else.

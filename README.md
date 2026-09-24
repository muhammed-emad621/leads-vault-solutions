# Leads Vault Solutions

React/Vite site for Leads Vault Solutions. The main page is `index.html`, with the application in `src/main.jsx` and `src/styles.css`.

## Run locally

```bash
npm install
npm run dev
```

## Receiving form submissions, simplest setup

Use Formspree. It is the easiest option because this site does not need its own server or database.

1. Go to [formspree.io](https://formspree.io) and create an account.
2. Create a new form and enter `hello@leadsvaultsolutions.com` as the receiving email.
3. Verify that email address when Formspree sends the verification message.
4. Copy the form endpoint, which looks like `https://formspree.io/f/xxxxabcd`.
5. In your hosting dashboard, add an environment variable named `VITE_FORM_ENDPOINT` with that endpoint as its value.
6. Redeploy the site and submit one test message.

After that, every “Send my details” submission is forwarded to the inbox and also appears in the Formspree dashboard.

For production, set `VITE_FORM_ENDPOINT` in the hosting provider's environment variables and redeploy. Do not commit `.env` or an API key. If the endpoint is missing, the local-demo fallback opens a pre-filled email instead of claiming the form was delivered automatically.

## Production checklist

- Set and test `VITE_FORM_ENDPOINT` on the deployed site.
- Verify the inbox receives a real test submission.
- Run `npm run build` before deployment.
- Keep `.env` and provider secrets out of version control.

import NextAuth from 'next-auth'
import {Provider} from 'next-auth/providers'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  SECRET,
  VERCEL_URL,
  isDevelopment,
} from 'utils/env'

const secure = Boolean(VERCEL_URL)

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: createProviders(),

  // https://next-auth.js.org/configuration/options#secret
  // randomly generated secret: openssl rand -hex 32
  secret: SECRET,

  cookies: {
    sessionToken: {
      name: `${secure ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: !isDevelopment,
        sameSite: 'lax',
        path: '/',
        domain: isDevelopment ? 'localhost' : '.afterhours.place',
        secure,
      },
    },
  },
})

export function createProviders() {
  const providers: Provider[] = []

  // https://next-auth.js.org/providers/github
  // https://github.com/settings/apps/afterhours-development
  // https://github.com/settings/apps/new?name=Afterhours%20development&description=Your%20email%20address%20is%20used%20to%20enable%20adding%20regions%20and%20events&url=http://localhost:3000&callback_url=http://localhost:3000/api/auth/callback/github&webhook_active=false&emails=read&public=true
  // https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app-using-url-parameters
  if (GITHUB_ID && GITHUB_SECRET) {
    providers.push(
      GithubProvider({
        clientId: GITHUB_ID,
        clientSecret: GITHUB_SECRET,
        authorization: {
          params: {
            scope: 'read:user',
          },
        },
      }),
    )
  }

  // https://next-auth.js.org/providers/google
  // https://console.cloud.google.com/apis/credentials?project=afterhours-355218
  // https://console.cloud.google.com/apis/credentials/oauthclient/680785016493-oosar71b1cs9ck[%E2%80%A6]m63.apps.googleusercontent.com?project=afterhours-355218
  if (GOOGLE_ID && GOOGLE_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
    )
  }

  return providers
}

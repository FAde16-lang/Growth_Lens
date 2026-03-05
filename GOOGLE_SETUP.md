# How to Get a Google Client ID

To make the "Continue with Google" button work, you need a Client ID from Google. It's free but requires a few setup steps.

## Step 1: Create a Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Sign in with your Google account.
3.  Click the **Select a project** dropdown (top left) -> **New Project**.
4.  Name it "My Business App" (or anything) and click **Create**.

## Step 2: Configure Consent Screen
1.  In the left sidebar, go to **APIs & Services** -> **OAuth consent screen**.
2.  Select **External** and click **Create**.
3.  Fill in:
    *   **App Name**: Growth_Lens
    *   **User support email**: Your email.
    *   **Developer contact information**: Your email.
4.  Click **Save and Continue** (you can skip Scopes and Test Users for now, or add your own email as a Test User).

## Step 3: Create Credentials
1.  Go to **APIs & Services** -> **Credentials**.
2.  Click **+ CREATE CREDENTIALS** (top) -> **OAuth client ID**.
3.  **Application type**: Select **Web application**.
4.  **Authorized JavaScript origins**:
    *   Click **ADD URI**.
    *   Type: `http://localhost:5173` (This is where your React app runs).
5.  Click **Create**.

## Step 4: Copy & Paste
1.  You will see a pop-up with "Your Client ID" (a long string ending in `.apps.googleusercontent.com`).
2.  Copy that string.
3.  Open your project file: `frontend/.env`.
4.  Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your new ID.
5.  Restart your app (`Ctrl+C` in terminal, then `npm start`).

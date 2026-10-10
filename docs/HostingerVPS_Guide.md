# Hostinger VPS Deployment & Email Setup Guide

This guide details exactly how to deploy your LifeTerrain application (Web & Admin) to a **Hostinger KVM 1 VPS** and how to properly configure professional email routing for `lifeterrain.com`.

---

## Part 1: Purchasing and Initial VPS Setup

1. **Purchase the VPS:** 
   - Go to Hostinger and buy the **KVM 1 VPS** plan.
   - During checkout or setup, choose **Mumbai (India)** as your data center for the lowest latency.
   - Choose **Ubuntu 24.04 (LTS)** as your Operating System.
2. **DNS Configuration:**
   - Go to your domain registrar (BigRock, Hostinger, etc.).
   - Create **A Records** pointing to your new Hostinger VPS IP Address:
     - `A` Record -> Host: `@` -> Value: `[187.127.136.221]` (For lifeterrain.com)
     - `A` Record -> Host: `www` -> Value: `[187.127.136.221]` (For lifeterrain.com)
     - `A` Record -> Host: `admin` -> Value: `[187.127.136.221]` (For admin.lifeterrain.com)
     - `A` Record -> Host: `@` -> Value: `[187.127.136.221]` (For noeve.store)
     - `A` Record -> Host: `www` -> Value: `[187.127.136.221]` (For noeve.store)
3. **SSH into the Server:**
   Open your local terminal and connect to your VPS:
   ```bash
   ssh root@187.127.136.221
   ```

---

## Part 1.5: Security - Create a Non-Root User (Recommended)
For security reasons, it is highly discouraged to run applications and commands as the `root` user. Let's create a new administrative user named `paraadmin`.

1. **Create the user:**
   ```bash
   adduser paraadmin
   ```
   *(Follow the prompts to set a strong password. You can leave the name/phone fields blank by pressing Enter).*
   
2. **Grant administrative (sudo) privileges:**
   ```bash
   usermod -aG sudo paraadmin
   ```

3. **Switch to the new user:**
   ```bash
   su - paraadmin
   ```
   *(From now on, run all following commands as `paraadmin`. When a command requires root privileges, the guide uses `sudo`).*

## Part 1.6: Server Hardening (Firewall & SSH Security)
To ensure your VPS is safe from automated bots and attacks, you must configure a firewall and secure your SSH access.

1. **Enable the Firewall (UFW):**
   By default, all ports are open. We will use Uncomplicated Firewall (UFW) to block everything except SSH (port 22), HTTP (port 80), and HTTPS (port 443).
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```
   *(Type `y` and press Enter when it warns about disrupting existing SSH connections).*

2. **Disable Root SSH Login:**
   To prevent attackers from guessing the root password, disable root logins. Open the SSH config:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Find the line `#PermitRootLogin yes` (or `PermitRootLogin yes`), and change it to:
   ```text
   PermitRootLogin no
   ```
   *(Save and exit nano: `Ctrl+X`, `Y`, `Enter`).*

3. **Restart the SSH Service:**
   Apply the changes so nobody can log in as root directly ever again:
   ```bash
   sudo systemctl restart ssh
   ```

---

## Part 2: Server Environment Preparation

Run these commands on your VPS to install Nginx, Node.js, and PM2:

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Nginx web server
sudo apt install nginx -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install PNPM and PM2
sudo npm install -g pnpm pm2
```

---

### Part 3: Deploying the Application

We will clone your GitHub repository and build it directly on the Hostinger VPS.

### 1. Set Permissions for /var/www
Since you are using the `paraadmin` user, grant yourself permission to modify the web directory:
```bash
sudo mkdir -p /var/www
sudo chown -R paraadmin:paraadmin /var/www
```

### 2. Clone the Code (LifeTerrain)
```bash
cd /var/www
git clone https://github.com/digeesh09/lifeterrain.git
cd lifeterrain/Code
```

### 3. Clone the Code (Noeve Store)
Similarly, clone your secondary application into its own folder:
```bash
cd /var/www
git clone https://github.com/digeesh09/noeve-store.git
cd noeve-store
```

### 4. Configure Environment Variables
You need `.env.local` files for your apps.

**LifeTerrain Web App:**
```bash
nano /var/www/lifeterrain/apps/web/.env.local
```
Paste your Firebase keys, Razorpay keys, and SMTP keys here. Save and exit (`Ctrl+X`, `Y`, `Enter`).

**LifeTerrain Admin App (Crucial for Local Storage):**
```bash
nano /var/www/lifeterrain/apps/admin/.env.local
```
Paste your Firebase keys here, and importantly, ensure you add:
```env
NEXT_PUBLIC_STORAGE_MODE=local
```
Save and exit.

**(Do the same for `/var/www/noeve-store/.env.local` if it requires environment variables).**

### 5. Install & Build
Build LifeTerrain:
```bash
cd /var/www/lifeterrain/Code
pnpm install
pnpm run build
```
Build Noeve Store:
```bash
cd /var/www/noeve-store
pnpm install
pnpm run build
```

---

## Part 4: Starting the Node Servers with PM2

We will use PM2 to keep all apps running permanently on separate local ports using the built Next.js instances. SSH into your VPS as `paraadmin` and run:

```bash
# 1. Start LifeTerrain Website on port 3000
cd /var/www/lifeterrain/apps/web
pm2 start npm --name "lt-web" -- run start -- -p 3000

# 2. Start LifeTerrain Admin Dashboard on port 3001
cd /var/www/lifeterrain/apps/admin
pm2 start npm --name "lt-admin" -- run start -- -p 3001

# 3. Start Noeve Store on port 3002
cd /var/www/noeve-store
pm2 start npm --name "noeve-store" -- run start -- -p 3002

# 4. Configure PM2 to start on server reboot
pm2 startup
```

**CRITICAL STEP:** When you run `pm2 startup`, PM2 will print a custom `sudo env PATH...` command to your terminal screen. **You must copy and paste that exact command into your terminal and run it.** (Because you are not the root user, PM2 needs you to run this sudo command to configure the server's boot files).

```bash

pm2 unstartup systemd

pm2 restart all
```

---

## Part 5: Configuring Nginx Reverse Proxy & Free SSL

Nginx intercepts internet traffic (Port 80/443) and hands it to PM2 (Port 3000/3001).

1. Create a new Nginx config file:
```bash
sudo nano /etc/nginx/sites-available/lifeterrain
```
2. Paste the following configuration (Notice the `client_max_body_size 10M;` which is required for local file uploads):
```nginx
server {
    listen 80;
    server_name lifeterrain.com www.lifeterrain.com;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve user-uploaded files directly from disk (bypasses Next.js 404 cache)
    location /uploads/ {
        alias /var/www/lifeterrain/apps/web/public/uploads/;
        access_log off;
        expires max;
    }
}

server {
    listen 80;
    server_name admin.lifeterrain.com;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve user-uploaded files directly from disk
    location /uploads/ {
        alias /var/www/lifeterrain/apps/admin/public/uploads/;
        access_log off;
        expires max;
    }
}

server {
    listen 80;
    server_name noeve.store www.noeve.store;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
3. Enable it and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/lifeterrain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
4. **Generate Free HTTPS/SSL:**
Certbot will automatically fetch SSL certificates for your domains and configure Nginx to force HTTP-to-HTTPS redirection.
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d lifeterrain.com -d www.lifeterrain.com -d admin.lifeterrain.com -d noeve.store -d www.noeve.store
```
*(Note: During the Certbot process, you will be prompted for an email address. If it asks whether to redirect HTTP traffic to HTTPS, **choose Option 2 (Redirect)** to ensure all users are securely forced onto HTTPS).*

5. **Test Auto-Renewal:**
Let's Encrypt certificates expire every 90 days, but Certbot installs a timer to auto-renew them. Test it with:
```bash
sudo certbot renew --dry-run
```

---

## Part 6: Setting up Professional Emails (SMTP)

**Important Rule:** Do *not* run your own mail server (Postfix) directly on the Hostinger VPS. Emails sent from a fresh VPS IP address will almost always be flagged as spam by Google and Yahoo. 

You must use a proper Email Hosting provider to send/receive emails for `@lifeterrain.com`.

### Option A: Hostinger Free Business Email (Recommended)
Hostinger often provides a free professional email account (e.g., `support@lifeterrain.com`) if you bought the domain through them, or you can purchase Titan Email directly from Hostinger for a few rupees a month.
1. In your Hostinger Dashboard, go to **Emails** and create `support@lifeterrain.com`.
2. Generate an "App Password" or note down the SMTP credentials provided by Hostinger.
3. Add these credentials to your VPS Web `.env.local`:
   ```env
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=support@lifeterrain.com
   SMTP_PASS=your_hostinger_email_password
   ```

### Option B: Zoho Mail (Free Forever Tier)
If you don't have free email with Hostinger, Zoho Mail is the best free service for custom domains.
1. Sign up for **Zoho Mail** using the "Forever Free" tier.
2. Verify domain ownership by adding the Zoho TXT records to your domain's DNS in Hostinger/BigRock.
3. Create `support@lifeterrain.com` in Zoho.
4. Go to Zoho Security Settings and generate an **App Password**.
5. Add these credentials to your VPS Web `.env.local`:
   ```env
   SMTP_HOST=smtp.zoho.in
   SMTP_PORT=465
   SMTP_USER=support@lifeterrain.com
   SMTP_PASS=your_zoho_app_password
   ```

### Restart to apply Email settings
Whenever you update the `.env.local` file with new SMTP keys, you must restart the PM2 process on the VPS for the changes to take effect:
```bash
pm2 restart lt-web
```

Your Next.js applications and professional email routing are now successfully configured!

### Setting up zoho mail
Here is the step-by-step process for setting up your custom lifeterrain.com email addresses on Zoho's Free plan. You will need access to the platform where your domain's DNS is managed (such as GoDaddy, Cloudflare, or Namecheap) to complete this setup.

- 1. Sign Up for the Free Plan :: Create your Zoho account.

Go to the Zoho Mail pricing page and scroll down to select the Forever Free Plan. Choose to sign up with a domain you already own and enter lifeterrain.com. Follow the prompts to create your account and verify your mobile number.How to verify: Once completed, you should be successfully redirected to the Zoho Mail Admin Console.

- 2. Verify Domain Ownership :: Proves you own lifeterrain.com

In the Zoho Admin Console, select your DNS hosting provider from the drop-down list. Zoho will generate a unique TXT record value for you. Log into your domain registrar's DNS management settings and create a new TXT record using the @ symbol for the host or name field, and paste the generated Zoho string into the value field.
How to verify: Return to Zoho and click "Verify". The domain ownership status will change to "Verified" (note that DNS changes can sometimes take up to 30 minutes to propagate).

- 3. Create Your Email Address :: Set up your primary inbox.

After domain verification, Zoho will prompt you to create your primary domain-based email address (e.g., name@lifeterrain.com). Enter your desired username and save it.How to verify: You should now be able to log into the main Zoho Mail web interface and view your new inbox.

- 4. Configure MX Records :: Enables receiving emails.

To route incoming mail to Zoho, you must add their Mail Exchanger (MX) records to your domain's DNS settings. First, delete any existing MX records related to previous email providers. Then, add the following three MX records:

      - Host/Name: @ | Value: mx.zoho.com | Priority: 10
      - Host/Name: @ | Value: mx2.zoho.com | Priority: 20
      - Host/Name: @ | Value: mx3.zoho.com | Priority: 50

(Note: Depending on your region, the .com portion might be .eu or .in—always use the exact values Zoho provides in the admin console).How to verify: You can verify these records directly within the Zoho Admin Console's DNS Mapping page, which will show a green checkmark once the routing is detected.

- 5. Configure SPF and DKIM :: Prevents your emails from going to spam.

Return to your DNS settings one last time to add two more TXT records.

      - SPF: Add a TXT record with the host as @ and the value as v=spf1 include:zohomail.com -all (use the exact value Zoho provides).
      - DKIM: In Zoho's Email Configuration section, generate a new DKIM selector (like test or zoho). Add a TXT record with the host as selectorname._domainkey and paste the long string Zoho gives you into the value field.
   How to verify: Send a test email from your new Zoho account to a personal Gmail or Yahoo account. If it lands in the inbox instead of the spam folder, your authentication records are working correctly.


# Reset your password for lifeterrain is going to spam

This is exactly why I mentioned the Firebase Console configuration in my last message!

The "Reset Password" emails are sent natively by Google/Firebase Authentication, NOT by the Cloud Functions. Right now, Firebase is sending those emails from a generic address like noreply@your-project-id.firebaseapp.com. Because it's an automated Google address and not your actual domain, email providers like Gmail and Yahoo immediately flag it as spam.

To fix this so it lands directly in the user's primary inbox, you must tell Firebase to send these emails from your official domain (support@lifeterrain.com) and verify that you own it.

Here is the exact step-by-step to stop them from going to spam:

Step 1: Customize the Sender Address in Firebase
Log into the Firebase Console
 and select your project.
In the left sidebar, click Authentication, then go to the Templates tab.
Click the pencil icon (Edit) next to Sender (Email address).
Change the email address to your professional email: support@lifeterrain.com (or whatever address you created).
Click Save.
Step 2: Authenticate the Domain (Crucial for Spam Prevention)
Once you save the custom email, Firebase will require you to verify that you actually own lifeterrain.com.

Firebase will generate DNS TXT and CNAME records for you.
Log into your domain registrar (Hostinger, BigRock, GoDaddy, etc.) and go to the DNS / Nameservers section.
Add the TXT and CNAME records exactly as Firebase provides them. This sets up SPF and DKIM for Firebase, which proves to Gmail/Yahoo that Firebase has your permission to send emails on your behalf.
Go back to Firebase and click Verify. (Note: DNS changes can sometimes take 15-30 minutes to propagate).
Step 3 (Alternative): Link your custom SMTP to Firebase Auth
If you don't want to use Firebase's email servers at all, Firebase allows you to route these reset emails directly through your Zoho/Hostinger SMTP server:

In the Templates tab, under the Sender settings, look for the Custom SMTP section.
Enter the exact same Host, Port, User, and Password you use for your Cloud Functions (smtp.zoho.in, 465, etc.).
Once you complete Step 2 or Step 3, your password reset emails will instantly start bypassing the spam filter and landing in the primary inbox!
---

## Part 7: Updating the Hosted Site (Deploying Changes)

Whenever you make changes to your codebase (like pushing updates to GitHub) and want to deploy them to your live server, follow these steps:

1. **SSH into the Server:**
   Open your local terminal and connect as the `paraadmin` user:
   ```bash
   ssh paraadmin@187.127.136.221
   ```
   *(If you connected as root, switch users by running `su - paraadmin`)*

2. **Navigate to the Project Directory:**
   ```bash
   cd /var/www/lifeterrain/Code
   ```

3. **Pull the Latest Code:**
   Fetch the latest updates from your GitHub repository:
   ```bash
   git pull origin main
   ```
   *(If your primary branch is `master`, use `git pull origin master` instead).*

4. **Install Dependencies and Rebuild:**
   Install any new packages and compile the updated Next.js application:
   ```bash
   pnpm install
   pnpm run build
   ```

5. **Restart the PM2 Processes:**
   For the changes to take effect, you must restart the running Node servers so they pick up the newly built files:
   ```bash
   # If you updated both Web and Admin:
   pm2 restart lt-web lt-admin

   # Or if you only updated Web:
   pm2 restart lt-web
   ```

6. **Verify the Updates:**
   Visit your live website (`https://lifeterrain.com`) in your browser to confirm your changes are successfully live! If you don't see the changes immediately, try hard-refreshing your browser (Ctrl+F5 or Cmd+Shift+R) to clear the local cache.

# Crizgen Website

A high-performance, responsive, production-ready single-page website for **Crizgen** (crizgen.com) — a modern web and mobile app development startup based in Chennai, India.

Built with clean, vanilla HTML5, CSS3, and modern JavaScript. Zero build steps, zero external frameworks, and blazingly fast load times.

---

## 🚀 Features

- **Minimalist Sticky Navigation**: Floating glassmorphism navbar with Crizgen wordmark, smooth section links, and mobile drawer menu.
- **Dark & Light Mode**: Dark theme by default with seamless toggle to light theme. Preference automatically persists via `localStorage` (wrapped safely in `try/catch`).
- **Single Accent Color Architecture**: Modern tech palette with a single primary accent (`#6366f1` Electric Indigo) defined via CSS variables at the top of `style.css` for instant customization.
- **Fluid Typography & Spacing**: Clean `clamp()` scaling using the Google Font **Inter** with native system fallbacks.
- **Accessible & Performance-Minded**: Semantic HTML5, accessible form labels, skip-to-content link, WCAG AA/AAA contrast ratios, and `prefers-reduced-motion` compliance.
- **What We Build**: Clear capability cards for business websites, custom web apps, and mobile experiences.
- **5-Stage Development Workflow**: Discuss ➔ Design ➔ Develop ➔ Launch ➔ Support.
- **Interactive Contact Form**: Integrated with Formspree / Web3Forms support, client-side input validation, and loading indicators.
- **Floating WhatsApp Button**: Sticky action button at bottom-right with pulsating badge and direct message intent.
- **Complete SEO & Social Metadata**: Preconfigured Open Graph, Twitter cards, meta descriptions, and custom SVG favicon.

---

## 📁 File Structure

```text
crizgen/
├── index.html        # Main HTML structure with semantic sections and SEO tags
├── style.css         # Modern design system, themes, typography, and responsive styles
├── script.js         # Vanilla JS logic (theme persistence, mobile drawer, form validation)
├── favicon.svg       # Custom geometric Crizgen brand icon
└── README.md         # Documentation & deployment guide
```

---

## 🔍 Replacing Placeholders (Search for `TODO`)

Temporary values and dummy contact details are flagged with standard `TODO` comments. Search for `TODO` across the project files to quickly update them:

### 1. Tagline
The hero tagline in `index.html` is:
```html
<p class="hero-subtext reveal-fade">
  We design and build fast, scalable web apps and mobile solutions that turn ambitious ideas into market-defining experiences.
</p>
```
Replace the paragraph if you want to change the tagline.

### 2. Contact Information
In `index.html`, search for `<!-- TODO: replace contact -->`:
- **Email**: `crizgen2026@gmail.com` (`href="mailto:crizgen2026@gmail.com"`)
- **Address**: `No. 29/14, 15th Street, Padi Puthu Nagar, Anna Nagar West Extension, Chennai - 600101`
- **Phone**: `+91 90926 56327` (`href="tel:+919092656327"`)
- **WhatsApp**: Configured to `+91 90926 56327` via `https://wa.me/919092656327`. This official click-to-chat link opens the app when supported or offers WhatsApp Web:
  ```html
  href="https://wa.me/919092656327?text=Hello%20Crizgen..."
  ```

---

## ✉️ Setting Up the Contact Form (Web3Forms)

The contact form is connected to **Web3Forms** so inquiries are emailed directly to `crizgen2026@gmail.com`:
- Form submissions are automatically protected by a hidden honeypot (`botcheck`) and include the subject `"New Crixgen Project Inquiry"`.
- Configured with your Web3Forms access key in `script.js` and `index.html`.

---

## 🎨 Customizing the Accent Color & Themes

To change the primary accent color across the entire site, open `style.css` and modify `--accent` at the top of the file:

```css
:root {
  /* Change this single color variable to rebrand */
  --accent: #6366f1;                 /* Indigo (Default) */
  --accent-hover: #4f46e5;
  --accent-light: #818cf8;
  --accent-rgb: 99, 102, 241;
  /* e.g., for Emerald: --accent: #10b981; */
  /* e.g., for Cyan:    --accent: #06b6d4; */
}
```

---

## 🌐 Deploying the Website

Since the site uses plain HTML, CSS, and JavaScript, it can be deployed for free on static web hosting providers in seconds.

### Method 1: Deploying to Netlify

#### A. Drag-and-Drop (Instant):
1. Sign in to [Netlify](https://app.netlify.com).
2. Navigate to **Sites** ➔ **Add new site** ➔ **Deploy manually**.
3. Drag and drop the `crizgen` folder into the Netlify drop zone.
4. Your site will be live immediately with an SSL-secured URL (e.g., `https://crizgen.netlify.app`).

#### B. Git Integration:
1. Push this directory to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Crizgen website"
   git branch -M main
   git remote add origin https://github.com/your-username/crizgen.git
   git push -u origin main
   ```
2. In Netlify, click **Add new site** ➔ **Import an existing project** ➔ Select your GitHub repository.
3. Leave build settings blank (Build command: none, Publish directory: `/`).
4. Click **Deploy**. Netlify will automatically redeploy whenever you push updates.

---

### Method 2: Deploying to GitHub Pages

1. Create a GitHub repository named `crizgen` or `your-username.github.io`.
2. Push your files to the repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Deploy Crizgen website"
   git branch -M main
   git remote add origin https://github.com/your-username/crizgen.git
   git push -u origin main
   ```
3. In your GitHub repository, navigate to **Settings** ➔ **Pages**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your site will be published at `https://your-username.github.io/crizgen/`.

---

## 🔗 Connecting Your Custom Domain (`crizgen.com`)

To point `crizgen.com` to your deployed website, configure DNS records at your domain registrar (such as GoDaddy, Namecheap, Google Domains / Squarespace, or Cloudflare).

### If Hosting on Netlify:

1. In the Netlify dashboard, go to **Site configuration** ➔ **Domain management** ➔ **Add a domain**.
2. Enter `crizgen.com` and click **Verify**.
3. Log in to your domain registrar's DNS management console and add these records:

| Record Type | Host / Name | Value / Points To | TTL | Note |
|---|---|---|---|---|
| **A** | `@` (or leave empty) | `75.2.60.5` | 3600 (or Auto) | Netlify Apex Load Balancer |
| **CNAME** | `www` | `crizgen.netlify.app` | 3600 (or Auto) | Points `www.crizgen.com` to Netlify |

4. In Netlify, scroll down to **HTTPS** and click **Verify DNS configuration** to provision a free Let's Encrypt SSL certificate.

---

### If Hosting on GitHub Pages:

1. In your GitHub repository, go to **Settings** ➔ **Pages** ➔ **Custom domain**.
2. Enter `crizgen.com` and click **Save**. GitHub will automatically create a `CNAME` file.
3. Check the box **Enforce HTTPS** (once DNS resolves).
4. In your domain registrar's DNS settings, add the following **A records** for the apex domain:

| Record Type | Host / Name | Value / Points To |
|---|---|---|
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |
| **CNAME** | `www` | `your-username.github.io` |

*(DNS propagation typically takes anywhere from 5 minutes to 24 hours).*

---

## 💻 Local Development & Testing

You can run and test the website locally using any lightweight local server:

### Using Python:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Using Node.js (npx):
```bash
npx serve .
```

---

## 📄 License & Ownership
Copyright © 2026 Crizgen. All rights reserved.
Built for Crizgen — Web & App Development Company, Chennai, India.

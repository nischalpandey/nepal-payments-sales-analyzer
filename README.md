# Nepal Payments Sales Analyzer

A modern, responsive sales and payment transaction analytics dashboard built with **Next.js 15**, **React**, **TypeScript**, and **Tailwind CSS**. Designed for quick transaction CSV parsing, product performance breakdowns, fee calculation in **NPR (Rs.)**, and interactive trend visualization.

---

## 🌟 Key Features

- **Interactive CSV Upload**: Drag & drop or browse any custom transaction CSV file.
- **Download Demo CSV**: Instantly download a privacy-friendly, anonymized sample CSV file (`demo_sales_data.csv`) directly from the header to test or inspect the required format.
- **Currency Support**: All revenue metrics, transaction amounts, average order values, and fee structures are formatted in **Rs.**.
- **Privacy-First Data Parsing**: All CSV data processing happens 100% client-side in your browser. No transaction data or personal information is sent to external servers.
- **Key Metrics & KPIs**: Instant calculation of Gross Sales, Service Charges, Net Revenue, Success Rate, Average Ticket Size, and Average Fee/Order.
- **Monthly Revenue Trends**: Interactive chart visualizing sales and fee progression across months.
- **Product Group Analysis**: Automatic grouping and sorting of sales by product description with percentage contribution.
- **Filterable Transaction Log**: Filter transactions by year, status (Success/Failed), or specific product description.

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sales-insights-dashboard.git
   cd sales-insights-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **View in Browser**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🌐 Hosting on GitHub Pages

You can easily host this dashboard on **GitHub Pages** as a static website for free.

### Method 1: Automatic Deployment using GitHub Actions (Recommended)

1. **Push your repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sales-insights-dashboard.git
   git push -u origin main
   ```

2. **Configure `next.config.ts` for Static Export**:
   Update `next.config.ts` to set `output: 'export'` and configure the base path if hosting on a repository subpath (e.g., `https://username.github.io/repository-name`):

   ```typescript
   import type { NextConfig } from 'next';

   const isGithubActions = process.env.GITHUB_ACTIONS || false;
   let repo = '';
   if (isGithubActions) {
     repo = process.env.GITHUB_REPOSITORY?.replace(/^.*?\//, '') || '';
   }

   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     basePath: repo ? `/${repo}` : '',
     assetPrefix: repo ? `/${repo}/` : '',
     reactStrictMode: true,
   };

   export default nextConfig;
   ```

3. **Add GitHub Actions Workflow**:
   Create a file `.github/workflows/deploy.yml` in your repository:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build Next.js static site
           run: npm run build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. **Enable GitHub Pages in Repository Settings**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - Push a commit to `main`, and your site will be published at `https://YOUR_USERNAME.github.io/sales-insights-dashboard/`.

---

### Method 2: Manual Build & Deploy with `gh-pages`

1. **Install `gh-pages` package**:
   ```bash
   npm install -D gh-pages
   ```

2. **Add export script to `package.json`**:
   ```json
   "scripts": {
     "build": "next build",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d out -b gh-pages"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Set GitHub Pages Source**:
   In GitHub repository **Settings** > **Pages**, select branch `gh-pages` and folder `/ (root)`.

---

## 📊 Expected CSV Format

Your uploaded CSV file should contain the following headers (column names are flexibly matched):

| Header | Description | Example |
| :--- | :--- | :--- |
| `S.N` | Serial Number | `1` |
| `Transaction Id` | Internal System ID | `100010712779` |
| `Merchant Transaction Id` | Merchant Reference | `tx-23701` |
| `Merchant Description` | Product/Service Name | ` Training Module` |
| `Transaction Amount` | Amount in Rs. | `600.00` |
| `Status` | Payment Status | `Success` or `Failed` |
| `CbsMessage` | System Response Message | `payment successful` |
| `Service Charge` | Gateway/Service Fee | `2.00` |
| `ApiUserName` |  Username | `user` |
| `Created Date` | Date and Time | `7/16/2026 6:38:38 PM` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components & Icons**: Tailwind CSS, Lucide React
- **Charts**: Recharts
- **CSV Parser**: PapaParse
- **Type Checking**: TypeScript

---

## 📝 License

Distributed under the MIT License. Feel free to use and adapt for your own sales reporting workflows.

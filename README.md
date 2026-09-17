# CivicBank Internet Banking Platform

Professional internet-banking demo foundation built with Next.js, TypeScript, Prisma and Recharts.

## Features
- Public banking landing page
- Market ticker, converter and market table/chart
- Customer registration with automatic account-number assignment
- Customer dashboard with KPIs, charts and transaction table
- Transfers, deposits, withdrawals, savings, investments and loans UI
- Investment payment receipt approval workflow
- Admin control centre and CRUD-oriented modules
- Wallet/QR configuration model
- News/CMS, market, support, roles and audit-log models

## Run
npm install
npx prisma generate
npx prisma db push
npm run dev

This is a demonstration/prototype. It is not connected to a real bank, brokerage or payment network. Real deployment requires applicable licensing, KYC/AML, MFA, fraud controls, secure file storage, payment-provider integration, reconciliation and regulatory compliance.

\n## Phase 2 UI/Workflow additions
- Admin customer CRUD interface
- Admin investment-plan CRUD interface
- Investment receipt approval queue
- Company wallet/QR settings interface
- Customer transaction workflow interface
- Customer investment receipt submission interface
- Explicit separation between receipt submission and financial approval

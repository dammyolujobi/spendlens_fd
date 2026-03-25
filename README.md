# SpendLens

A modern, intelligent spending tracker that syncs with your Gmail inbox to automatically categorize and monitor your financial transactions. Built with Next.js and featuring a beautiful glass morphism design inspired by Apple's UI aesthetic.

## Features

**Smart Transaction Detection**
- Automatically reads transaction emails from Gmail
- Intelligently categorizes transactions as credit or debit
- Detects and excludes failed payments
- Nigerian Naira (₦) currency support

**Modern Design**
- Apple-inspired glass morphism UI
- Dark and light mode support with system preference detection
- Responsive design for desktop and mobile
- Smooth transitions and hover effects

**Analytics & Insights**
- Dashboard with summary cards (Total Spent/Received)
- Interactive spending breakdown by vendor
- Transaction history with filtering (All/Credit/Debit)
- Top vendors analysis
- Detailed analytics page

**Theme Support**
- Light mode, dark mode, and system preference detection
- Persistent theme preference
- Built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16.2.0 with Turbopack
- **Styling**: Tailwind CSS with custom glass morphism effects
- **UI Components**: shadcn/ui, lucide-react icons
- **Charts**: Recharts for data visualization
- **Theme**: next-themes for dark/light mode
- **Language**: TypeScript for type safety

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python backend API running at `http://127.0.0.1:8000/gmail/get_amount`
- Gmail account with transaction emails

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spendlens_fd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your configuration as needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Dashboard (`/`)
- View your total spending and total amount received
- See a histogram of spending by top 8 vendors
- Clear overview of your financial snapshot

### Transactions (`/transactions`)
- Browse all your transactions in chronological order
- Filter by type: All, Credit, or Debit
- Color-coded transaction types (red for debit, green for credit)
- View transaction details including sender and date

### Analytics (`/analytics`)
- In-depth spending analysis
- Top vendors breakdown with total spent per vendor
- Spending insights and trends
- Total debit and credit calculations (excluding failed transactions)

### Settings (`/settings`)
- Switch between light, dark, and system theme preferences
- App information and version

## Transaction Type Detection

The app intelligently detects transaction types from email subjects:

- **Debit**: "order", "receipt", "payment", "charged", "purchase", "subscription", "paid"
- **Credit**: "credit", "received", "deposit", "refund", "transfer in", "paid to", "incoming"
- **Failed**: "could not be completed", "payment failed", "unsuccessful", "declined", "error"

Failed transactions are excluded from all spending metrics.

## Project Structure

```
spendlens_fd/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Dashboard home
│   ├── transactions/       # Transactions page
│   ├── analytics/          # Analytics page
│   └── settings/           # Settings page
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── header.tsx
│   │   ├── summary-cards.tsx
│   │   ├── spending-chart.tsx
│   │   └── transaction-list.tsx
│   ├── ui/                 # shadcn/ui components
│   ├── navbar.tsx          # Navigation bar
│   └── theme-provider.tsx  # Theme configuration
├── lib/
│   └── utils.ts            # Utility functions (type detection, formatting)
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── public/                 # Static assets
├── styles/                 # Global styles
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── postcss.config.mjs      # PostCSS configuration
```

## API Integration

The app fetches transaction data from your backend:

**Endpoint**: `GET http://127.0.0.1:8000/gmail/get_amount`

**Expected Response**:
```json
[
  {
    "from": "Vendor Name",
    "amount": "1234.50",
    "date": "Mon, 01 Jan 2024 12:00:00 +0000 (UTC)",
    "subject": "Transaction Subject"
  }
]
```

The frontend automatically adds the `type` field based on subject analysis.

## Development

### Build for production
```bash
npm run build
npm run start
```

### Type checking
```bash
npm run type-check
```

### Troubleshooting

**Ensure backend is running**
```bash
# Check that your Python backend is accessible at localhost:8000/gmail/get_amount
curl http://127.0.0.1:8000/gmail/get_amount
```

**Clear Next.js cache**
```bash
rm -rf .next
npm run dev
```

## Performance Features

- Turbopack for fast development builds
- Server Components with streaming (Next.js 16)
- Optimized bundle size with tree-shaking
- Automatic image optimization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Mobile app version
- Data export (CSV, PDF)
- Transaction notifications
- Advanced charts and graphs
- Custom transaction tagging
- Multi-account support
- Recurring transaction detection

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feedback, please open an issue on the GitHub repository.

---

Built with care for smarter spending

import mongoose from 'mongoose';
import { Deal } from '../models/Deal.model';
import dotenv from 'dotenv';

dotenv.config();

const dummyDeals = [
  {
    name: 'GitHub Pro - 1 Year Free',
    slug: 'github-pro-1-year',
    shortDescription: 'Free GitHub Pro for verified startups',
    description: 'Get GitHub Pro completely free for 1 year with advanced code review and CI/CD features.',
    category: 'devtools',
    value: 12,
    discount: 100,
    company: 'GitHub',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    link: 'https://github.com/startups',
    couponCode: 'STARTUP2024',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Email verification', 'Active startup account'],
    benefits: ['Unlimited private repos', 'Advanced CI/CD', 'Code security', 'Team tools'],
    tags: ['development', 'version-control', 'devops'],
    isFeatured: true
  },
  {
    name: 'AWS Activate - $100k Credits',
    slug: 'aws-activate-100k',
    shortDescription: 'Up to $100k in AWS credits for startups',
    description: 'AWS Activate provides up to $100k in AWS credits for startups backed by accelerators/VCs.',
    category: 'cloud',
    value: 100000,
    discount: 100,
    company: 'Amazon Web Services',
    logo: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
    link: 'https://aws.amazon.com/activate/',
    couponCode: 'ACTIVATE2024',
    isLocked: true,
    eligibilityText: 'Requires admin verification - accelerator/VC backed startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Accelerator program member'],
    benefits: ['$100k AWS credits', 'Technical training', 'Support team access', 'Partner network'],
    tags: ['cloud', 'infrastructure', 'deployment'],
    isFeatured: true
  },
  {
    name: 'Figma Professional - 1 Year',
    slug: 'figma-pro-1-year',
    shortDescription: 'Free Figma Professional for verified users',
    description: 'Figma Professional plan free for one year with unlimited projects and prototyping.',
    category: 'design',
    value: 12,
    discount: 100,
    company: 'Figma',
    logo: 'https://s3-alpha.figma.com/hub/file/1481185752/fa4cd070-6a79-4e1b-b079-8f09ff334635-cover',
    link: 'https://figma.com/startups',
    couponCode: 'FIGMA-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified users',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Email verification', 'Active account'],
    benefits: ['Unlimited projects', 'Team collaboration', 'Advanced prototyping', 'Design systems'],
    tags: ['design', 'ui-ux', 'prototyping'],
    isFeatured: false
  },
  {
    name: 'Stripe - Waived Processing Fees',
    slug: 'stripe-waived-fees',
    shortDescription: 'No Stripe fees on first $500k',
    description: 'Stripe waives processing fees on first $500k in transactions for verified startups.',
    category: 'cloud',
    value: 5000,
    discount: 100,
    company: 'Stripe',
    logo: 'https://images.ctfassets.net/fzn2n1nzqp7d/1B3N0N0N0N0N0N0N0N0/1b3n0n0n0n0n0n0n0n/stripe_logo.png',
    link: 'https://stripe.com/startups',
    couponCode: 'STRIPE-STARTUP',
    isLocked: true,
    eligibilityText: 'Requires admin verification - revenue-generating startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Revenue-generating'],
    benefits: ['$5k+ in saved fees', 'Enhanced support', 'Extended payouts'],
    tags: ['payments', 'fintech', 'e-commerce'],
    isFeatured: false
  },
  {
    name: 'Slack Professional - 1 Year',
    slug: 'slack-pro-1-year',
    shortDescription: 'Free Slack Professional for 1 year',
    description: 'Slack Professional plan free for one year with unlimited message history and integrations.',
    category: 'productivity',
    value: 80,
    discount: 100,
    company: 'Slack',
    logo: 'https://a.slack-edge.com/80588/marketing/img/slack_hash_black_png.png',
    link: 'https://slack.com/startups',
    couponCode: 'SLACK-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Less than 100 employees'],
    benefits: ['Unlimited message history', 'All integrations', 'Shared channels', 'Video calls'],
    tags: ['communication', 'collaboration', 'productivity'],
    isFeatured: false
  },
  {
    name: 'Notion Business Plus - 1 Year',
    slug: 'notion-business-plus-1year',
    shortDescription: 'Free Notion Business Plus for 1 year',
    description: 'Notion Business Plus plan free for one year with advanced documentation features.',
    category: 'productivity',
    value: 20,
    discount: 100,
    company: 'Notion',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
    link: 'https://notion.so/startups',
    couponCode: 'NOTION-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Team with 3+ members'],
    benefits: ['Advanced databases', 'Synced blocks', 'Unlimited guests', 'Advanced permissions'],
    tags: ['documentation', 'productivity', 'collaboration'],
    isFeatured: false
  },
  {
    name: 'Vercel Pro - 6 Months',
    slug: 'vercel-pro-6months',
    shortDescription: 'Free Vercel Pro for 6 months',
    description: 'Vercel Pro plan free for 6 months with advanced analytics and edge functions.',
    category: 'devtools',
    value: 100,
    discount: 100,
    company: 'Vercel',
    logo: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    link: 'https://vercel.com/startups',
    couponCode: 'VERCEL-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'GitHub account'],
    benefits: ['Advanced analytics', 'Priority support', 'Edge functions', 'Web vitals'],
    tags: ['deployment', 'frontend', 'devops'],
    isFeatured: false
  },
  {
    name: 'MongoDB Atlas - $500 Credits',
    slug: 'mongodb-500-credits',
    shortDescription: 'Free MongoDB Atlas credits worth $500',
    description: 'MongoDB Atlas free tier plus $500 in credits for verified startups.',
    category: 'database',
    value: 500,
    discount: 100,
    company: 'MongoDB',
    logo: 'https://www.mongodb.com/assets/images/global/favicon.ico',
    link: 'https://www.mongodb.com/startups',
    couponCode: 'MONGODB-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Technical team'],
    benefits: ['$500 in credits', 'Cloud database hosting', 'Automated backups', 'Scaling support'],
    tags: ['database', 'nosql', 'cloud'],
    isFeatured: false
  },
  {
    name: 'Auth0 Premium - 1 Year',
    slug: 'auth0-premium-1year',
    shortDescription: 'Free Auth0 Premium for 1 year',
    description: 'Auth0 Premium plan free for one year with unlimited users and advanced security.',
    category: 'security',
    value: 15,
    discount: 100,
    company: 'Auth0',
    logo: 'https://auth0.com/auth0-logo-black.png',
    link: 'https://auth0.com/startups',
    couponCode: 'AUTH0-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: ['Unlimited users', 'Advanced security', 'Social login', 'MFA'],
    tags: ['security', 'authentication', 'identity'],
    isFeatured: false
  },
  {
    name: 'Datadog Premium - 6 Months',
    slug: 'datadog-premium-6months',
    shortDescription: 'Free Datadog Premium for 6 months',
    description: 'Datadog Premium plan free for 6 months to monitor and optimize your infrastructure.',
    category: 'devops',
    value: 15,
    discount: 100,
    company: 'Datadog',
    logo: 'https://datadog-live.imgix.net/img/about/presskit/logo-v/dd_horizontal_purple.png',
    link: 'https://www.datadoghq.com/startups',
    couponCode: 'DATADOG-STARTUP',
    isLocked: false,
    eligibilityText: 'Available to all verified startups',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: ['Unlimited data retention', 'All integrations', 'Advanced alerting', 'Custom dashboards'],
    tags: ['monitoring', 'devops', 'observability'],
    isFeatured: false
  }
];

async function seedDeals() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('    Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('🗑️  Cleared existing deals');

    // Insert deals
    const inserted = await Deal.insertMany(dummyDeals);
    console.log(`    Successfully inserted ${inserted.length} deals`);

    // Log sample deals
    console.log('\n📋 Sample Deals:');
    inserted.slice(0, 3).forEach((deal, idx) => {
      console.log(`\n${idx + 1}. ${deal.name}`);
      console.log(`   Category: ${deal.category}`);
      console.log(`   Value: $${deal.value}`);
      console.log(`   Company: ${deal.company}`);
    });

    console.log(`\n... and ${inserted.length - 3} more deals\n`);
    console.log('🎉 Seeding completed!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seedDeals();

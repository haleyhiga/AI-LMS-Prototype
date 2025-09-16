# GitHub Setup Guide

## 🔐 Security Measures Implemented

This repository has been configured with proper security measures to protect sensitive information:

### ✅ What's Protected
- **API Keys**: All `.env` files are ignored by git
- **Environment Variables**: Local environment files are not tracked
- **Secrets**: No sensitive data is committed to the repository

### 📁 Files Ignored by Git
- `.env` - Environment variables
- `.env.local` - Local environment variables (contains API keys)
- `.env.development.local` - Development environment variables
- `.env.test.local` - Test environment variables
- `.env.production.local` - Production environment variables
- `node_modules/` - Dependencies
- `build/` - Production builds
- `.DS_Store` - macOS system files

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/haleyhiga/AI-LMS-Prototype.git
cd AI-LMS-Prototype
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual API keys:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Get Your API Keys

#### Supabase Keys
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy the Project URL and anon public key

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### 5. Run the Application
```bash
npm start
```

## 🔒 Security Best Practices

### For Contributors
- **Never commit `.env` files** - They contain sensitive API keys
- **Use `.env.example`** - This file shows the required environment variables without actual values
- **Test with your own keys** - Use your own API keys for development and testing

### For Repository Owners
- **Regular security audits** - Check for any accidentally committed secrets
- **Use GitHub's secret scanning** - Enable push protection to prevent secret commits
- **Rotate keys regularly** - Change API keys periodically for security

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Yes | `https://xyz.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `REACT_APP_OPENAI_API_KEY` | Your OpenAI API key | Yes | `sk-proj-abc123...` |

## 🛠️ Development Workflow

1. **Fork the repository** (if contributing)
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** with your own API keys
5. **Commit changes**: `git commit -m "Add your feature"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Create a Pull Request**

## ⚠️ Important Notes

- **API Keys are personal** - Each developer needs their own keys
- **Never share keys** - Keep your API keys private and secure
- **Monitor usage** - Keep track of your API usage and costs
- **Use environment variables** - Never hardcode API keys in the source code

## 🆘 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Run `npm install` to install dependencies

2. **API key not working**
   - Check that your `.env.local` file exists and has the correct keys
   - Restart the development server after adding environment variables

3. **Supabase connection issues**
   - Verify your Supabase URL and anon key are correct
   - Check that your Supabase project is active

4. **OpenAI API errors**
   - Verify your API key is valid and has credits
   - Check that you have the correct model access

### Getting Help

- Check the [Issues](https://github.com/haleyhiga/AI-LMS-Prototype/issues) page
- Review the [README.md](README.md) for detailed setup instructions
- Check the [SETUP.md](SETUP.md) for Supabase-specific setup

## 📄 License

This project is open source. Please respect the API usage policies of the services used (Supabase, OpenAI).

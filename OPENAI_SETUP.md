# 🔄 Switched to OpenAI (ChatGPT) for AI Descriptions

## Important Note About ChatGPT Plus vs API

**Your ChatGPT Plus membership ($20/month) and the OpenAI API are separate services:**

- 🎯 **ChatGPT Plus** = Web access to GPT-4 with priority during peak times
- 🔌 **OpenAI API** = Programmatic access for developers (pay-per-use)

**Good news:** The API is actually **much cheaper** for your use case!

---

## Getting Your OpenAI API Key

### Step 1: Create API Account

1. Go to [platform.openai.com](https://platform.openai.com/signup)
2. Sign in with your existing OpenAI account (same one as ChatGPT Plus)
3. Go to [API Keys page](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Name it "TSUYA NO UCHI"
6. Copy the key (starts with `sk-proj-...`)

### Step 2: Add to Environment Variables

Update your `.env.local` file:

```bash
# Replace GEMINI_API_KEY with:
OPENAI_API_KEY=sk-proj-your_key_here
```

### Step 3: Restart Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

That's it! Your AI descriptions now use ChatGPT! 🎉

---

## Pricing Comparison

### OpenAI (GPT-4o-mini) - **Now Using This** ✅

| Usage | Cost |
|-------|------|
| 1,000 descriptions | **~$0.15** |
| Per description | **~$0.00015** |

**Example monthly cost:** If you generate 100 product descriptions per month = **$0.015** (~1.5 cents!)

### Gemini (Previous)

| Usage | Cost |
|-------|------|
| 1,000 descriptions | ~$0.05 |
| Per description | ~$0.00005 |

---

## Model Details

**Using:** `gpt-4o-mini`

**Why this model?**
- ✅ Perfect balance of quality and cost
- ✅ Excellent for creative writing
- ✅ Fast response times (~1-2 seconds)
- ✅ Better at understanding brand voice
- ✅ 16K context window

**Alternative:** If you want even better descriptions, you can switch to `gpt-4o` (10x more expensive but highest quality):

```typescript
// In lib/gemini.ts, change line 33:
model: 'gpt-4o', // instead of 'gpt-4o-mini'
```

---

## What Changed in Your Code

### 1. Installed OpenAI SDK
```bash
npm install openai --legacy-peer-deps
```

### 2. Updated `lib/gemini.ts`
Now uses OpenAI's API instead of Google Gemini:
- Model: `gpt-4o-mini`
- Temperature: 0.7 (creative but consistent)
- Max tokens: 100 (perfect for 40-word descriptions)

### 3. Updated Error Messages
Changed from "GEMINI_API_KEY" to "OPENAI_API_KEY"

---

## Testing It Out

1. Go to `/admin`
2. Click "Add Product"
3. Fill in:
   - Name: "Moonlit Garden"
   - Category: "Art Prints"
4. Click the ✨ **AI Generate** button
5. Watch ChatGPT write your description!

**Example Output:**
> "Soft brushstrokes capture the quiet elegance of a moonlit garden. Delicate shadows and muted tones evoke the timeless beauty of traditional Japanese woodblock artistry."

---

## Adding Credits to Your Account

OpenAI requires prepaid credits:

1. Go to [Billing](https://platform.openai.com/settings/organization/billing/overview)
2. Click "Add payment method"
3. Add $5 minimum (this will last you **THOUSANDS** of descriptions)
4. Set up auto-reload if desired

**Recommendation:** Start with $5. At ~$0.15 per 1000 descriptions, this gives you **33,000+ descriptions**!

---

## Cost Monitoring

Track your usage at: [OpenAI Usage Dashboard](https://platform.openai.com/usage)

You'll see:
- Daily API calls
- Cost per day
- Current balance

**Set a limit:** Go to Settings → Limits and set a monthly budget (e.g., $10/month)

---

## Advantages of OpenAI Over Gemini

| Feature | OpenAI (GPT-4o-mini) | Gemini (2.0 Flash) |
|---------|---------------------|-------------------|
| **Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good |
| **Brand Voice** | Better at nuance | Good |
| **Cost** | ~$0.15/1000 | ~$0.05/1000 |
| **Speed** | 1-2 seconds | 1-2 seconds |
| **Reliability** | Excellent | Excellent |
| **Documentation** | Best in class | Good |
| **Support** | Excellent | Good |

---

## Example API Call

Here's what happens when you click "AI Generate":

```typescript
// User inputs:
Name: "Cherry Blossom Portrait"
Category: "Art Prints"
Keywords: "spring, delicate, feminine"

// ChatGPT generates:
"Delicate petals frame a serene portrait, blending spring's ephemeral beauty with the soft, layered textures of traditional ukiyo-e. A quiet celebration of renewal."
```

**Response time:** ~1-2 seconds
**Cost:** $0.00015 (0.015 cents)

---

## Troubleshooting

### "Error generating description. Please check your API key."

**Solutions:**
1. Verify `OPENAI_API_KEY` is in `.env.local`
2. Check key starts with `sk-proj-` or `sk-`
3. Ensure you have credits in your OpenAI account
4. Restart dev server: `npm run dev`

### "Insufficient credits"

1. Go to [Billing](https://platform.openai.com/settings/organization/billing/overview)
2. Add credits ($5 minimum)
3. Wait 1-2 minutes for activation

### "Rate limit exceeded"

Free tier limits: 3 requests/minute

**Solution:**
- Upgrade to Tier 1 (automatically happens after spending $5)
- Tier 1: 500 requests/minute

---

## Your ChatGPT Plus Membership

**You can keep it!** Your Plus membership is still valuable for:
- Web-based ChatGPT access
- Priority during high traffic
- Latest features first
- GPT-4 Turbo web access

The API is **separate** and billed differently (much cheaper for your use case).

---

## Advanced: Customizing Prompts

Want different description styles? Edit the prompt in `lib/gemini.ts`:

```typescript
const prompt = `You are a senior copywriter for "TSUYA NO UCHI"...

Product Name: ${name}
Category: ${category}
Keywords/Vibe: ${keywords}

Tone: Minimalist, poetic, exclusive, high-end...
// Add your custom instructions here!
`
```

Try different tones:
- "Playful and modern"
- "Dark and mysterious"
- "Bright and uplifting"
- "Traditional and reverent"

---

## Next Steps

1. ✅ Get your API key
2. ✅ Add to `.env.local`
3. ✅ Restart server
4. ✅ Test in admin dashboard
5. 🎉 Generate amazing descriptions!

---

**Questions?** Check the [OpenAI API Documentation](https://platform.openai.com/docs/introduction)


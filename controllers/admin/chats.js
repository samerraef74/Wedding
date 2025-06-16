import User from "../../models/User.js";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET handler: render chat page
const chat_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("admin/chats", {
      title: "Chats",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// POST handler: get message from user and send to OpenAI
const chat_post = async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Call OpenAI chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

export default { chat_get, chat_post };

import User from "../../models/User.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat_get = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("user/chat", { title: "User Chat", user });
};

export const chat_post = async (req, res) => {
  const userMessage = req.body.message;

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
  });

  const reply = aiResponse.choices[0].message.content;
  res.json({ reply });
};

export default { chat_get, chat_post };

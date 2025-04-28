import discord, asyncio, json, pathlib
from runner import run_graph
import globals

intents = discord.Intents.default()
bot = discord.Client(intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

    graph_json = pathlib.Path(r"C:\Users\frank\Documents\dissertation\Dissertation\backend\graph_workspace\flow.json").read_text()
    await run_graph(graph_json, "components", bot=bot)   # 👈 pass the Client

bot.run(globals.TOKEN)

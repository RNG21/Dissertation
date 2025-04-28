import discord, asyncio, json, pathlib
from runner import run_graph

intents = discord.Intents.default()
bot = discord.Client(intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

    graph_json = pathlib.Path(r"C:\Users\frank\Documents\dissertation\Dissertation\backend\graph_workspace\flow.json").read_text()
    await run_graph(graph_json, "components", bot=bot)   # 👈 pass the Client

bot.run("MTM2NjMwOTI0ODg0OTU0NzMyNg.GEK0iJ.B-zYZ45IWNeSoaM4XmiOzkUeYErGjoCM4K7f-0")

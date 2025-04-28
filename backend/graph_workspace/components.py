from blocks import block
import random
import discord 

@block("Random Number")
def random_int(low: int, high: int) -> int:
    return random.randint(low, high)

@block("Send Message")
async def send(channel_id: int, text: str, bot: discord.Client) -> None:
    channel = bot.get_channel(channel_id)
    if channel:
        await channel.send(text)

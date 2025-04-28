from blocks import block
import random
import globals
import discord 
from discord import Message, TextChannel

@block("Random Number")
def random_int(low: int = 1, high: int = 10) -> int:
    """Generates a random number

    :param low: minimum number (inclusive)
    :param high: maximum number (inclusive)
    :return: A random number between the range provided
    """
    return random.randint(low, high)

@block("Send Message")
async def send(channel_id: int | TextChannel, text: str | Message) -> None:
    """Sends a message to a channel

    :param channel_id: ID of channel to send the message to
    :param text: The message to send
    """
    if isinstance(channel_id, TextChannel):
        channel = channel_id
    elif type(channel_id) == int:
        channel = globals.bot.fetch_channel(channel_id)
    else:
        raise Exception("Parameter \"channel_id\" must be either integer or a TextChannel object")
    await channel.send(text)

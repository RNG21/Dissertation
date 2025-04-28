from blocks import block
import random
import discord 
from discord import Message

@block("Random Number")
def random_int(low: int = 1, high: int = 10) -> int:
    """Generates a random number

    :param low: minimum number (inclusive)
    :param high: maximum number (inclusive)
    :return: A random number between the range provided
    """
    return random.randint(low, high)

@block("Send Message")
async def send(channel_id: int, text: Message) -> None:
    """Sends a message to a channel

    :param channel_id: ID of channel to send the message to
    :param text: The message to send
    """
    if channel:
        await channel.send(text)

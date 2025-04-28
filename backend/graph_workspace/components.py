from blocks import block
import random
import globals
import discord 
from discord import Message, TextChannel
from blocks import block
from discord import Interaction

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

@block("Edit Message")
async def edit_message(message: Message, new_text: str) -> None:
    """Edit an existing message

    :param message: the Message object to edit
    :param new_text: the new text content
    """
    await message.edit(content=new_text)

@block("Lowercase String")
def to_lower(text: str) -> str:
    """Convert a string to lowercase

    :param text: input string
    :return: lowercased string
    """
    return text.lower()


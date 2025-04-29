import random
from typing import Any

from discord import Interaction
from discord import Message
from discord.abc import Messageable

import globals
from blocks import block


@block("Set Bot Token")
def set_var(token: str) -> None:
    """Set the bot's token

    :param token: The bot's token aquired from discord developer portal
    """
    setattr(globals, "TOKEN", token)

@block("Get Variable")
def get_var(name: str, default: Any = None) -> Any:
    """Gets value of a variable

    :param name: The variable name to look up.
    :param default: Optional value to return if the variable is missing.
    :return: The current value of the variable (or *default* if absent).
    """
    return getattr(globals, name, default)

@block("Set Variable")
def set_var(name: str, value: Any) -> None:
    """Set or create a variable

    :param name: Variable name
    :param value: The value to store.
    """
    setattr(globals, name, value)

@block("Random Number")
def random_int(low: int = 1, high: int = 10) -> int:
    """Generates a random number

    :param low: minimum number (inclusive)
    :param high: maximum number (inclusive)
    :return: A random number between the range provided
    """
    return random.randint(low, high)

@block("Send Message")
async def send(channel_id: int | Messageable, text: str | Message) -> None:
    """Sends a message to a channel

    :param channel_id: ID of channel to send the message to
    :param text: The message to send
    """
    if isinstance(channel_id, Messageable):
        channel = channel_id
    elif isinstance(channel_id, Interaction):
        channel = channel_id.channel
    elif type(channel_id) == int:
        channel = globals.bot.fetch_channel(channel_id)
    else:
        raise Exception("Parameter \"channel_id\" must be either integer or a Messageable")
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


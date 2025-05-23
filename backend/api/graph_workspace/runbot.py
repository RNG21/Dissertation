import os
import discord
import json
import pathlib
from inspect import Parameter, Signature

import requests
from .graph_runner import run_graph
import api.graph_workspace.globals as globals
from discord import app_commands


API_BASE_URL = os.environ.get('API_BASE_URL', "http://127.0.0.1:8000")


class FlowBot(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.default())
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        flows = requests.get(f'{API_BASE_URL}/api/flows').json()

        PY_TYPES = {"string": str, "integer": int, "boolean": bool}

        def build_handler(node: dict, flow: dict):
            """Return a coroutine whose signature mirrors node['options']"""
            # ---------- build the extra parameters ----------
            extra_params = []
            for opt in node.get("options", []):
                extra_params.append(
                    Parameter(
                        opt["name"],                               # ← slash-option name
                        kind=Parameter.POSITIONAL_OR_KEYWORD,
                        annotation=PY_TYPES.get(opt["type"], str), # str/int/bool…
                        default=Parameter.empty                   # omit default → required
                    )
                )

            # ---------- the real coroutine ----------
            async def _handler(interaction: discord.Interaction, **kwargs):
                # push option values into the graph as constants
                consts = {f"{node['id']}.{k}": v for k, v in kwargs.items()}

                # 👇 NEW — satisfy the “ctx” output expected by the graph
                consts[f"{node['id']}.ctx"] = interaction

                # keep the old alias around in case blocks look it up directly
                consts[f"{node['id']}.interaction"] = interaction

                flow_with_const = {
                    **flow,
                    "constants": {**flow.get("constants", {}), **consts},
                }

                await run_graph(
                    flow_with_const,              # no json.dumps needed
                    module_name="api.graph_workspace.components",
                    bot=interaction.client,
                    interaction=interaction,
                )

                if not interaction.response.is_done():
                    await interaction.response.defer()

            # ---------- stitch the signature in ----------
            _handler.__signature__ = Signature((
                Parameter(
                    "interaction",
                    kind=Parameter.POSITIONAL_OR_KEYWORD,
                    annotation=discord.Interaction
                ),
                *extra_params
            ))

            return _handler

        # Register one slash command for each start_command node
        for flow in flows:
            for node in flow["nodes"]:
                if node["code_id"] != "__slash__":
                    continue
                cmd_name = node["command"]
                handler  = build_handler(node, flow)

                # Register it manually via Command object
                self.tree.add_command(
                    app_commands.Command(
                        name        = cmd_name,
                        description = node["description"],
                        callback    = handler,
                    )
                )

        await self.tree.sync()

    async def on_ready(self):
        print(f"Logged in as {self.user}")

if __name__ == "__main__":
    FlowBot().run(globals.TOKEN)

# runbot.py  – full replacement
import json, pathlib, discord
from discord import app_commands
from runner import run_graph
import globals                     # holds TOKEN etc.

class FlowBot(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.default())
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        flow = json.loads((pathlib.Path(__file__).parent / 'flow.json').read_text(encoding='utf-8'))

        # Helper that returns a *real* callback with the node baked in
        def make_handler(node: dict):
            async def callback(interaction: discord.Interaction):
                # Inject the Interaction so the start node can read it
                const_key = f"{node['id']}.interaction"
                flow_with_const = {
                    **flow,
                    "constants": {const_key: interaction, **flow.get("constants", {})},
                }

                await run_graph(
                    json.dumps(flow_with_const),
                    module_name="components",
                    bot=self,
                    interaction=interaction,   # still available for other blocks
                )

                # If nothing replied, at least defer
                if not interaction.response.is_done():
                    await interaction.response.defer()

            return callback

        # Register one slash command for each start_command node
        for node in flow["nodes"]:
            if node["code_id"] != "start_command":
                continue
            cmd_name = node["command_name"]
            handler  = make_handler(node)

            # Register it manually via Command object
            self.tree.add_command(
                app_commands.Command(
                    name        = cmd_name,
                    description = f"Auto-generated /{cmd_name}",
                    callback    = handler,
                )
            )

        await self.tree.sync()

    async def on_ready(self):
        print(f"Logged in as {self.user}")

if __name__ == "__main__":
    FlowBot().run(globals.TOKEN)

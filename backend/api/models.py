from django.db import models

class Flows(models.Model):
    flowId = models.AutoField(primary_key=True)
    nodes = models.JSONField()
    edges = models.JSONField()
    name = models.CharField(max_length=50)

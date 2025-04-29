from rest_framework import serializers
from .models import Flows

class FlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flows
        fields = '__all__'

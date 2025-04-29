from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Flows
from .serializers import FlowSerializer

from .graph_workspace import globals, runbot

class FlowsView(APIView):
    @staticmethod
    def save_flow(request: Request, instance=None):
        request.data.pop('flowId')
        serializer = FlowSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        flows = Flows.objects.all()
        serializer = FlowSerializer(flows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, format=None):
        return FlowsView.save_flow(request)
    
    def put(self, request: Request, format=None):
        flowId = request.data.get("flowId")
        if not flowId:
            return Response({"error": "ID is required in payload."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = Flows.objects.get(pk=flowId)
        except Flows.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return FlowsView.save_flow(request, instance)

    def delete(self, request, format=None):
        flowId = request.data.get("flowId")
        if not flowId:
            return Response({"error": "Flow ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            flow = Flows.objects.get(pk=flowId)
            flow.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Flows.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

class RunBotView(APIView):
    def post(self, request: Request, format=None):
        globals.TOKEN = request.data['token']
        runbot.FlowBot().run(globals.TOKEN)

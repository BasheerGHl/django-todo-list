from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializer
from .models import Task




##############################
#       api_overview         # 
##############################
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail View": "/task-detial/<str:pk>",
        "Create":"/task-create/",
        "Update":"/task-update/<str:pk>",
        "Delete":"/task-delete/<str:pk>",
    }

    return Response(api_urls)

##############################
#          task List         # 
##############################
@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all().order_by('-id')
    serialize = TaskSerializer(tasks, many=True)
    return Response(serialize.data)


##############################
#         task detials       # 
##############################
@api_view(['GET'])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    serialize = TaskSerializer(tasks, many=False)
    return Response(serialize.data)

##############################
#         task Post          # 
##############################
@api_view(['POST'])
def taskCreate(request):
    serialize = TaskSerializer(data=request.data)

    if serialize.is_valid():
        serialize.save()
    return Response(serialize.data)


##############################
#         task update        # 
##############################
@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    serialize = TaskSerializer(instance=task, data=request.data)

    if serialize.is_valid():
        serialize.save()
    return Response(serialize.data)

##############################
#         task delete        # 
##############################
@api_view(['DELETE'])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response("item deleted")

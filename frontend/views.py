from django.shortcuts import render

##############################
#            Home            # 
##############################
def home(request):
    context = {}
    return render(request, 'frontend/home.html', context)

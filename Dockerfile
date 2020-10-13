FROM python:3
EXPOSE 8087
ADD comm_og_service_tool.py 

RUN pip install pystrich

CMD [ "python", "./mainscript.py" ]

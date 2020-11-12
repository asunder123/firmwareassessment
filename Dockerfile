FROM ubuntu:18.04
ADD comm_og_service_tool.py /
RUN pip install pystrich
CMD [ "python", "./comm_og_service_tool.py" ]
FROM python:3
EXPOSE 8084	
ADD comm_og_service_tool.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./comm_og_service_tool.py" ]

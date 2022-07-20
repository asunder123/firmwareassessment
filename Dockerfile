FROM ubuntu:18.04
ADD *.py /
EXPOSE 8085
FROM python:3.11.0b1-slim-bullseye
EXPOSE 8084	
ADD comm_og_service_tool.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./comm_og_service_tool.py" ]

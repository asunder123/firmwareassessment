FROM python:3
EXPOSE 8084	
ADD comm_og_service_tool.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./*.py" ]

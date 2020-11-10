FROM python:3
EXPOSE 8084
ADD *.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./*.py" ]

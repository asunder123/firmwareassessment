FROM python:3
EXPOSE 8084
ADD *.py /

RUN pip install pystrich

CMD [ "python", "./mainscript.py" ]

FROM python:3
EXPOSE 8083
ADD *.py /
ADD *.html /
RUN pip install pystrich
CMD [ "python", "./mainscript.py" ]

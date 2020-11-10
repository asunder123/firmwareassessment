FROM ubuntu:18.04
EXPOSE 8083
ADD *.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./*.py" ]

FROM python:3
FROM jenkins/jenkins:latest
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=true
EXPOSE 8083
ADD *.py /
ADD *.sh /
RUN pip install pystrich
CMD [ "python", "./*.py" ]

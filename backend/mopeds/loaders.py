from django.template import Origin, TemplateDoesNotExist
from django.template.loaders.base import Loader

from pages.models import Layout


class LayoutLoader(Loader):
    @staticmethod
    def get_contents(origin):
        try:
            return Layout.objects.get(slug=origin.name).content
        except Layout.DoesNotExist:
            raise TemplateDoesNotExist(origin)

    def get_template_sources(self, template_name):
        yield Origin(
            name=template_name,
            template_name=template_name,
            loader=self,
        )

import json
from pathlib import Path

from django.core.management.base import BaseCommand

from api.models import Translation


def flatten(prefix, data, out):
    for key, value in data.items():
        full_key = f'{prefix}.{key}' if prefix else key
        if isinstance(value, dict):
            flatten(full_key, value, out)
        else:
            out[full_key] = value


class Command(BaseCommand):
    help = 'Seeds translations into the database from {locale}.json message files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            default='../front/src/messages',
            help='Directory containing {locale}.json message files',
        )

    def handle(self, *args, **options):
        messages_dir = Path(options['path'])
        if not messages_dir.is_dir():
            self.stderr.write(self.style.ERROR(
                f'Messages directory not found: {messages_dir.resolve()}'
            ))
            raise SystemExit(1)

        created_total = 0
        updated_total = 0
        removed_total = 0
        for locale_file in sorted(messages_dir.glob('*.json')):
            locale = locale_file.stem
            data = json.loads(locale_file.read_text(encoding='utf-8'))

            flat = {}
            flatten('', data, flat)

            existing = set(Translation.objects.filter(locale=locale).values_list('key', flat=True))
            created = len(flat.keys() - existing)
            updated = len(flat) - created
            Translation.objects.bulk_create(
                [Translation(key=key, locale=locale, value=value) for key, value in flat.items()],
                update_conflicts=True,
                unique_fields=['key', 'locale'],
                update_fields=['value', 'updated_at'],
            )

            removed, _ = Translation.objects.filter(
                locale=locale,
            ).exclude(key__in=flat).delete()

            created_total += created
            updated_total += updated
            removed_total += removed
            self.stdout.write(self.style.SUCCESS(
                f'{locale}: {created} created, {updated} updated, {removed} removed'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'Done. {created_total} created, {updated_total} updated, '
            f'{removed_total} removed in total.'
        ))

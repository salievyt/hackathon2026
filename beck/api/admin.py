from zoneinfo import ZoneInfo

from django.contrib import admin
from django.db.models import Count, Q
from django.utils import timezone
from django.utils.html import format_html

from .models import (
    BrandBook,
    BrandColor,
    BrandRule,
    BrandTypeScale,
    FaqItem,
    Member,
    Participant,
    Partner,
    PartnerAdvantage,
    PartnerAsset,
    PartnerLead,
    PartnerPackage,
    PartnerProfile,
    PartnerSectionConfig,
    SiteConfig,
    Track,
    Translation,
)


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('applicant', 'telegram_link', 'role_badge', 'submitted')
    list_display_links = ('applicant',)
    list_filter = ('role', 'created_at')
    search_fields = ('name', 'email', 'telegram')
    search_help_text = 'Поиск по имени, почте или Telegram'
    ordering = ('-created_at', '-pk')
    list_per_page = 25
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Контакты участника', {'fields': ('name', 'telegram', 'email')}),
        ('Заявка', {'fields': ('role', 'created_at')}),
    )
    change_list_template = 'admin/participant_applications.html'

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)
        context = getattr(response, 'context_data', None)
        if context and 'cl' in context:
            now = timezone.localtime(timezone.now(), ZoneInfo('Asia/Bishkek'))
            midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
            context['summary'] = self.get_queryset(request).aggregate(
                total=Count('pk'), today=Count('pk', filter=Q(created_at__gte=midnight)),
                reachable=Count('pk', filter=~Q(telegram='')),
            )
        return response

    def get_search_results(self, request, queryset, search_term):
        return super().get_search_results(request, queryset, search_term.strip().removeprefix('@'))

    @admin.display(description='Участник', ordering='name')
    def applicant(self, obj):
        return format_html('<strong>{}</strong><small class="d-block text-muted">{}</small>', obj.name, obj.email)

    @admin.display(description='Telegram', empty_value='Не указан')
    def telegram_link(self, obj):
        if obj.telegram:
            return format_html('<a href="https://t.me/{}" target="_blank" rel="noopener noreferrer">@{}</a>', obj.telegram, obj.telegram)
        return None

    @admin.display(description='Поступила · Бишкек', ordering='created_at')
    def submitted(self, obj):
        return timezone.localtime(obj.created_at, ZoneInfo('Asia/Bishkek')).strftime('%d.%m.%Y · %H:%M')

    @admin.display(description='Роль', ordering='role')
    def role_badge(self, obj):
        roles = {
            'developer': ('primary', 'Разработчик'), 'designer': ('info', 'Дизайнер'),
            'product': ('success', 'Продакт'), 'student': ('secondary', 'Студент'),
        }
        color, label = roles.get(obj.role, ('light', obj.role))
        return format_html('<span class="badge badge-pill badge-{}">{}</span>', color, label)


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = ('key', 'locale', 'value', 'updated_at')
    list_filter = ('locale',)
    search_fields = ('key', 'value')
    list_editable = ('value',)
    ordering = ('locale', 'key')
    list_per_page = 50


class FaqItemInline(admin.TabularInline):
    model = FaqItem
    extra = 1
    ordering = ('order', 'id')
    fields = ('order', 'is_active', 'question', 'answer')


class BrandColorInline(admin.TabularInline):
    model = BrandColor
    extra = 0
    ordering = ('order', 'id')
    fields = ('order', 'hex_value', 'label', 'usage')


class BrandTypeScaleInline(admin.TabularInline):
    model = BrandTypeScale
    extra = 0
    ordering = ('order', 'id')
    fields = ('order', 'label', 'size', 'weight', 'tracking', 'mono')


class BrandRuleInline(admin.TabularInline):
    model = BrandRule
    extra = 0
    ordering = ('order', 'id')
    fields = ('order', 'kind', 'text')


@admin.register(BrandBook)
class BrandBookAdmin(admin.ModelAdmin):
    list_display = ('name_preview', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [BrandColorInline, BrandTypeScaleInline, BrandRuleInline]

    @admin.display(description='Name (en)')
    def name_preview(self, obj):
        return obj.name.get('en', '')


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = ('event_start', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [FaqItemInline]


class ContentAdmin(admin.ModelAdmin):
    list_display = ('name_display', 'slug', 'order', 'is_active', 'updated_at')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Track)
class TrackAdmin(ContentAdmin):
    @admin.display(description='Name')
    def name_display(self, obj):
        return obj.name.get('en', obj.slug)


@admin.register(Member)
class MemberAdmin(ContentAdmin):
    list_display = ('name', 'category', 'role_preview', 'company', 'order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'company')

    @admin.display(description='Role (en)')
    def role_preview(self, obj):
        return obj.role.get('en', '')


@admin.register(Partner)
class PartnerAdmin(ContentAdmin):
    list_display = ('name', 'order', 'is_active', 'updated_at')


class PartnerAdvantageInline(admin.TabularInline):
    model = PartnerAdvantage
    extra = 0
    ordering = ('order', 'id')
    fields = ('order', 'title', 'description')


@admin.register(PartnerSectionConfig)
class PartnerSectionConfigAdmin(admin.ModelAdmin):
    list_display = ('contact_name', 'contact_email', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PartnerAdvantageInline]


@admin.register(PartnerPackage)
class PartnerPackageAdmin(admin.ModelAdmin):
    list_display = ('label_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')

    @admin.display(description='Label (en)')
    def label_preview(self, obj):
        return obj.label.get('en', '')


@admin.register(PartnerAsset)
class PartnerAssetAdmin(admin.ModelAdmin):
    list_display = ('title_preview', 'order', 'file')
    ordering = ('order', 'id')

    @admin.display(description='Title (en)')
    def title_preview(self, obj):
        return obj.title.get('en', '')


@admin.register(PartnerLead)
class PartnerLeadAdmin(admin.ModelAdmin):
    list_display = ('company', 'contact_name', 'contact_email', 'package', 'status', 'created_at')
    list_editable = ('status',)
    list_filter = ('status', 'package')
    search_fields = ('company', 'contact_name', 'contact_email')
    readonly_fields = ('created_at',)


@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display = ('email', 'partner', 'updated_at')
    search_fields = ('user__username', 'user__email', 'partner__name')
    readonly_fields = ('created_at', 'updated_at')

    @admin.display(description='Email')
    def email(self, obj):
        return obj.user.email or obj.user.username

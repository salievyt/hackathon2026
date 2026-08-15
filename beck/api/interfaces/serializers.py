from rest_framework import serializers

from api.models import (
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
    PartnerSectionConfig,
    SiteConfig,
    Track,
)
from api.application.content import get_active_partner_packages, get_partner_assets


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'name', 'email', 'role', 'created_at']


class SiteConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfig
        fields = ['event_start']


class PartnerAdvantageSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = PartnerAdvantage
        fields = ['id', 'title', 'description', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_title(self, obj):
        return obj.translated_title(self.locale)

    def get_description(self, obj):
        return obj.translated_description(self.locale)


class PartnerPackageSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    perks = serializers.SerializerMethodField()

    class Meta:
        model = PartnerPackage
        fields = ['id', 'label', 'description', 'perks', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_label(self, obj):
        return obj.translated_label(self.locale)

    def get_description(self, obj):
        return obj.translated_description(self.locale)

    def get_perks(self, obj):
        return obj.translated_perks(self.locale)


class PartnerAssetSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = PartnerAsset
        fields = ['id', 'title', 'file', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_title(self, obj):
        return obj.translated_title(self.locale)


class PartnerSectionSerializer(serializers.Serializer):
    description = serializers.SerializerMethodField()
    contact_name = serializers.SerializerMethodField()
    contact_email = serializers.SerializerMethodField()
    contact_phone = serializers.SerializerMethodField()
    advantages = serializers.SerializerMethodField()
    packages = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()

    @property
    def locale(self):
        return self.context['locale']

    def get_description(self, obj):
        return obj.translated_description(self.locale)

    def get_contact_name(self, obj):
        return obj.contact_name

    def get_contact_email(self, obj):
        return obj.contact_email

    def get_contact_phone(self, obj):
        return obj.contact_phone

    def get_advantages(self, obj):
        return PartnerAdvantageSerializer(
            obj.advantages.all(),
            many=True,
            context=self.context,
        ).data

    def get_packages(self, obj):
        return PartnerPackageSerializer(
            get_active_partner_packages(),
            many=True,
            context=self.context,
        ).data

    def get_assets(self, obj):
        return PartnerAssetSerializer(
            get_partner_assets(),
            many=True,
            context=self.context,
        ).data


class PartnerLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerLead
        fields = [
            'id', 'company', 'contact_name', 'contact_email',
            'contact_phone', 'package', 'message', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class PartnerMeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField()
    participant_count = serializers.IntegerField()
    partner = serializers.SerializerMethodField()
    lead = serializers.SerializerMethodField()

    @property
    def locale(self):
        return self.context['locale']

    def get_partner(self, obj):
        partner = obj.get('partner')
        if not partner:
            return None
        return {
            'name': partner.name,
            'url': partner.url,
            'order': partner.order,
            'logo': partner.logo.url if partner.logo else None,
        }

    def get_lead(self, obj):
        lead = obj.get('lead')
        if not lead:
            return None
        return {
            'company': lead.company,
            'status': lead.status,
            'package': lead.package.translated_label(self.locale) if lead.package else None,
        }


class BrandColorSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    usage = serializers.SerializerMethodField()
    hex = serializers.CharField(source='hex_value', read_only=True)

    class Meta:
        model = BrandColor
        fields = ['id', 'label', 'hex', 'usage', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_label(self, obj):
        return obj.translated_label(self.locale)

    def get_usage(self, obj):
        return obj.translated_usage(self.locale)


class BrandTypeScaleSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = BrandTypeScale
        fields = ['id', 'label', 'size', 'weight', 'tracking', 'mono', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_label(self, obj):
        return obj.translated_label(self.locale)


class BrandRuleSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()

    class Meta:
        model = BrandRule
        fields = ['id', 'kind', 'text', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_text(self, obj):
        return obj.translated_text(self.locale)


class BrandBookSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    tagline = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    logo = serializers.ImageField(read_only=True)
    colors = BrandColorSerializer(many=True, read_only=True)
    type_scale = BrandTypeScaleSerializer(many=True, read_only=True)
    rules = BrandRuleSerializer(many=True, read_only=True)

    class Meta:
        model = BrandBook
        fields = [
            'id', 'name', 'tagline', 'description', 'logo',
            'font_family', 'font_mono', 'colors', 'type_scale', 'rules',
        ]

    @property
    def locale(self):
        return self.context['locale']

    def get_name(self, obj):
        return obj.translated_name(self.locale)

    def get_tagline(self, obj):
        return obj.translated_tagline(self.locale)

    def get_description(self, obj):
        return obj.translated_description(self.locale)


class FaqItemSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()

    class Meta:
        model = FaqItem
        fields = ['id', 'question', 'answer', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_question(self, obj):
        return obj.translated_question(self.locale)

    def get_answer(self, obj):
        return obj.translated_answer(self.locale)


class TrackSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ['id', 'name', 'description', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_name(self, obj):
        return obj.translated_name(self.locale)

    def get_description(self, obj):
        return obj.translated_description(self.locale)


class MemberSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ['id', 'name', 'role', 'company', 'avatar', 'order']

    @property
    def locale(self):
        return self.context['locale']

    def get_role(self, obj):
        return obj.translated_role(self.locale)


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo', 'url', 'order']
